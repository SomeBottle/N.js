// 弹幕运动监视模块
'use strict';

import { cssEndEvents, output, PTimer } from "./utils.js";


class Monitor {
    constructor() {
        // 正在监视的弹幕(仅限悬停弹幕)
        this.hanging = [];
    }
    /**
     * 监视滚动弹幕
     * @param {Element} element 弹幕元素
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     * @returns 
     */
    newScroll(element, callback = null) {
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
        };
        element.addEventListener(endEvent, endHandler);
    }
    /**
     * 监视悬停弹幕
     * @param {Element} element 弹幕元素
     * @param {Number} life 弹幕生命时长(ms) 
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     */
    newHang(element, life, callback = null) {
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
        hangingList.push(timer);
    }
    /**
     * 暂停容器内悬停弹幕的运行
     */
    pauseHanging() {
        // 暂停悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].pause();
        }
    }
    /**
     * 恢复容器内悬停弹幕的运行
     */
    resumeHanging() {
        // 恢复悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].resume();
        }
    }
}

export default Monitor;