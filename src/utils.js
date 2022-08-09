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
 * @param {*} text 输出内容
 */
function output(text) {
    console.log(`[N.js-Danmaku]`, text);
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

// CSS动画终止对应的事件
export const cssEndEvents = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
}

export { styling, animStyleLayer, output, danmakuHeight };