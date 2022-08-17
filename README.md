# N.js

![Banner](https://ww2.sinaimg.cn/large/ed039e1fgy1fxzuvu16clj20m808cgpi)  

## Demo

[https://ndanmaku.xbottle.top](https://ndanmaku.xbottle.top)  

## 这是啥子嘞？ 

这是一个简单的、用于创建弹幕的浏览器JavaScript组件。<del>咱绞尽脑汁想出的</del>特色如下：

* 弹幕时间支持到**毫秒**级别
* 支持在屏幕**中间**的弹幕
* **尽量高**的弹幕可自定义度
* 自带弹幕碰撞判断，充分利用屏幕空间
* 链式语法
* 自带简单的**弹幕列表**，可按时刻装载/创建弹幕

## 使用它吧！

1. 引入`N.min.js`  

    在页面中引用位于本仓库`dist/`目录下的 [N.min.js](dist/N.min.js) 文件。

    ```html  
    <script src='./N.min.js' charset='UTF-8'></script>  
    ```  

    或者如果`jsdelivr`仍然能使用的话：

    ```html
    <script src='https://cdn.jsdelivr.net/npm/n-danmaku@latest/dist/N.min.js' charset='UTF-8'></script>  
    ```

2. 创建`NDanmaku`对象

    构造方法：

    ```javascript
    new NDanmaku(container, prefix = '', zIndex = 'auto')
    ```

    - `container` - 弹幕容器元素，可以是一个**字符串**(元素的`id`)，也可以是一个**DOM元素对象**。

    - `prefix` - 容器弹幕的前缀，默认为空。

    - `zIndex` - 上述容器将被设置的`z-index`值，默认为`auto`。

    详情见[NDanmaku方法](#ndanmaku对象)  

    ------

    这里就说一下第一个参数`container`：
    
    1. 你可以这样创建对象：

        ```javascript
        const danmaku = new NDanmaku('test');
        ```

        在创建对象的时候，程序会寻找`id`为`test`的DOM元素。

    2. 你也可以这样写：

        ```javascript
        const danmaku = new NDanmaku(document.querySelector('.test'));
        ```

        这样就是直接将一个**DOM元素**对象传给构造方法。

    > ⚠ **注意：**在创建对象后，上面传入的**DOM元素**的样式的定位属性`position`会被自动设置为`relative`！

3. 调用`NDanmaku`方法

    你可以调用`NDanmaku`对象的`create()`方法来创建一条弹幕：

    ```javascript
    // danmaku就是上面创建的`NDanmaku`对象
    danmaku.create('Hello N.js!');
    ```

    其他更多方法详见下方~

## 关于弹幕

### 弹幕属性

弹幕在创建的时候都会应用**当前设置**的弹幕属性。  

现有的弹幕属性及其默认值如下：

| 属性键 | 默认值 | 说明 |
|:---:|:---:|:---:|
| `color` | `'white'` | 弹幕颜色，和`CSS`中的`color`一致 |
| `size` | `null` | 弹幕字体大小，和`CSS`中的`font-size`一致，为`null`则程序**自行计算** |
| `scale` | `1` | 弹幕基于`size`的缩放倍数 (比如`0.5`, `2`) ，仅在`size`为`null`时有效 |
| `opacity` | `100` | 弹幕透明度 (百分数) |
| `weight` | `normal` | 弹幕字体粗细，和`CSS`中的`font-weight`一致 |
| `bottom_space` | `2` | 弹幕纵向上的间距，单位是`px` |
| `outline` | `true` | 是否给弹幕描黑边 |
| `reverse` | `false` | 弹幕是否**逆向滚动**，仅对**滚动类**弹幕有效 |
| `type` | `'scroll'` | 弹幕类型，详见[这里](#弹幕类型) |
| `life` | `5000` | 弹幕生命时间，单位是`ms` |
| `pointer_events` | `true` | 弹幕是否**接受鼠标事件** |
| `custom_css` | `{}` | 自定义弹幕CSS样式 |

设置属性的方法详见[下方](#ndanmaku对象)~

### 弹幕类型

Demo中有相应的[示例](https://ndanmaku.xbottle.top/#%E6%94%B9%E5%8F%98%E5%BC%B9%E5%B9%95%E7%B1%BB%E5%9E%8B)。

> 注：对于**滚动弹幕**来说，滚动方向的正方向是**自右向左**。

| 弹幕类型 | 说明 |
|:---:|:---:|
| `scroll` | 普通滚动弹幕 |
| `midscroll` | 在中间滚动的弹幕 |
| `random` | 随机高度的滚动弹幕 |
| `top` | 顶部悬停弹幕 |
| `bottom` | 底部悬停弹幕 |
| `midhang` | 在中间悬停的弹幕 |

## 对象的方法和属性

以下内容结合[Demo](#demo)食用更佳哦~(๑´ڡ`๑) 

### `NDanmaku`对象

* 方法

    | 文档 | 涵盖的方法 |主要内容|
    |:---:|:---:|:---:|
    |[构造方法](docs/constructor.md)|`constructor()`|构造方法的参数 / 弹幕DOM元素的`id`|
    |[弹幕创建方法](docs/create.md)|`create()`| 弹幕创建相关 |
  
* 属性

    * `danmaku.statistics`


### `List`对象


