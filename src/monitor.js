// 弹幕运动监视模块
'use strict';

import { cssEndEvents, output, PTimer } from "./utils.js";


class Monitor {
    constructor() {
        // 正在监视的弹幕(悬停弹幕)
        this.hanging = [];
        // 正在监视的弹幕(滚动弹幕)
        this.scrolling = [];
    }
    /**
     * 监视滚动弹幕
     * @param {Element} element 弹幕元素
     * @param {String} type 弹幕类型(attrs中的)
     * @param {Boolean} reversed 是否反向滚动
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     * @returns 
     */
    newScroll(element, type, reversed, callback = null) {
        let endEvent = '';
        // 寻找对应的动画结束事件
        for (let cssKey in cssEndEvents) {
            if (cssKey in element.style) {
                endEvent = cssEndEvents[cssKey];
                break;
            }
        }
        // 找不到对应的事件，浏览器过时了
        if (!endEvent) {
            output('Oops, your browser is outdated.');
            return;
        }
        // 弹幕消失后的处理
        let endHandler = () => {
            // 移除事件监听
            element.removeEventListener(endEvent, endHandler);
            // 移除元素
            element.parentNode.removeChild(element);
            // 回调
            if (callback) callback();
        },
            scrollingList = this.scrolling;
        element.addEventListener(endEvent, endHandler);
        // 检查滚动列表，清除已经完成的元素
        for (let i = 0, len = scrollingList.length; i < len; i++) {
            let dm = scrollingList[i].element;
            // 元素已经完成，从DOM中被删除了
            if (dm.offsetWidth <= 0 || dm.parentNode == null) {
                // 从滚动列表中移除
                scrollingList.splice(i, 1);
                i--;
                len--;
            }
        }
        scrollingList.push({
            element: element,
            type: type,
            reversed: reversed,
            endEvent: endEvent
        });
    }
    /**
     * 监视悬停弹幕
     * @param {Element} element 弹幕元素
     * @param {String} type 弹幕类型(attrs中的)
     * @param {Number} life 弹幕生命时长(ms) 
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     */
    newHang(element, type, life, callback = null) {
        // 添加倒计时器
        let timer = new PTimer(() => {
            // 移除元素
            element.parentNode.removeChild(element);
            // 回调
            if (callback) callback();
        }, life),
            hangingList = this.hanging;
        // 检查悬停列表，清除已经完成的计时器
        for (let i = 0, len = hangingList.length; i < len; i++) {
            if (hangingList[i].state == 'done') {
                hangingList.splice(i, 1);
                i--;
                len--;
            }
        }
        // 将计时器添加到悬停监视列表
        hangingList.push({
            element: element,
            timer: timer,
            type: type // 顺带记录一下类型
        });
    }
    /**
     * 清除容器内的滚动弹幕
     * @param {String} type 弹幕类型(同attrs)
     * @param {Boolean} reversed 是否反向滚动
     * @note 如果不传入任何参数，将清除所有滚动弹幕
     * @note type和reversed都可以传入'all'
     */
    clearScrolling(type = '', reversed = false) {
        let scrollingList = this.scrolling;
        for (let i = 0, len = scrollingList.length; i < len; i++) {
            let item = scrollingList[i],
                element = item.element;
            // 清除所有滚动弹幕
            if (!type || type == 'all' && reversed == 'all' ||
                // type指定为all，则清除所有符合reversed的弹幕
                (type == 'all' && item['reversed'] == reversed) ||
                // reversed指定为all，则清除所有符合type的弹幕
                (item['type'] == type && reversed == 'all') ||
                // 清除符合两者的弹幕
                (item['type'] == type && item['reversed'] == reversed)) {
                // 手动触发动画结束事件，以移除元素
                if (element.parentNode)
                    element.dispatchEvent(new Event(item['endEvent']));
                scrollingList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 清除容器内的悬停弹幕
     * @param {String} type 弹幕类型(同attrs)
     * @note type可以不传入，或者传入'all'，将清除所有悬停弹幕
     */
    clearHanging(type = '') {
        let hangingList = this.hanging;
        for (let i = 0, len = hangingList.length; i < len; i++) {
            let item = hangingList[i],
                element = item.element;
            // 清除所有悬停弹幕
            if (!type || type == 'all' ||
                // 清除符合type的弹幕
                item['type'] == type) {
                // 暂停计时器
                item['timer'].pause();
                // 移除元素
                if (element.parentNode)
                    element.parentNode.removeChild(element);
                hangingList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 暂停容器内悬停弹幕的运行
     */
    pauseHanging() {
        // 暂停悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].timer.pause();
        }
    }
    /**
     * 恢复容器内悬停弹幕的运行
     */
    resumeHanging() {
        // 恢复悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].timer.resume();
        }
    }
}

export default Monitor;