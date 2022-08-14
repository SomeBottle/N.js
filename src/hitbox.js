// 弹幕行碰撞处理
// 这一部分单独拿出来写 - 50me3ottIe
'use strict';
import { styling, rand, timestamp } from "./utils.js";
import { danmakuMaxHeight, danmakuMinHeight } from "./configs.js";

export default class HitBox {
    /**
     * 构造函数
     * @param {Element} dmLayer 弹幕层元素
     */
    constructor(dmLayer) {
        this.target = dmLayer;
        // 弹幕空间集，每个数组中弹幕按空间关系进行排序
        this.hitSets = {
            'top': [], // 顶部弹幕
            'bottom': [], // 底部弹幕
            'scroll': [] // 普通滚动弹幕
        };
        this.resetHitSets(); // 初始化空间集
    }
    /**
     * 恢复弹幕生成范围为默认配置(configs.js内的)，并刷新空间集
     */
    resetHitSets() {
        this.danmakuMinHeight = danmakuMinHeight;
        this.danmakuMaxHeight = danmakuMaxHeight;
        this.refreshHitSets(); // 刷新空间集
    }
    /**
     * 获得对应类型弹幕至少要生成的高度
     * @param {String} type 
     * @returns 高度(px)
     */
    getMinHeight(type) {
        return (this.danmakuMinHeight[type] * 0.01) * this.target.getBoundingClientRect().height;
    }
    /**
     * 获得对应类型弹幕最大能生成的高度
     * @param {String} type 
     * @returns 高度(px)
     */
    getMaxHeight(type) {
        return (this.danmakuMaxHeight[type] * 0.01) * this.target.getBoundingClientRect().height;
    }
    /**
     * 刷新弹幕空间集
     * @param {String} type 刷新的类型
     * @note 当type不传入或者留空时，刷新所有类型
     */
    refreshHitSets(type = '') {
        // 忽略随机弹幕
        if (type == 'random') return;
        let that = this,
            refresh = (type) => {
                that.hitSets[type].length = 0;
                // 空间集需要提高一下精度，乘100后取整，精确到小数点后两位
                that.hitSets[type][0] = {
                    'from': Math.floor(that.getMinHeight(type) * 100),
                    'to': Math.floor(that.getMaxHeight(type) * 100),
                    'available': true, // 可用
                    'dm': null // 弹幕相关
                }
            };
        // 刷新弹幕空间集
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
            minTop = this.getMinHeight('random'), // 最小高度
            maxTop = this.getMaxHeight('random') - newDm.offsetHeight; // 最大高度
        return rand(minTop, maxTop);
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
        // 之所以用getBoundingClientRect，是因为offsetLeft会受CSS transform影响
        let dmLayerRect = this.target.getBoundingClientRect(), // 弹幕层具体位置信息
            newDmHeight = newDm.getBoundingClientRect().height, // 往下取整
            hitSet = this.hitSets[attrs['type']],
            bottomSpace = attrs['bottom_space'], // 弹幕底部间距
            calcHeight = -1; // 计算出的高度
        // 遍历滚动空间集
        for (let i = 0, len = hitSet.length; i < len; i++) {
            let space = hitSet[i]; // 获得当前遍历到的空间
            if (space['available']) { // 空间是空闲的
                // 为什么要+1呢? 0-9，实际上是10个单位的空间，9-0+1
                let spaceHeight = space['to'] - space['from'] + 1, // 空间高度
                    newlyOccupied = Math.floor((newDmHeight + bottomSpace) * 100); // 新弹幕占用的空间（*100是为了提高精度）
                // 如果新弹幕还没分配出去(calcHeight=-1)，且有空间能塞得下新弹幕
                if (calcHeight === -1 && spaceHeight >= newlyOccupied) {
                    let freeSlice = Object.assign({}, space), // 切割后剩余的空间
                        // 新的切割后的空闲块from值
                        newFrom = space['from'] + newlyOccupied;
                    // 空间足够放下弹幕，空间开始的高度就是新弹幕的高度
                    calcHeight = space['from'] / 100; // 除100还原精度
                    space['to'] = newFrom - 1; // 更新被占用空间的to值
                    space['available'] = false;
                    space['dm'] = { // 记录弹幕信息
                        'start': timestamp(), // 弹幕创建时间
                        'life': attrs['life'], // 弹幕生命期
                        'reversed': attrs['reverse'], // 弹幕是否反向
                        'element': newDm // 弹幕元素
                    }
                    // 切割后剩余的空间，重新加入空间集
                    freeSlice['from'] = newFrom;
                    hitSet.splice(i + 1, 0, freeSlice);
                }
            } else { // 这里的空间被占用了
                // 检查占用的空间是否能释放了
                let createTime = space['dm']['start'], // 弹幕创建时间
                    life = space['dm']['life'], // 弹幕生命期
                    scrollReversed = space['dm']['reversed'], // 弹幕是否反向滚动
                    dmElement = space['dm']['element'], // 弹幕元素
                    dmElementRect = dmElement.getBoundingClientRect(), // 弹幕元素具体位置信息(防止受transform影响)
                    releaseFlag = false; // 是否释放这条弹幕的空间
                switch (attrs['type']) {
                    case 'scroll':
                        // 对滚动弹幕来说，如果已经全部露出屏幕，就可以释放空间了
                        if (scrollReversed) {
                            // 逆向滚动（从左往右）
                            // (弹幕距文档左边距离-弹幕层距文档左边距离>0)，说明弹幕此时全部露出屏幕
                            releaseFlag = (dmElementRect.left - dmLayerRect.left > 0);
                        } else {
                            // 正向滚动（从右往左）
                            // (弹幕距文档左边距离+弹幕宽度<弹幕层宽度+弹幕层距文档左边距离)，说明弹幕已经全部露出屏幕，可以从空间集中释放
                            releaseFlag = (
                                dmElementRect.left + dmElementRect.width < dmLayerRect.width + dmLayerRect.left
                            );
                        }
                        break;
                    case 'top':
                    case 'bottom':
                        // 对顶部弹幕来说，如果自创建时间起已经超过生命期，就可以释放空间了
                        releaseFlag = (timestamp() - createTime >= life);
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
                        // 从空间集中移除被合并的空间
                        hitSet.splice(i, 2);
                        i--; // 遍历索引回退一位
                        len -= 2; // 空间集长度减2
                    } else if (prevSpace['available']) {
                        // 如果只有前一个空间是空闲的，就合并这两个空间
                        prevSpace['to'] = space['to'];
                        // 从空间集中移除被合并的空间
                        hitSet.splice(i, 1);
                        i--; // 遍历索引回退一位
                        len--; // 空间集长度减1
                    } else if (nextSpace['available']) {
                        // 如果只有后一个空间是空闲的，就合并这两个空间
                        space['to'] = nextSpace['to'];
                        space['available'] = true;
                        space['dm'] = null;
                        // 从空间集中移除被合并的空间
                        hitSet.splice(i + 1, 1);
                        len--; // 空间集长度减1
                    } else {
                        // 无可邻接的空间，就直接释放这个空间
                        space['available'] = true;
                        space['dm'] = null;
                    }
                    /* 这里为什么要再回退一位呢？因为在上面释放/邻接出了空闲空间后，索引是指向这个空闲空间的，接下来的一次迭代就是从下一个空间开始了，而忽略了这个刚刚释放的空闲空间！
                        因此，每当释放空间工作完成后，需要再次回退一位索引
                        - SomeBottle
                     */
                    i--; // 遍历索引回退一位
                }
            }
        }
        // 如果循环结束，仍然找不到合适的位置投放弹幕，说明这一刻屏幕上爆满了，就重置空间集
        if (calcHeight === -1) {
            if (!retry) { // 避免死递归
                // 刷新空间集，这样就有空间了 
                this.refreshHitSets(attrs['type']);
                // 重试计算高度
                return this.danmakuAnchor(newDm, attrs, true);
            } else {
                // 重试了，还是算不出来，就默认为0
                // 这种情况一般是设置弹幕允许覆盖的面积过小，导致空间集中没有空间
                calcHeight = 0;
            }
        }
        return calcHeight;
    }
}