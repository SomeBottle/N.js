# List对象的相关方法

List对象的方法调用暂**不支持**链式语法。

## 目录

- [Demo](#demo)  
- [创建列表](#创建列表) `new()`
- [删除列表](#删除列表) `del()`
- [切换到某个列表](#切换到某个列表) `use()`
- [向当前列表中添加弹幕](#向当前列表中添加弹幕) `addDm()`   
    - [dmData](#dmdata)  
    - [time](#time)
    - [示例](#示例)
- [从当前列表中移除弹幕](#从当前列表中移除弹幕) `delDm()`
    - [danmakuSerial](#danmakuserial)
- [根据时刻从当前列表中创建弹幕](#根据时刻从当前列表中创建弹幕) `tick()`  
- [调整当前列表的时刻不确定度](#调整当前列表的时刻不确定度) `uncertainty()`
    - [图解](#图解)  
- [往当前列表中载入一批弹幕](#往当前列表中载入一批弹幕) `load()`
    - [danmakuArr](#danmakuarr)  
    - [使用技巧：载入弹幕js文件](#使用技巧载入弹幕js文件)  
    - [使用技巧：载入弹幕json文件](#使用技巧载入弹幕json文件)
- [导出当前列表](#导出当前列表) `export()`
    - [outputName](#outputname)
    - [fileType](#filetype)
    - [download](#download)
    - [展示：导出的js文件内容](#展示导出的js文件内容)


## Demo

见[示例：弹幕-时刻列表](https://ndanmaku.xbottle.top/#弹幕-时刻列表)  

## 创建列表

```javascript
danmaku.list.new(listName)
```

- `listName` - 待创建的列表名称

要使用列表，需要先创建列表，不是嘛！  

------

## 删除列表

```javascript
danmaku.list.del(listName)
```

- `listName` - 待删除的列表名称

列表不要了就用这个方法删了罢

------

## 切换到某个列表

```javascript
danmaku.list.use(listName)
```

- `listName` - 待切换的列表名称  

**接下来的方法**都必须要**先通过此方法“切换到”列表中**才能使用。

<del>借用一下数据库管理系统的`use`</del>

------

## 向当前列表中添加弹幕

```javascript
danmaku.list.addDm(dmData, time)
```

- `dmData` - 待添加的弹幕数据

- `time` - 弹幕出现的时刻，单位为毫秒(ms)

- **返回值**：弹幕**在列表中**的**代号**`danmakuSerial`

> 使用前提：使用`use()`方法切换到了列表中  

### dmData

取值为**一个对象**，包含一条弹幕的数据。  

示例对象：

```javascript
{
    text: '', // 弹幕内容
    reset_styles: false, // 是否在设置样式前重置样式，否则继承之前的样式
    styles: {...}, // 弹幕样式
    created: null // 同danmaku.create的创建后回调created()
    callback: null // 同danmaku.create的弹幕结束后回调callback()
}
```

### time

取值为**一个整数**，单位为**毫秒(ms)**，代表弹幕出现的时刻。  

### 示例

比如在`955ms`处插入一条蓝色弹幕，并在创建该弹幕时重置样式：

```javascript
danmaku.list.addDm({
    text: '这是一条逆向滚动弹幕',
    reset_styles: true,
    styles: {
        color: 'blue'
    }
}, 955);
```

------

## 从当前列表中移除弹幕

```javascript
danmaku.list.delDm(danmakuSerial)
```

- `danmakuSerial` - 待从**当前列表**中移除的弹幕代号

- **返回值**：布尔值`true`/`false`，代表是/否移除成功

> 使用前提：使用`use()`方法切换到了列表中  

### danmakuSerial

取值为**一个字符串**，代表**当前列表中**某条弹幕的代号。  

**弹幕代号**在用`addDm()`方法添加弹幕时会返回。  

------

## 根据时刻从当前列表中创建弹幕

```javascript
danmaku.list.tick(time)
```

- `time` - 需要检查的时刻，单位为毫秒(ms)

> 使用前提：使用`use()`方法切换到了列表中  

光在列表中添加了弹幕，该怎么让这些弹幕被创建出来捏？这就不得不提到咱们的`tick()`方法了!  

通过调用该方法，程序会在列表中寻找在`time`时刻（或附近）的弹幕，并**创建**命中的弹幕。

为什么还加了一小句“或附近”呢？看接下来这一个方法吧！  

-------

## 调整当前列表的时刻不确定度

```javascript
danmaku.list.uncertainty(time)
```

- `time` - 不确定时间段，单位为毫秒(ms)

- **每一个列表**的**默认时刻不确定度**为 `200ms`  

> 使用前提：使用`use()`方法切换到了列表中  

上面的`tick()`方法会搜索某一时刻的弹幕并加以创建。  

实际使用中，媒体的时间精确度可能**达不到毫秒级**，但弹幕时刻精确到了毫秒，这就导致如果`tick(媒体时刻)`的话，可能有些弹幕不会被创建出来。  

因此引入了时刻不确定度。

### 图解

```javascript
danmaku.list.uncertainty(0);
danmaku.list.tick(200);
```

这个时候**仅搜索**在时刻`200ms`处的弹幕，图中的**弹幕2**会被创建：

![danmakuTickUncertainty1-2022-08-19](https://images.weserv.nl/?url=https://raw.githubusercontent.com/cat-note/bottleassets/main/img/danmakuTickUncertainty1-2022-08-19.png)  

------

```javascript
danmaku.list.uncertainty(45);
danmaku.list.tick(200);
```

这个时候搜索的是**一段时间范围内**（ `200 ± 45 ms` ）的弹幕，图中的**弹幕2**、**弹幕3**会被创建：

![danmakuTickUncertainty2-2022-08-19](https://images.weserv.nl/?url=https://raw.githubusercontent.com/cat-note/bottleassets/main/img/danmakuTickUncertainty2-2022-08-19.png)

-----

## 往当前列表中载入一批弹幕

```javascript
danmaku.list.load(danmakuArr)
```

- `danmakuArr` - 待载入的包含弹幕数据的数组  

- **返回值**：布尔值`true`/`false`，代表是/否载入成功

> 使用前提：使用`use()`方法切换到了列表中  

当弹幕数量很大时，使用`addDm()`方法一条一条地添加弹幕到列表中实在是太麻烦了，因此有了这个`load()`方法，将一批弹幕一次性添加到列表中。  

### danmakuArr

取值为**一个数组**，这个数组的每一个元素是一个**弹幕数据对象**。  

弹幕数据对象示例如下：

```javascript
{
    time: 0, // 弹幕出现的时刻，单位为毫秒(ms)
    text: '', // 弹幕内容
    reset_styles: false, // 是否在设置样式前重置样式，否则继承之前的样式
    styles: {...}, // 弹幕样式
    created: null // 同danmaku.create的创建后回调created()
    callback: null // 同danmaku.create的弹幕结束后回调callback()
}
```

`danmakuArr`数组示例：

```javascript
[
    {
        time: 1098,
        text: '这是一条无描边，底部悬停的绿色弹幕',
        styles: {
            color: 'green',
            life: 4000,
            outline: false,
            type: 'bottom',
            'bottom_space': 30
        }
    },
    {
        time: 1072,
        text: '这是一条随机黄色弹幕',
        styles: {
            color: 'yellow',
            life: 4000,
            outline: false,
            type: 'random',
            'bottom_space': 2
        }
    }
]
```

### 使用技巧：载入弹幕js文件

创建一个JavaScript文件作为**弹幕数据文件**，可以这样写：

```javascript
const myList = [ // 这里咱就放两条测试弹幕
    {
        time: 2000,
        text: '测试弹幕1'
    },
    {
        time: 1002,
        text: '测试弹幕2'
    }
]
```

将这个文件命名为`myList.js`。

在页面中载入这个文件中的弹幕数据，可以这样写：

```html
<div id="danmaku-container"><!--弹幕容器--></div>
<script src="./myList.js"></script> <!--此时myList变量暴露到全局-->
<script src="./N.min.js"></script> 
<script>
const danmaku = new NDanmaku('danmaku-container');
danmaku.list.new('test'); // 新建列表test
danmaku.list.use('test'); // 切换到列表test
danmaku.list.load(myList); // 载入myList到列表test中
</script>
```

### 使用技巧：载入弹幕json文件

创建一个JSON文件作为**弹幕数据文件**，可以这样写：

```json
[ // 这里咱就放两条测试弹幕
    {
        "time": 2000,
        "text": "测试弹幕1"
    },
    {
        "time": 1002,
        "text": "测试弹幕2"
    }
]
```

将这个文件命名为`myList.json`。

在页面中载入这个文件中的弹幕数据，可以这样写：

```html
<div id="danmaku-container"><!--弹幕容器--></div>
<script src="./myList.js"></script> <!--此时myList变量暴露到全局-->
<script src="./N.min.js"></script> 
<script>
const danmaku = new NDanmaku('danmaku-container');
danmaku.list.new('test'); // 新建列表test
danmaku.list.use('test'); // 切换到列表test
fetch('./myList.json')
    .then(res => res.json())
    .then(data => danmaku.list.load(data)); // 载入myList到列表test中
</script>
```

------

## 导出当前列表

```javascript
danmaku.list.export(outputName, fileType = 'js', download = false)
```

- `outputName` - 输出的列表名，同时也是**不包括扩展名**的文件名

- `fileType` - 输出的文件类型，可选值为`js`或`json`，默认为`js`  

- `download` - 是否触发浏览器文件下载，默认为`false`  

- **返回值**：文件内容字符串，如果失败了则为空字符串`''`

> 使用前提：使用`use()`方法切换到了列表中  

这个方法可以说和`load()`是反着来的，它可以将当前列表导出为字符串/文件。

### outputName

取值为一串**字符串**，代表输出的**列表名**。  

值得注意的是，传入这个参数时有一定限制：传入的字符串必须满足**JavaScript的变量命名规则**。  

> 简单说来，就是：字符串每个字符只能是<strong>字母、数字、美元符号`$`、下划线`_`</strong>，且首个字符不能是数字。

### fileType

* 默认值: `'js'`

* 可选值: `'js'`或`'json'`  

取值为一串**字符串**，代表导出的文件类型。根据**文件类型**不同，最终程序生成的文件内容也不同。

对于`.js`文件来说，导出的时候支持导出列表中弹幕的**回调函数**；但是对于`.json`文件来说是肯定不支持这点的。

### download

* 默认值: `false` (默认不触发下载)

取值为一个**布尔值**`true`/`false`。  

如果为`true`，程序会将文件内容**写入文件**，并**触发浏览器下载**。文件名为  `outputName` + 后缀。

### 展示：导出的js文件内容

```javascript
const testDm = [
    {
        "text": "这是一条蓝色弹幕",
        "styles": {
                "life": 7000,
                "color": "blue",
                "reverse": false,
                "bottom_space": 2,
                "type": "scroll",
        },
        // 如果导出.js文件，是支持导出回调函数的！
        "created": (element, id) => { 
            element.onmouseover = () => {
                dmCon.pause(id);
            }
            element.onmouseout = () => {
                dmCon.resume(id);
            }
        },
        "time": 1001,
    },
    {
        "text": "测试弹幕2",
        "time": 2002,
    },
]
```