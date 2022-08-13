// 弹幕运动监视模块
'use strict';

import { cssEndEvents, output, PTimer, matchProperties } from "./utils.js";

// 监视器中储存的单条弹幕数据及方法
class DanmakuData {
    /**
     * 构造储存的单条弹幕
     * @param {Number} id 弹幕唯一id
     * @param {Element} element 弹幕元素 
     * @param {Object} data 弹幕其他数据 
     * @param {Object} allDanmaku 总弹幕列表的引用
     */
    constructor(id, element, data, allDanmaku) {
        this.id = id;
        this.element = element;
        this.allDanmaku = allDanmaku;
        // 将data中的属性展开到本实例上
        for (let key in data)
            this[key] = data[key];
        // 标记弹幕分类为悬停/滚动
        if (this.timer) {
            this.category = 'hanging';
        } else {
            this.category = 'scrolling';
        }
        // 自行加入总弹幕列表
        allDanmaku[id] = this;
    }
    /**
     * 删除自己这条弹幕，及其数据
     * @param {Boolean} manually 是否手动清除
     * @note 比如调用clear导致弹幕删除，这就是手动。手动删除后不会调用回调函数
     */
    revoke(manually = false) {
        let target = this.element;
        switch (this.category) {
            case 'hanging':
                // 先暂停计时器
                this.timer.pause();
                // 后移除元素
                if (target.parentNode)
                    target.parentNode.removeChild(target);
                break;
            case 'scrolling':
                if (!manually) {
                    // 触发元素自身的自然结束事件
                    target.dispatchEvent(new Event(this.endEvent));
                } else {
                    // 触发人工清空事件（不会调用回调）
                    target.dispatchEvent(new Event(this.clearEvent));
                }
                break;
        }
        // 从总弹幕列表中移除
        delete this.allDanmaku[this.id];
    }
    /**
     * 暂停自己这条弹幕
     * @returns {Boolean} 是否暂停成功
     */
    pause() {
        let target = this.element;
        switch (this.category) {
            case 'hanging':
                // 暂停计时器
                this.timer.pause();
                return true;
            case 'scrolling':
                // 元素替换上暂停class
                if (target.classList.contains('N-scroll-playing')) {
                    target.classList.replace('N-scroll-playing', 'N-scroll-paused');
                    return true;
                }
                break;
        }
        return false;
    }
    /**
     * 让自己这条弹幕恢复运行
     * @returns {Boolean} 是否恢复成功
     */
    resume() {
        let target = this.element;
        switch (this.category) {
            case 'hanging':
                // 暂停计时器
                this.timer.resume();
                return true;
            case 'scrolling':
                // 元素替换上运行class
                if (target.classList.contains('N-scroll-paused')) {
                    target.classList.replace('N-scroll-paused', 'N-scroll-playing');
                    return true;
                }
                break;
        }
        return false;
    }
    /**
     * 一个Boolean值，true/false代表该弹幕是/否运行完毕
     */
    get finished() {
        if (this.category === 'hanging') { // 悬停弹幕检查计时器是否运行完成
            if (this.timer.state === 'done')
                return true;
        } else if (this.element.offsetWidth <= 0 || this.element.parentNode == null) { // 滚动弹幕检查元素是否已经被移除
            return true;
        }
        return false;
    }
}

