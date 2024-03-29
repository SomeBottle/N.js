// 弹幕列表模块
'use strict';
import { output, objectString, dispatchDownload } from './utils.js';

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
        // 记录上一次调用tick时的搜寻范围，用于tick防撞
        this.lastTickRange = [0, 0];
    }
    /**
     * 设置正在操纵(use)的列表的时刻不确定度(ms)
     * @param {Number} time 
     */
    uncertainty(time) {
        if (this.usingList) {
            if (time >= 0)
                this.usingList['uncertainty'] = time;
            else
                output('Uncertainty should be a positive number', 2);
        } else {
            output('Use one list first.', 2);
            return null;
        }
    }
    /**
     * 往正在操纵(use)的列表中装载弹幕
     * @param {Array} danmakuArr 装载的弹幕数组
     * @returns {Boolean} 是否装载成功
     */
    load(danmakuArr) {
        /* 弹幕对象形如
        [
            {
                time: 0, // 弹幕出现的时刻(ms)
                text: '', // 弹幕内容
                reset_styles: false, // 是否在设置样式前重置样式，否则继承之前的样式
                styles: {...}, // 弹幕样式
                created: ... 同Danmaku.create的创建后回调
                callback: ... 同Danmaku.create的弹幕结束后回调
            },
            ...
        ]
         */
        let list = this.usingList;
        if (list) {
            for (let i = 0, len = danmakuArr.length; i < len; i++) {
                let dmData = danmakuArr[i],
                    time = dmData['time'];
                if (time) { // 保证有时刻
                    delete dmData['time']; // 移除时刻字段
                    // 调用添加弹幕
                    this.addDm(dmData, time);
                }
            }
            output('Successfully loaded.');
            return true;
        } else {
            output('Use one list first.', 2);
            return false;
        }
    }
    /**
     * 根据正在操纵(use)的列表和当前时刻，创建弹幕
     * @param {Number} time 当前时刻
     */
    tick(time) {
        let list = this.usingList,
            timeLine = list.timeLine, // 时间线
            uncertainty = list.uncertainty; // 时刻不确定度(ms)
        if (list) {
            // 等下搜索完后还要考虑偏差
            let leftDest = time - uncertainty, // 左边的新时间边界
                rightDest = time + uncertainty, // 右边的新时间边界
                rightStart = time, // 右边的起点
                leftLap = this.lastTickRange[1] - leftDest, // 左边与上次搜索范围的交叠部分
                rightLap = this.lastTickRange[1] - rightDest; // 右边与上次搜索范围的交叠部分
            /* 接下来这一部分是防弹幕重复创建的处理
                (上一次搜寻的右边界-这次搜索的左边界>=0)，说明有重复部分
                然而这还不够，要保证(上一次搜寻的右边界-这次搜索的右边界<0)，这样这次搜索的部分才不是被上次搜索范围所包含了
                不满足上述条件的话，不会作弹幕防撞处理。
                不作处理的原因通常是：
                    1. 半途修改uncertainty（我想没人会这样做吧，你是来找茬的吧！）
                    2. 这次搜索弹幕的范围整个都在上次搜索的后面，无交叠部分
                    3. 往回拖动进度条，这次搜索弹幕的范围在上次搜索的前面，无交叠部分
                    4. 往回拖动进度条，这次搜索弹幕的范围相对上次搜索范围较前，有交叠部分
             */
            if (leftLap >= 0 && rightLap < 0) {
                let addition = leftLap + 1; // 从左边界开始要加上多长时间以修正范围
                /* 值得注意的是这里的搜寻规则：
                    首先，弹幕时间线的元素是按时刻升序排列的，当二分查找结束后，
                    索引end和start是一左一右，接下来继续左移end、右移start，
                    根据索引分别寻找time到leftDest、time+1到rightDest的范围内的弹幕
                    (
                        如果二分查找在time处找到了弹幕，那么就相当于寻找：
                            time-1到leftDest、time+1到rightDest的范围内的弹幕
                    )
                   那么问题就来了，当leftDest+addition后，很有可能addition>uncertainty，这种情况下实际上是越过了中间的time时刻进入了右半边，必须还要额外处理
                   - SomeBottle
                 */
                if (addition > uncertainty) {
                    // 增加的部分超过了uncertainty，先切出多余部分
                    let redundance = addition - uncertainty;
                    rightStart += redundance; // 把多余的部分加到右边起点上
                    leftDest = rightStart; // 左边边界移到rightStart处，不搜寻左边内容
                } else {
                    leftDest += addition; // 左边边界右移至没有交叠
                }
            }
            // 利用二分查找找出这个时刻需要创建的弹幕
            let start = 0,
                end = timeLine.length - 1,
                meet = []; // 符合时刻(及其偏差±ms要求的弹幕代号)
            while (start <= end) {
                let mid = Math.floor((start + end) / 2),
                    currentTime = timeLine[mid][0], // 获得当前搜寻项的时刻
                    currentSerial = timeLine[mid][1]; // 获得当前搜寻项的弹幕代号
                if (currentTime == time) {
                    /* 我滴个老天，这是一个非常极端的情况！
                       当上面处理交叠后，可能左边界会被设置为rightStart，
                       此时会导致leftDest>time，意思就是说，因为uncertainty的设置，
                       上一次tick已经创建了time处的弹幕，这回就需要忽略掉。
                       - SomeBottle
                     */
                    if (leftDest <= time) // 前提：time处的弹幕还未被创建过
                        meet.push(currentSerial); // 记录此弹幕代号
                    // 为了后续偏差处理，找到后让start和end于mid交叉一下
                    start = mid + 1;
                    end = mid - 1;
                    break;
                } else if (currentTime < time) {
                    start = mid + 1;
                } else if (currentTime > time) {
                    end = mid - 1;
                }
            }

            // 继续右移start指针，把时刻不确定范围内的弹幕都找出来
            for (let len = timeLine.length;
                start < len && timeLine[start][0] <= rightDest;
                start++) {
                // 要等时间>=右边起点后再作处理
                if (timeLine[start][0] < rightStart)
                    continue;
                meet.push(timeLine[start][1]);
            }
            // 继续左移end指针，把时刻不确定范围内的弹幕都找出来
            for (; end >= 0 && timeLine[end][0] >= leftDest; end--) {
                // 这里用unshift是为了确保弹幕载入的顺序
                meet.unshift(timeLine[end][1]);
            }
            // 记入搜索范围
            this.lastTickRange = [leftDest, rightDest];
            // 创建弹幕
            let danmakuLine = list.danmakuLine;
            for (let i = 0, len = meet.length; i < len; i++) {
                let serial = meet[i],
                    // 获得代号对应的弹幕数据
                    dmData = danmakuLine[serial],
                    danmaku = this.danmaku;
                // 重置样式（如果需要的话）
                if (dmData['reset_styles'])
                    danmaku.resetAttrs();
                // 应用当前弹幕样式（如果有的话）
                if (dmData['styles'])
                    danmaku.attrs(dmData['styles']);
                // 开始创建弹幕
                danmaku.create(
                    dmData['text'],
                    (dmData['created'] instanceof Function) ? dmData['created'] : null, // 弹幕创建后的回调函数（如果有的话）
                    (dmData['callback'] instanceof Function) ? dmData['callback'] : null // 弹幕结束后的回调函数（如果有的话）
                );
            }
        } else {
            output('Use one list first.', 2);
        }
    }
    /**
     * 往正在操纵(use)的列表中添加弹幕
     * @param {Object} dmData 弹幕对象
     * @param {Number} time 弹幕出现的时刻(ms)
     * @returns {String} 弹幕代号，失败会返回null
     */
    addDm(dmData, time) {
        /* dmData形如
            {
                text: '', // 弹幕内容
                reset_styles: false, // 是否在设置样式前重置样式，否则继承之前的样式
                styles: {...}, // 弹幕样式
                created: ... 同Danmaku.create的创建后回调
                callback: ... 同Danmaku.create的弹幕结束后回调
            }
         */
        let list = this.usingList;
        if (list) {
            // 检验参数是否符合要求
            if (!(dmData instanceof Object && typeof time == 'number' && time >= 0)) {
                output('Invalid parameters!', 3);
                return null;
            }
            if (!dmData.hasOwnProperty('text')) {
                output('Lack of necessary properties in danmakuData!', 3);
                return null;
            }
            // 生成列表中的弹幕代号
            let serial = `ld${list['dmSerial']}`;
            // 保证time是整数
            time = Math.round(time);
            // danmakuLine中储存弹幕信息，通过弹幕代号访问
            list.danmakuLine[serial] = dmData;
            // 要保证timeLine的有序性，以便使用二分查找，这里升序插入
            let i = 0,
                len = list.timeLine.length,
                pushed = false; // 是否已经插入
            // 用do-while是因为要保证至少执行一次
            do {
                let item = list.timeLine[i];
                if (!item || item[0] > time) {
                    // 时间线中储存[时刻,弹幕代号]
                    list.timeLine.splice(i, 0, [time, serial]);
                    pushed = true;
                    break;
                }
                i++;
            } while (i < len);
            // 没有找到位置，说明要插入的时刻比所有时刻都大，直接插入到最后
            if (!pushed)
                list.timeLine.push([time, serial]);
            list['dmSerial']++;
            return serial; // 返回弹幕代号
        } else {
            output('Use one list first.', 2);
            return null;
        }
    }
    /**
     * 从正在操纵(use)的列表中移除弹幕
     * @param {String} serial 弹幕代号
     * @returns {Boolean} 是否成功
     */
    delDm(serial) {
        let list = this.usingList;
        if (list) {
            if (list.danmakuLine[serial]) {
                // 从弹幕列表中移除
                delete list.danmakuLine[serial];
                // 从时间线中移除
                for (let i = 0, len = list.timeLine.length; i < len; i++) {
                    if (list.timeLine[i][1] == serial) {
                        list.timeLine.splice(i, 1);
                        break;
                    }
                }
                return true;
            }
        } else {
            output('Use one list first.', 2);
        }
        return false;
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
            output(`List ${listName} not found!`, 3);
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
                // 时刻不确定度(ms)，默认±0.2s
                uncertainty: 200,
                // 本列表中的弹幕序列号
                dmSerial: 0
            }
        } else {
            output(`List ${listName} already exists!`, 3);
        }
    }
    /**
     * 导出正在操纵(use)的列表
     * @param {String} outputName 输出名字（要求能当作变量名）
     * @param {String} fileType 导出文件类型js/json
     * @param {Boolean} download 是否触发下载
     * @returns {String} 导出的文件内容，发生错误则为空字符串''
     */
    export(outputName, fileType = 'js', download = false) {
        let list = this.usingList;
        if (list) {
            // 保证输出名合法
            if (!/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(outputName)) {
                output('Illegal output name for List!', 3);
                return '';
            }
            // 时间线打一开始就是升序的了
            let timeLine = list['timeLine'],
                jsStr = `const ${outputName} = [`, // 用于导出js的字符串
                jsonArr = [], // 用于导出json的数组
                outputStr = ''; // 最终导出的字符串
            for (let i = 0, len = timeLine.length; i < len; i++) {
                let [time, serial] = timeLine[i],
                    // 这里浅复制一层，因为要加入time属性
                    dmData = Object.assign({}, list['danmakuLine'][serial]);
                dmData['time'] = time; // 新增时刻属性
                // 手动构造一个JavaScript数组，每个元素是一个对象，缩进为4个空格
                jsonArr.push(dmData);
                jsStr += `\n    ${objectString(dmData)},`;
            }
            jsStr += '\n]';
            if (fileType === 'json') {
                outputStr = JSON.stringify(jsonArr, null, 4);
            } else {
                outputStr = jsStr;
            }
            if (download) {
                let name = `${outputName}.${fileType}`,
                    mime = (fileType === 'json' ? 'application/json' : 'application/javascript');
                // 触发下载
                dispatchDownload(name, mime, outputStr);
            }
            // 返回创建的字符串
            return outputStr;
        } else {
            output('Use one list first.', 2);
            return '';
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
            output(`List ${listName} not found!`, 3);
        }
    }
}

export default List;