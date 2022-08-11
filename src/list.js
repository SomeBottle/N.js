// 弹幕列表模块
'use strict';
import { output } from './utils.js';

class List {
    /**
     * 构造列表对象
     * @param {Element} dmLayer 弹幕层元素 
     */
    constructor(dmLayer) {
        this.target = dmLayer;
        // 列表对象
        this.lists = {};
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
                danmakuLine: new Array(),
                // 时间容差(ms)，默认±0.2s
                tolerance: 200
            }
        } else {
            output(`List ${listName} already exists!`);
        }
        return this;
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
        return this;
    }
}

export default List;