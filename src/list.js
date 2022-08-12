// 弹幕列表模块
'use strict';
import { output } from './utils.js';

class List {
    /**
     * 构造列表对象
     * @param {Element} dmLayer 弹幕层元素 
     * @param {Danmaku} danmaku NDanmaku实例
     */
    constructor(dmLayer, danmaku) {
        this.danmaku = danmaku;
        this.target = dmLayer;
        // 列表对象
        this.lists = {};
        // 当前操纵的列表
        this.usingList = null;
    }
    /**
     * 往正在操纵(use)的列表中添加弹幕
     * @param {Object} dmData 弹幕对象
     * @param {Number} time 弹幕出现的时刻(ms)
     */
    addDm(dmData, time) {
        /* dmData形如
            {
                text: '', // 弹幕内容
                reset_styles: false, // 是否在设置样式前重置样式，否则继承之前的样式
                styles: {...} // 弹幕样式
            }
         */
        let list = this.usingList;
        if (list) {

        } else {
            output('Use one list first.');
        }
    }
    /**
     * 目前操纵哪一个弹幕列表
     * @param {String} listName 列表名
     */
    use(listName) {
        if (this.lists[listName]) {
            // 引用赋值
            this.usingList = this.lists[listName];
        } else {
            output(`List ${listName} not found!`);
        }
    }
    /**
     * 在容器内创建新弹幕列表
     * @param {String} listName 列表名字
     */
    new(listName) {
        if (!this.lists[listName]) {
            this.lists[listName] = {
                // 弹幕时间线(方便二分查找)
                timeLine: new Array(),
                // 和时间线索引相对应的弹幕列表
                danmakuLine: new Object(),
                // 时间容差(ms)，默认±0.2s
                tolerance: 200
            }
        } else {
            output(`List ${listName} already exists!`);
        }
    }
    /**
     * 删除弹幕列表
     * @param {String} listName 列表名
     */
    del(listName) {
        if (this.lists[listName]) {
            delete this.lists[listName];
        } else {
            output(`List ${listName} not found!`);
        }
    }
}

export default List;