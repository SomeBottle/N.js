'use strict';
import * as utils from "./utils.js";
import hitBox from "./hitbox.js";
import { danmakuDefaultAttrs } from "./configs.js";

export default class Danmaku {
    /**
     * 以容器元素为单位构造弹幕实例
     * @param {String|Element} container 元素或者元素ID 
     */
    constructor(container) {
        const target = (container instanceof Element) ? container : document.querySelector(`#${container}`);
        if (!target) {
            utils.output('Error: container element not found');
            return null;
        }
        // 记录操纵的容器（如果传入的是字符串，则认为是容器的ID）
        this.target = target;
        // 弹幕计数器(包括各种弹幕分别的数量)
        this.dmCounters = {
            'scroll': 0, // 普通滚动弹幕
            'top': 0, // 顶部弹幕
            'bottom': 0, // 底部弹幕
            'mid_scroll': 0, // 中间滚动弹幕
            'mid_hanging': 0, // 中间悬浮弹幕
            'reversed_scroll': 0, // 反向滚动弹幕
            'reversed_mid_scroll': 0, // 反向中间滚动弹幕
            'random': 0, // 随机高度的滚动弹幕
            'reversed_random': 0 // 随机高度的反向滚动弹幕
        };
        // 记录当前发送的弹幕样式和属性
        this.currentAttrs = danmakuDefaultAttrs;
        // 本容器弹幕状态(running/paused)
        this.status = 'running';
        // 修改容器本身position
        utils.styling(target, 'position', 'relative');
        // 创建容器的弹幕层
        const dmLayer = document.createElement('div');
        utils.styling(dmLayer, ['width', 'height', 'top', 'left'], ['100%', '100%', '0px', '0px']);
        // 弹幕层class名为N-dmLayer
        dmLayer.className = 'N-dmLayer';
        // 将弹幕层添加到容器中
        target.appendChild(dmLayer);
        this.dmLayer = dmLayer;
        // 给容器生成一个弹幕碰撞箱实例
        this.hitBox = new hitBox(dmLayer);
    }
    /**
     * 创建一条弹幕
     * @param {*} text 弹幕文本 
     * @param {Function} callback 该条弹幕消失后的回调函数（可以不传入）
     */
    create(text, callback = null) {
        // 暂存当前弹幕属性
        let dmAttrs = this.currentAttrs,
            // 创建一个新的div作为弹幕
            newDm = document.createElement('div'),
            // 创建文字节点，待附加到newDm中
            dmText = document.createTextNode(text),
            // 先获得配置的弹幕文字大小
            textSize = dmAttrs['size'],
            // 弹幕生命时间
            life = dmAttrs['life'],
            // 是否为逆向弹幕
            reversed = dmAttrs['reverse'];
        // 记录本容器宽高
        this.height = this.target.offsetHeight;
        this.width = this.target.offsetWidth;
        // 将文字加入新弹幕Div中
        newDm.appendChild(dmText);
        // 弹幕大小设定为了null，自动计算 - 50m3B0ttle
        if (!textSize) {
            let autoSize = utils.danmakuHeight(this.target);
            // 文字大小乘上尺寸
            if (dmAttrs['scale'] > 0)
                autoSize *= dmAttrs['scale'];
            textSize = `${autoSize}px`;
        }
        // 设定弹幕样式
        utils.styling(newDm, {
            'position': 'absolute', // 所有弹幕都是绝对定位
            'font-size': textSize, // 弹幕字体大小
            'color': dmAttrs['color'], // 弹幕颜色
            'font-weight': dmAttrs['weight'], // 弹幕字体粗细
            'opacity': (dmAttrs['opacity'] * 0.01), // 弹幕透明度
            'word-break': 'keep-all', // 弹幕不换行
            'white-space': 'pre', // 保留空格
            'animation-duration': `${life}ms`, // 弹幕动画时间
            '-webkit-animation-duration': `${life}ms`,
            '-moz-animation-duration': `${life}ms`,
            '-o-animation-duration': `${life}ms`
        });
        // 如果开了描边，添加样式组
        if (dmAttrs['outline']) {
            // 通过classList API添加描边样式组
            newDm.classList.add('N-outline');
        }
        // 设定弹幕自定义样式（放在这里，可以覆盖上面的样式）
        utils.styling(newDm, dmAttrs['custom_css']);
        // 先把新弹幕加入到弹幕层中，但是opacity为0，这样hitBox的方法才能获取到弹幕的长宽
        this.dmLayer.appendChild(newDm);
        // 根据不同弹幕类型，进行不同处理
        switch (dmAttrs['type']) {
            case 'scroll':  // 普通滚动弹幕
            case 'random':  // 随机高度滚动弹幕
            case 'midscroll':  // 中间滚动弹幕
                newDm.classList.add(
                    'N-scroll-playing', // 动画播放样式
                    dmAttrs['reverse'] ? 'N-scroll-reversed' : 'N-scroll-forward', // 正向还是逆向
                    'N-scroll' // 滚动样式
                );
                break;
            case 'top':  // 顶部弹幕
            case 'bottom':  // 底部弹幕
            case 'midhang':  // 中间弹幕
                newDm.classList.add('N-hanging'); // 悬停样式
                break;
        }
        // 让碰撞模块来设定弹幕在容器中的位置
        this.hitBox.setDanmakuPos(newDm, dmAttrs);
    }
    /**
     * 设置接下来发送的弹幕的属性
     * @param {String|Object} kbj 属性名或者属性对象
     * @param {String} value 如果kbj是属性名，这一项就是属性名对应的值
     */
    attrs(kbj, value = null) {
        if (kbj instanceof Object) { // 如果是对象
            for (let key in kbj) {
                this.currentAttrs[key] = kbj[key];
            }
        } else if (this.currentAttrs[kbj]) {
            this.currentAttrs[kbj] = value;
        } else {
            utils.output(`Error: attribute not found: `, kbj);
        }
    }
}