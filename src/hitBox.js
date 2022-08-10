// 弹幕行碰撞处理
// 这一部分单独拿出来写 - 50me3ottIe
'use strict';
import { styling, rand, timestamp } from "./utils.js";

export default class hitBox {
    /**
     * 构造函数
     * @param {Element} dmLayer 弹幕层元素
     */
    constructor(dmLayer) {
        this.target = dmLayer;
        // 弹幕碰撞集，每个数组中弹幕按空间关系进行排序
        this.hitSets = {
            'top': [], // 顶部弹幕
            'bottom': [], // 底部弹幕
            'scroll': [], // 普通滚动弹幕
            'reversed_scroll': [], // 反向滚动弹幕
            'random': [], // 随机高度的滚动弹幕
            'reversed_random': [] // 随机高度的反向滚动弹幕
        };
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
            case 'scroll':
                styling(newDm, 'top',
                    `${this.danmakuScroll(newDm, attrs)}px`
                );
                break;
            case 'random':
                styling(newDm, 'top',
                    `${this.danmakuRandom(newDm)}px`
                );
                break;
            case 'top':
                styling(newDm, 'top',
                    `${this.danmakuTopBottom(newDm, attrs)}px`
                );
                break;
            case 'bottom':
                styling(newDm, 'bottom',
                    `${this.danmakuTopBottom(newDm, attrs)}px`
                );
                break;
        }
    }
    /**
     * 获得下一条顶部/底部弹幕的距离顶部/底部高度(px)
     * @param {Element} newDm 
     * @param {Object} attrs 弹幕属性
     * @returns {Number} 距离顶部/底部的高度(px)
     */
    danmakuTopBottom(newDm, attrs) {
        
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
     * 获得下一条普通滚动弹幕的距离顶部高度(px)
     * @param {Element} newDm 新弹幕div元素
     * @param {Object} attrs 弹幕属性
     * @returns {Number} 距离顶部高度(px)
     * @note 本方法仅限普通滚动弹幕
     */
    danmakuScroll(newDm, attrs) {
        
    }
}