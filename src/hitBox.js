// 弹幕行碰撞处理
// 这一部分单独拿出来写 - 50me3ottIe
'use strict';


export default class hitBox {
    /**
     * 构造函数
     * @param {Element} dmLayer 弹幕层元素
     */
    constructor(dmLayer) {
        this.target = dmLayer;
        // 用于记录弹幕行的数组
        this.hitLines = {
            // 普通滚动弹幕集
            'scroll': [],
            // 逆向滚动弹幕集
            'reversed_scroll': []
        };
    }
    /**
     * 获得下一条滚动弹幕的距离顶部高度(px)
     * @param {Element} newDm 新弹幕div元素
     * @param {Object} attrs 弹幕属性
     * @param {Boolean} reversed 是否为逆向弹幕
     * @returns {Number} 距离顶部高度(px)
     * @note 这个方法 是为了最大化利用弹幕层空间
     */
    nextScrollPos(newDm, attrs, reversed = false) {
        // 获得对应的滚动弹幕碰撞集
        let existDms = this.hitLines[reversed ? 'reversed_scroll' : 'scroll'],
            layerWidth = this.target.offsetWidth, // 弹幕层宽度
            layerHeight = this.target.offsetHeight; // 弹幕层高度
        /* 监控弹幕元素是否全部露出屏幕
           为什么要监控捏? 因为每当一个弹幕元素全部露出屏幕后，它所在的这一行
           就可以创建新的弹幕了
        */
        for (let i = 0, len = existDms.length; i < len; i++) {
            // 获得弹幕元素
            let dmk = existDms[i];
            if ((!reversed &&
                // case.1 正常从右往左滚动
                /* (弹幕层宽度-弹幕于左侧边界的距离)大于弹幕元素自身的宽度，
                    说明这条弹幕已经完全出现在屏幕内，可以移除碰撞监控了。*/
                (layerWidth - dmk.offsetLeft >= dmk.offsetWidth)) ||
                (reversed &&
                    // case.2 弹幕从左往右移动
                    /* (弹幕层宽度-弹幕于左侧边界的距离)小于弹幕层的宽度，
                        说明这条弹幕已经完全出现在屏幕内，可以移除碰撞监控了。*/
                    (layerWidth - dmk.offsetLeft <= layerWidth)) ||
                // case.3 弹幕元素已经被移除了
                dmk.offsetWidth === 0 || !dmk.parentNode) {
                existDms.splice(i, 1);
                i--;
                len--;
            }
        }
        // 获得弹幕集中最新的一行弹幕元素（数组末尾）
        let lastDm = existDms[existDms.length - 1],
            finalTop = 0, // 最终返回的top值
            maxTop = layerHeight - newDm.offsetHeight; // 最大top值（如果超过了这个值，弹幕就会在容器外了！）
        // 返回下一行弹幕的距离顶部高度
        if (!lastDm) { // 所有行都可以用，直接从顶部开始投放弹幕
            finalTop = 0;
        } else {
            // 上一行的高度+上一行于顶部的距离+纵向间距
            finalTop = lastDm.offsetHeight + lastDm.offsetTop + attrs['vertical_space'];
        }
        // 弹幕所在高度超过了最大值
        if (finalTop > maxTop) {
            let narrowest = existDms[0],
                minWidth = narrowest.offsetWidth;
            // 遍历一遍监控中的弹幕，找到宽度(offsetWidth)最短的一行
            // 为什么要这样找呢? 因为最短的一行能最快腾出空间，让新弹幕投放进来
            existDms.forEach((dm) => {
                if (dm.offsetWidth < minWidth) {
                    narrowest = dm;
                    minWidth = dm.offsetWidth;
                }
            });
            // 让新弹幕和最短的这一行弹幕重叠
            finalTop = narrowest.offsetTop;
        }
        // 将新弹幕元素加入弹幕集的末尾
        existDms.push(newDm);
        return finalTop;
    }
};