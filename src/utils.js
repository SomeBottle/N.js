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
 * 比对对象的部分属性是否存在且相等
 * @param {Object} origin 目标对象
 * @param {Object} compare 待比较属性组成的对象
 * @returns {Boolean} 是否相等
 * @note 支持取反(NOT)，在值前加上一个感叹号即可，比如color:!#FFF，表示color不等于#FFF
 */
function matchProperties(origin, compare) {
    for (let key in compare) {
        if (!origin[key]) {
            return false;
        } else {
            // 如果值的第一个字符是感叹号，则表示NOT
            let not = (compare[key][0] === '!'),
                compVal = not ? compare[key].slice(1) : compare[key];
            if ((!not && origin[key] !== compVal) || // 正常比较，不相等则返回false
                (not && origin[key] == compVal)) // 比较结果取反，相等则返回false
                return false;
        }
    }
    return true;
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
 * 将对象中所有值置0
 * @param {Object} obj 待处理对象
 */
function zeroObject(obj) {
    for (let i in obj) {
        if (typeof obj[i] === 'object' && !(obj[i] instanceof Array)) {
            zeroObject(obj[i]); // 递归处理
        } else {
            obj[i] = 0;
        }
    }
}

/**
 * 将对象转换为字符串（支持函数）
 * @param {Object} obj 待处理对象
 * @param {Number} indent 缩进空格数
 * @param {Number} currentIndent 当前缩进空格数(递归调用时使用，无需传入)
 * @returns {String} 字符串
 * @note 不支持处理其中数组内的对象，数组会直接通过JSON.stringify
 */
function objectString(obj, indent = 4, currentIndent = -1) {
    if (currentIndent === -1)
        currentIndent = indent; // 初始化当前缩进空格数
    let result = '{', // 结果字符串
        indentStr = ' '.repeat(currentIndent); // 缩进字符串
    for (let key in obj) {
        let value = obj[key], // 获得值
            convertedVal = ''; // 值被转换后的字符串
        if (typeof value == 'function') {
            // 如果是函数，就调用函数的toString方法现出原形
            convertedVal = value.toString();
        } else if (value instanceof Array) {
            convertedVal = JSON.stringify(value); // 如果遇到数组就开摆
        } else {
            switch (typeof value) {
                case 'object':
                    convertedVal = objectString(value, indent, currentIndent + indent); // 递归调用，处理对象
                    break;
                case 'number':
                case 'boolean':
                    convertedVal = value.toString(); // 如果是数字/布尔，就转换为字符串
                    break;
                default:
                    convertedVal = `"${value.replaceAll('"', '\\"')}"`; // 其他类型，双引号括起来，注意转义
                    break;
            }
        }
        result += `\n${indentStr}${indentStr}"${key}": ${convertedVal},`; // 拼接结果字符串，缩进四个空格
    }
    result += `\n${indentStr}}`; // 最后闭合大括号
    return result;
}

/**
 * 创建文件下载链接并下载
 * @param {String} fileName 文件名（包括后缀名）
 * @param {String} fileMime 文件MIME类型，比如application/json
 * @param {String} content 文件内容
 */
function dispatchDownload(fileName, fileMime, content) {
    console.log('Hello');
    let aElement = document.createElement('a'), // 创建a标签
        fileBlob = new Blob([content], {
            type: fileMime
        }); // 创建文件blob对象
    // 设置下载文件名
    aElement.setAttribute('download', fileName);
    // 创建Blob对象的URL
    aElement.setAttribute('href', URL.createObjectURL(fileBlob));
    // 设置元素为无显示
    aElement.style.display = 'none';
    // 添加到body中
    document.body.appendChild(aElement);
    // 激发下载事件
    aElement.click();
    // 删除URL
    URL.revokeObjectURL(aElement.href);
    // 移除元素
    document.body.removeChild(aElement);
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
    matchProperties,
    objectString,
    dispatchDownload,
    zeroObject
};