class Monitor {
    constructor() {
        // 弹幕最新序号
        this.dmSerial = 0;
        // 弹幕总列表
        this.allDanmaku = new Object();
        // 正在监视的悬停弹幕
        this.hanging = [];
        // 正在监视的滚动弹幕
        this.scrolling = [];
    }
    statistics() {

    }
    /**
     * 垃圾回收，清除掉hanging/scrolling中已经完成的弹幕
     * @param {String} type 检查类型: 留空/scrolling/hanging
     */
    garbageCollect(type = '') {
        let scrollingList = this.scrolling,
            hangingList = this.hanging;
        if (!type || type === 'scrolling') {
            // （垃圾处理）检查滚动列表
            for (let i = 0, len = scrollingList.length; i < len; i++) {
                if (scrollingList[i].finished) { // 如果已经完成
                    // 元素自行销毁
                    scrollingList[i].revoke();
                    // 从滚动列表中移除
                    scrollingList.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        if (!type || type === 'hanging') {
            // （垃圾处理）检查悬停列表
            for (let i = 0, len = hangingList.length; i < len; i++) {
                if (hangingList[i].finished) {
                    // 元素自行销毁
                    hangingList[i].revoke();
                    // 从滚动列表中移除
                    hangingList.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }
    /**
     * 监视滚动弹幕
     * @param {Element} element 弹幕元素
     * @param {String} type 弹幕类型(attrs中的)
     * @param {Boolean} reversed 是否反向滚动
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     * @returns {Number} 弹幕唯一id
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
            output('Oops, your browser is outdated.', 3);
            return;
        }
        // 弹幕消失后的处理
        let serial = this.dmSerial,
            // 弹幕自然结束后执行
            endHandler = function () {
                // 移除事件监听
                this.removeEventListener(endEvent, endHandler);
                this.removeEventListener('danmakuclear', clearHandler);
                // 移除元素
                this.parentNode.removeChild(this);
                // 回调
                if (callback) callback(serial);
            }.bind(element),
            // 弹幕被手动清除后执行(没有回调)
            clearHandler = function () {
                // 移除事件监听
                this.removeEventListener(endEvent, endHandler);
                this.removeEventListener('danmakuclear', clearHandler);
                // 移除元素
                this.parentNode.removeChild(this);
            }.bind(element),
            scrollingList = this.scrolling;
        element.addEventListener(endEvent, endHandler);
        element.addEventListener('danmakuclear', clearHandler);
        // （垃圾处理）检查滚动列表，清除已经完成的元素
        this.garbageCollect('scrolling');
        let newData = new DanmakuData(serial, element, {
            type: type,
            reversed: reversed,
            endEvent: endEvent, // 记录滚动弹幕结束事件
            clearEvent: 'danmakuclear' // 记录清除事件
        }, this.allDanmaku);
        scrollingList.push(newData); // 将弹幕添加到滚动监视列表
        this.dmSerial++;
        return serial; // 返回弹幕唯一id
    }
    /**
     * 监视悬停弹幕
     * @param {Element} element 弹幕元素
     * @param {String} type 弹幕类型(attrs中的)
     * @param {Number} life 弹幕生命时长(ms) 
     * @param {Function} callback 弹幕消失后的回调函数，可以不传入
     * @returns {Number} 弹幕的唯一id
     */
    newHang(element, type, life, callback = null) {
        // 添加倒计时器
        let serial = this.dmSerial,
            timer = new PTimer(() => {
                // 移除元素
                element.parentNode.removeChild(element);
                // 回调
                if (callback) callback(serial);
            }, life),
            hangingList = this.hanging;
        // （垃圾处理）检查悬停列表，清除已经完成的计时器
        this.garbageCollect('hanging');
        let newData = new DanmakuData(serial, element, {
            timer: timer,
            type: type // 顺带记录一下类型
        }, this.allDanmaku);
        // 将计时器添加到悬停监视列表
        hangingList.push(newData);
        this.dmSerial++;
        return serial;
    }
    /**
     * 清除容器内的部分滚动弹幕
     * @param {String} type 弹幕类型(同attrs)
     * @param {Boolean|String} reversed 是否反向滚动
     * @note 如果不传入任何参数，将清除所有滚动弹幕
     * @note type和reversed都可以传入'all'
     */
    clearSomeScrolling(type = '', reversed = false) {
        let scrollingList = this.scrolling;
        for (let i = 0, len = scrollingList.length; i < len; i++) {
            let dmItem = scrollingList[i];
            // 清除所有滚动弹幕
            if (!type || type == 'all' && reversed == 'all' ||
                // type指定为all，则清除所有符合reversed的弹幕
                (type == 'all' && dmItem['reversed'] == reversed) ||
                // reversed指定为all，则清除所有符合type的弹幕
                (dmItem['type'] == type && reversed == 'all') ||
                // 清除符合两者的弹幕
                (dmItem['type'] == type && dmItem['reversed'] == reversed)) {
                // 弹幕实例自行销毁
                dmItem.revoke(true);
                // 从滚动列表中移除
                scrollingList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 清除容器内的部分悬停弹幕
     * @param {String} type 弹幕类型(同attrs)
     * @note type可以不传入，或者传入'all'，将清除所有悬停弹幕
     */
    clearSomeHanging(type = '') {
        let hangingList = this.hanging;
        for (let i = 0, len = hangingList.length; i < len; i++) {
            let dmItem = hangingList[i];
            // 清除所有悬停弹幕
            if (!type || type == 'all' ||
                // 清除符合type的弹幕
                dmItem['type'] == type) {
                // 暂停计时器
                dmItem['timer'].pause();
                // 实例自行销毁
                dmItem.revoke(true);
                // 从悬停列表中移除
                hangingList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 按照CSS样式清除弹幕
     * @param {Object} styles CSS样式组成的对象 
     */
    clearStyled(styles) {
        // 获得两种弹幕列表
        let hangingList = this.hanging,
            scrollingList = this.scrolling;
        // 先检查悬停弹幕
        for (let i = 0, len = hangingList.length; i < len; i++) {
            if (matchProperties(hangingList[i]['element'].style, styles)) {
                hangingList[i].revoke(true);
                hangingList.splice(i, 1);
                i--;
                len--;
            }
        }
        // 再检查滚动弹幕
        for (let i = 0, len = scrollingList.length; i < len; i++) {
            if (matchProperties(scrollingList[i]['element'].style, styles)) {
                scrollingList[i].revoke(true);
                scrollingList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 按照id删除单个弹幕
     * @param {Number} id 弹幕唯一id
     * @returns {Boolean} 是否删除成功
     */
    clearSingle(id) {
        // 取得弹幕对象
        let dmObj = this.allDanmaku[id];
        if (dmObj) {
            // 实例自行销毁
            return dmObj.revoke(true);
        } else {
            // 弹幕不存在
            output(`DanmakuID:${id} not found.`, 2);
            return false;
        }
    }
    /**
     * 按照id暂停单个弹幕
     * @param {Number} id 弹幕唯一id
     * @returns {Boolean} 是否暂停成功
     */
    pauseSingle(id) {
        // 取得弹幕对象
        let dmObj = this.allDanmaku[id];
        if (dmObj) {
            // 弹幕自身暂停
            return dmObj.pause();
        } else {
            // 弹幕不存在
            output(`DanmakuID:${id} not found.`, 2);
            return false;
        }
    }
    /**
     * 按照id恢复单个弹幕
     * @param {Number} id 弹幕唯一id
     * @returns {Boolean} 是否恢复成功
     */
    resumeSingle(id) {
        // 取得弹幕对象
        let dmObj = this.allDanmaku[id];
        if (dmObj) {
            // 弹幕自身暂停
            return dmObj.resume();
        } else {
            // 弹幕不存在
            output(`DanmakuID:${id} not found.`, 2);
            return false;
        }
    }
    /**
     * 暂停容器内所有悬停弹幕的运行
     */
    pauseAllHanging() {
        // 暂停悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].pause();
        }
    }
    /**
     * 恢复容器内所有悬停弹幕的运行
     */
    resumeAllHanging() {
        // 恢复悬停弹幕
        for (let i = 0, len = this.hanging.length; i < len; i++) {
            this.hanging[i].resume();
        }
    }
}

export default Monitor;