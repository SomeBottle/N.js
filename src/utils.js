'use strict';

/**
 * 设置元素样式
 * @param {Element|Array} elements 元素（或包含元素的数组）
 * @param {String|Array|Object} kbj 样式键（或包含样式键的数组，或包含样式键值对的对象）
 * @param {String|Array} values 样式值（或包含样式值的数组）
 */
function styling(elements, kbj, values) {
    if (!(elements instanceof Array)) elements = [elements];
    if (typeof kbj == 'string') kbj = [kbj];
    if (!(values instanceof Array)) values = [values];
    for (let j = 0, len2 = elements.length; j < len2; j++) {
        if (kbj instanceof Array) { // kbj是数组或者字符串
            for (let i = 0, len = kbj.length; i < len; i++) {
                elements[j].style[kbj[i]] = values[i];
            }
        } else { // kbj是一个对象
            for (let key in kbj) {
                elements[j].style[key] = kbj[key];
            }
        }
    }
}

/**
 * 创建play-state样式控制style元素
 * @param {String} selector css选择器
 * @param {String} playState running / paused
 * @returns {Element} 返回创建的元素
 */
function animStyleLayer(selector, playState) {
    let layer = document.createElement('style');
    layer.innerHTML = `${selector}{
        animation-play-state:${playState};
        -webkit-animation-play-state:${playState};-moz-animation-play-state:${playState};
        -o-animation-play-state:${playState};
    }`;
    return layer;
}

/**
 * 在控制台带前缀输出内容
 * @param {String} text 输出内容
 * @param {Number} type 消息种类
 * @note type可选1/2/3代表普通/警告/错误
 */
function output(text, type = 1) {
    let styles = '';
    switch (type) {
        case 2:
            styles = 'color:#F5DA81';
            break;
        case 3:
            styles = 'color:#FE2E2E;font-weight:bold';
            break;
    }
    console.log(`[N.js-Danmaku]%c ${text}`, styles);
}

/**
 * 取两个数之间的随机数 [from,to)
 * @param {Number} from 
 * @param {Number} to 
 * @returns {Number}
 */
function rand(from, to) {
    return Math.random() * (to - from) + from;
}

/**
 * 获得时间戳
 * @returns {Number} 毫秒级时间戳
 */
function timestamp() {
    return new Date().getTime();
}

/**
 * 通过容器的宽度计算弹幕的字体大小
 * @param {Element} container 容器元素 
 * @returns 弹幕大小(px)
 * @note 最小为5px
 */
function danmakuHeight(container) {
    // 为什么要这样算捏，我只能说是凭感觉的 - SomeBottle
    let dmHeight = (container.offsetWidth / 180) * 5;
    return dmHeight > 5 ? dmHeight : 5; // 最小5px
}

/**
 * 检查对象中是否包含Keys中所有键
 * @param {Object} obj 检查对象
 * @param {Array} keys 键名组成的数组
 */
function ownProperties(obj, keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
        if (!obj.hasOwnProperty(keys[i])) return false;
    }
    return true;
}

class PTimer {
    /**
     * 可暂停的倒计时器
     * @param {Function} callback 回调函数 
     * @param {Number} time 倒计时时间（毫秒）
     */
    constructor(callback, time) {
        // 记录状态
        this.state = 'running';
        // 记录回调函数
        this.callback = callback;
        // 核心计时器
        this.timer = setTimeout(this.finished.bind(this), time);
        // 计时器开始时间
        this.start = timestamp();
        // 计时器剩余时间(每次暂停后更新)
        this.remaining = time;
    }
    /**
     * 倒计时结束后的回调函数
     */
    finished() {
        this.state = 'done'; // 标记状态：已完成
        this.callback();
    }
    /**
     * 暂停倒计时
     */
    pause() {
        if (this.state == 'running') {
            this.state = 'paused';
            clearTimeout(this.timer);
            this.remaining -= (timestamp() - this.start);
        }
    }
    /**
     * 继续倒计时
     */
    resume() {
        if (this.remaining > 0 && this.state == 'paused') {
            // 如果还有剩余时间
            this.state = 'running';
            this.start = timestamp();
            this.timer = setTimeout(this.finished.bind(this), this.remaining);
        }
    }
}

// CSS动画终止对应的事件
export const cssEndEvents = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
}

export {
    styling,
    animStyleLayer,
    output,
    danmakuHeight,
    rand,
    timestamp,
    PTimer,
    ownProperties
};