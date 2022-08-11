// 弹幕行碰撞处理
// 这一部分单独拿出来写 - 50me3ottIe
'use strict';
import { styling, rand, timestamp } from "./utils.js";
import { danmakuMaxAccountFor } from "./configs.js";

export default class hitBox {
    /**
     * 构造函数
     * @param {Element} dmLayer 弹幕层元素
     */
    constructor(dmLayer) {
        this.target = dmLayer;
        this.currentCoverAttrs = danmakuMaxAccountFor;
        // 弹幕碰撞集，每个数组中弹幕按空间关系进行排序
        this.hitSets = {
            'top': [], // 顶部弹幕
            'bottom': [], // 底部弹幕
            'scroll': [], // 普通滚动弹幕
            'random': [] // 随机高度的滚动弹幕
        };
        this.refreshHitSets(); // 初始化碰撞集
    }
    /**
     * 获得对应类型弹幕最大能覆盖的高度
     * @param {String} type 
     * @returns 高度(px)
     */
    getMaxCover(type) {
        let layerHeight = this.target.offsetHeight; // 获得弹幕层高度
        return (this.currentCoverAttrs[type] * 0.01) * layerHeight;
    }
    /**
     * 刷新弹幕碰撞集
     * @param {String} type 刷新的类型
     * @note 当type不传入或者留空时，刷新所有类型
     */
    refreshHitSets(type = '') {
        let that = this,
            refresh = (type) => {
                that.hitSets[type].length = 0;
                that.hitSets[type][0] = {
                    'from': 0,
                    'to': that.getMaxCover(type),
                    'available': true, // 可用
                    'dm': null // 弹幕相关
                }
            };
        // 刷新弹幕碰撞集
        if (type) {
            refresh(type);
            return;
        }
        for (let x in this.hitSets) {
            refresh(x);
        }
    }
    /**
     * 设定弹幕元素在弹幕层中的位置
     * @param {Element} newDm 新弹幕div元素
     * @param {Object} attrs 弹幕属性
     * @note 这个方法起一个分发的作用
     */
    setDanmakuPos(newDm, attrs) {
        switch (attrs['type']) {
            case 'midscroll':
            case 'midhang':
                // 如果是位于中间的弹幕，不需要进行碰撞判断
                styling(newDm, 'top',
                    `calc(50% - ${(newDm.offsetHeight / 2)}px)`
                );
                break;
            case 'random':
                styling(newDm, 'top',
                    `${this.danmakuRandom(newDm)}px`
                );
                break;
            case 'top':
            case 'scroll':
                styling(newDm, 'top',
                    `${this.danmakuAnchor(newDm, attrs)}px`
                );
                break;
            case 'bottom':
                styling(newDm, 'bottom',
                    `${this.danmakuAnchor(newDm, attrs)}px`
                );
                break;
        }
    }
    /**
     * 获得下一条随机滚动弹幕的距离顶部高度(px)
     * @param {Element} newDm  新弹幕div元素
     * @returns {Number} 距离顶部高度(px)
     */
    danmakuRandom(newDm) {
        let layerHeight = this.target.offsetHeight, // 弹幕层高度
            maxTop = layerHeight - newDm.offsetHeight; // 最大top值
        return rand(0, maxTop);
    }
    /**
     * 获得下一条弹幕的距离起点的高度(px)
     * @param {Element} newDm 新弹幕div元素
     * @param {Object} attrs 弹幕属性
     * @param {Boolean} retry 是否重试
     * @returns {Number} 距离起点的高度(px)
     * @note 本方法只处理scroll, top, bottom这三类弹幕
     */
    danmakuAnchor(newDm, attrs, retry = false) {
        let layerWidth = this.target.offsetWidth, // 弹幕层高度
            newDmHeight = newDm.offsetHeight,
            hitSet = this.hitSets[attrs['type']],
            verticalSpace = attrs['vertical_space'], // 弹幕纵向间距
            calcHeight = -1; // 计算出的高度
        // 遍历滚动碰撞集
        for (let i = 0, len = hitSet.length; i < len; i++) {
            let space = hitSet[i]; // 获得当前遍历到的空间
            if (space['available']) { // 空间是空闲的
                let spaceHeight = space['to'] - space['from'], // 空间高度
                    newlyOccupied = newDmHeight + verticalSpace; // 新弹幕占用的高度
                // 如果新弹幕还没分配出去(calcHeight=-1)，且有空间能塞得下新弹幕
                if (calcHeight === -1 && spaceHeight >= newlyOccupied) {
                    let freeSlice = Object.assign({}, space), // 切割后剩余的空间
                        // 新的切割后的空闲块from值
                        newFrom = space['from'] + newlyOccupied;
                    // 空间足够放下弹幕，空间开始的高度就是新弹幕的高度
                    calcHeight = space['from'];
                    space['to'] = newFrom - 1; // 更新被占用空间的to值
                    space['available'] = false;
                    space['dm'] = { // 记录弹幕信息
                        'start': timestamp(), // 弹幕创建时间
                        'life': attrs['life'], // 弹幕生命期
                        'reversed': attrs['reverse'], // 弹幕是否反向
                        'element': newDm // 弹幕元素
                    }
                    // 切割后剩余的空间，重新加入碰撞集
                    freeSlice['from'] = newFrom;
                    hitSet.splice(i + 1, 0, freeSlice);
                }
            } else { // 这里的空间被占用了
                // 检查占用的空间是否能释放了
                let createTime = space['dm']['start'], // 弹幕创建时间
                    life = space['dm']['life'], // 弹幕生命期
                    scrollReversed = space['dm']['reversed'], // 弹幕是否反向滚动
                    dmElement = space['dm']['element'], // 弹幕元素
                    releaseFlag = false; // 是否释放这条弹幕的空间
                switch (attrs['type']) {
                    case 'scroll':
                        // 对滚动弹幕来说，如果已经全部露出屏幕，就可以释放空间了
                        if (scrollReversed) {
                            // 逆向滚动（从左往右）
                            // (距左边距离>0)，说明弹幕此时全部露出屏幕
                            releaseFlag = dmElement.offsetLeft > 0;
                        } else {
                            // 正向滚动（从右往左）
                            // (距左边距离+弹幕宽度<弹幕层宽度)，说明弹幕已经全部露出屏幕，可以从碰撞集中释放
                            releaseFlag = (dmElement.offsetLeft + dmElement.offsetWidth < layerWidth);
                        }
                        break;
                    case 'top':
                    case 'bottom':
                        // 对顶部弹幕来说，如果自创建时间起已经超过生命期，就可以释放空间了
                        releaseFlag = (timestamp() - createTime > life);
                        break;

                }
                // 弹幕已经被移除了，可以直接释放空间
                if (dmElement.offsetWidth == 0 || dmElement.parentNode == null) {
                    releaseFlag = true;
                }
                // 如果空间可以释放
                if (releaseFlag) {
                    let prevSpace = hitSet[i - 1] || {}, // 前一个空间
                        nextSpace = hitSet[i + 1] || {}; // 后一个空间
                    // 邻接处理，思路来自OS的动态分区分配 - 50m3 b ot tle
                    if (prevSpace['available'] && nextSpace['available']) {
                        // 如果前一个空间和后一个空间都是空闲的，就合并这三个空间
                        prevSpace['to'] = nextSpace['to'];
                        // 从碰撞集中移除被合并的空间
                        hitSet.splice(i, 2);
                        i--; // 遍历索引回退一位
                        len -= 2; // 碰撞集长度减2
                    } else if (prevSpace['available']) {
                        // 如果只有前一个空间是空闲的，就合并这两个空间
                        prevSpace['to'] = space['to'];
                        // 从碰撞集中移除被合并的空间
                        hitSet.splice(i, 1);
                        i--; // 遍历索引回退一位
                        len--; // 碰撞集长度减1
                    } else if (nextSpace['available']) {
                        // 如果只有后一个空间是空闲的，就合并这两个空间
                        space['to'] = nextSpace['to'];
                        space['available'] = true;
                        space['dm'] = null;
                        // 从碰撞集中移除被合并的空间
                        hitSet.splice(i + 1, 1);
                        len--; // 碰撞集长度减1
                    } else {
                        // 无可邻接的空间，就直接释放这个空间
                        space['available'] = true;
                        space['dm'] = null;
                    }
                }
            }
        }
        // 如果循环结束，仍然找不到合适的位置投放弹幕，说明这一刻屏幕上爆满了，就重置碰撞集
        if (calcHeight === -1) {
            if (!retry) { // 避免死递归
                // 刷新碰撞集，这样就有空间了 
                this.refreshHitSets(attrs['type']);
                // 重试计算高度
                return this.danmakuAnchor(newDm, attrs, true);
            } else {
                // 重试了，还是算不出来，就默认为0
                // 这种情况一般是设置弹幕允许覆盖的面积过小，导致碰撞集中没有空间
                calcHeight = 0;
            }
        }
        return calcHeight;
    }
}