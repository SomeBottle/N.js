'use strict';
import * as utils from "./utils.js";
import HitBox from "./hitbox.js";
import Monitor from "./monitor.js";
import List from "./list.js";
import { danmakuDefaultAttrs } from "./configs.js";

export default class Danmaku {
    /**
     * 以容器元素为单位构造弹幕实例
     * @param {String|Element} container 元素或者元素ID 
     * @param {String} prefix 弹幕标识的前缀
     * @param {String|Number} zIndex 弹幕层的z-index
     */
    constructor(container, prefix = '', zIndex = 'auto') {
        const target = (container instanceof Element) ? container : document.getElementById(container);
        if (!target) {
            utils.output('Error: container element not found', 3);
            return null;
        }
        // 记录操纵的容器（如果传入的是字符串，则认为是容器的ID）
        this.target = target;
        // 弹幕标识的前缀
        this.prefix = prefix;
        // 初始化当前发送的弹幕样式和属性
        this.resetAttrs();
        // 本容器弹幕状态(running/paused)
        this.state = 'running';
        // 修改容器本身position
        utils.styling(target, 'position', 'relative');
        // 创建容器的弹幕层
        let dmLayer;
        if (target.querySelector('.N-dmLayer')) {
            // 弹幕层已经存在
            dmLayer = target.querySelector('.N-dmLayer');
        } else {
            // 弹幕层不存在，就创建一个
            dmLayer = document.createElement('div');
            utils.styling(dmLayer, ['width', 'height', 'top', 'left'], ['100%', '100%', '0px', '0px']);
            // 弹幕层class名为N-dmLayer
            dmLayer.className = 'N-dmLayer';
            // 将弹幕层添加到容器中
            target.appendChild(dmLayer);
        }
        // 更改弹幕层深度
        utils.styling(dmLayer, 'z-index', zIndex);
        this.dmLayer = dmLayer;
        // 给容器生成一个弹幕碰撞箱实例
        this.hitBox = new HitBox(dmLayer);
        // 为容器添加一个弹幕监视实例
        this.monitor = new Monitor();
        // 为容器绑定列表方法
        this.list = new List(dmLayer, this);
    }
    /**
     * 获得容器弹幕统计信息
     */
    get statistics() {
        let report = this.monitor.statistics();
        report['global_state'] = this.state;
        return report;
    }
    /**
     * 重置容器发送弹幕的样式
     * @note 恢复成configs.js的配置
     */
    resetAttrs() {
        // 迫真深复制对象
        this.currentAttrs = Object.assign({}, danmakuDefaultAttrs);
        this.currentAttrs['custom_css'] = Object.assign({}, this.currentAttrs['custom_css']);
        return this;
    }
    /**
     * 重置弹幕生成范围
     * @note 恢复成configs.js的配置
     */
    resetRange() {
        this.hitBox.resetHitSets();
        return this;
    }
    /**
     * 创建一条弹幕
     * @param {*} text 弹幕文本 
     * @param {Function} created 在弹幕刚创建后调用的函数(可以不传入)
     * @param {Function} callback 该条弹幕消失后的回调函数（可以不传入）
     * @note hook(刚创建的弹幕元素,弹幕唯一id)
     * @note callback第一个参数会传入弹幕id
     */
    create(text, created = null, callback = null) {
        if (this.dmLayer.offsetWidth <= 0 || this.dmLayer.parentNode === null) {
            // 检查发现弹幕层不存在，不进行创建
            utils.output('Warning: Danmaku layer not found.', 2);
            return this;
        }
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
            reversed = dmAttrs['reverse'],
            // 弹幕是否接受鼠标事件
            pointerEvents = dmAttrs['pointer_events'];
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
            'pointer-events': pointerEvents ? 'auto' : 'none', // 是否接受鼠标事件
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
        // 弹幕唯一ID
        let dmSerial = null;
        // 根据不同弹幕类型，进行不同处理
        switch (dmAttrs['type']) {
            case 'scroll':  // 普通滚动弹幕
            case 'random':  // 随机高度滚动弹幕
            case 'midscroll':  // 中间滚动弹幕
                newDm.classList.add(
                    'N-scroll-playing', // 动画播放样式
                    reversed ? 'N-scroll-reversed' : 'N-scroll-forward', // 正向还是逆向
                    'N-scroll' // 滚动样式
                );
                // 添加到运动监视
                dmSerial = this.monitor.newScroll(newDm, dmAttrs['type'], reversed, callback);
                break;
            case 'top':  // 顶部弹幕
            case 'bottom':  // 底部弹幕
            case 'midhang':  // 中间弹幕
                newDm.classList.add('N-hanging'); // 悬停样式
                // 添加到生命监视
                dmSerial = this.monitor.newHang(newDm, dmAttrs['type'], dmAttrs['life'], callback);
                break;
            default:
                // 未知弹幕类型
                utils.output('Error: Unknown danmaku type.', 3);
                this.dmLayer.removeChild(newDm);
                return this;
        }
        // 让碰撞模块来设定弹幕在容器中的位置
        this.hitBox.setDanmakuPos(newDm, dmAttrs);
        // 设置新弹幕的id（前提是设定了前缀）
        if (this.prefix) {
            newDm.id = `N-danmaku-${this.prefix}-${dmSerial}`;
        }
        // 刚创建后调用函数
        if (created)
            created(newDm, dmSerial);
        return this; // 链式语法
    }
    /**
     * 清空容器中部分弹幕
     * @param {String} type 类型: 同attrs中的
     * @param {Boolean|String} reversed 是否为逆向弹幕，还可以传入all，代表所有方向
     * @note 不传入参数则清空所有弹幕，type和reversed可以传入'all'，代表所有
     * @note type还可以传入'scrolling'，代表所有滚动弹幕；'hanging'，代表所有悬停弹幕
     */
    clearSome(type = '', reversed = 'all') {
        switch (type) {
            case 'random':
            case 'scroll':
            case 'midscroll':
                this.monitor.clearSomeScrolling(type, reversed);
                break;
            case 'top':
            case 'bottom':
            case 'midhang':
                this.monitor.clearSomeHanging(type);
                break;
            case 'all':
                this.monitor.clearSomeScrolling('all', reversed);
                this.monitor.clearSomeHanging('all');
                break;
            case 'scrolling':
                this.monitor.clearSomeScrolling('all', reversed);
                break;
            case 'hanging':
                this.monitor.clearSomeHanging();
                break;
            default:
                this.monitor.clearSomeScrolling();
                this.monitor.clearSomeHanging();
                break;
        }
        return this;
    }
    /**
     * 按照CSS样式清除弹幕
     * @param {Object} styles CSS样式组成的对象 
     * @note 这个方法实际上是monitor中方法的套皮
     * @note 支持取反(NOT)，在样式值前加上一个感叹号即可，比如color:!#FFF，表示color不等于#FFF
     */
    clearStyled(styles) {
        this.monitor.clearStyled(styles);
    }
    /**
     * 按id清除弹幕，如果不传入id，会直接调用clearSome删除所有
     * @param {Number} id 弹幕ID
     */
    clear(id = null) {
        if (id) {
            this.monitor.clearSingle(id);
        } else {
            this.clearSome();
        }
        return this;
    }
    /**
     * 暂停容器内所有弹幕
     * @param {Number} id 弹幕ID，如果传入，则单独暂停该弹幕
     */
    pause(id = null) {
        if (id) {
            this.monitor.pauseSingle(id);
            return this;
        }
        if (this.state == 'running') {
            // 暂停所有滚动弹幕
            this.dmLayer.classList.add('N-scroll-paused');
            // 暂停所有悬停弹幕
            this.monitor.pauseAllHanging();
            // 标记为暂停
            this.state = 'paused';
        }
        return this;
    }
    /**
     * 恢复容器内所有弹幕
     * @param {Number} id 弹幕ID，如果传入，则单独恢复该弹幕（前提：是单独被暂停了）
     */
    resume(id = null) {
        if (id) {
            this.monitor.resumeSingle(id);
            return this;
        }
        if (this.state == 'paused') {
            // 恢复所有滚动弹幕
            this.dmLayer.classList.remove('N-scroll-paused');
            // 恢复所有悬停弹幕
            this.monitor.resumeAllHanging();
            // 标记为播放
            this.state = 'running';
        }
        return this;
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
        } else if (typeof this.currentAttrs[kbj] !== 'undefined') {
            this.currentAttrs[kbj] = value;
        } else {
            utils.output(`Error: Danmaku attribute not found: ${kbj}`, 3);
        }
        return this;
    }
    /**
     * 设置弹幕在屏幕上(自起点)生成的[最小高度,最大高度]
     * @param {String|Object} types 属性名或者属性对象
     * @param {Array} value 如果kbj是属性名，这一项就是属性名对应的范围
     * @note value类似于[min,max]
     */
    range(types, value = null) {
        let maxHeight = this.hitBox.danmakuMaxHeight,
            minHeight = this.hitBox.danmakuMinHeight;
        if (types instanceof Object) { // 如果是对象
            for (let key in types) {
                if (typeof maxHeight[key] !== 'undefined') {
                    minHeight[key] = types[key][0];
                    maxHeight[key] = types[key][1];
                    // 刷新相应的弹幕碰撞集
                    this.hitBox.refreshHitSets(key);
                }
            }
        } else if (typeof maxHeight[types] !== 'undefined') {
            minHeight[types] = value[0];
            maxHeight[types] = value[1];
            // 刷新相应的弹幕碰撞集
            this.hitBox.refreshHitSets(types);
        } else {
            utils.output(`Error: Danmaku type not found: ${types}`, 3);
        }
        return this;
    }
}