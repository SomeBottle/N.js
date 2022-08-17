# N.js

![Banner](https://ww2.sinaimg.cn/large/ed039e1fgy1fxzuvu16clj20m808cgpi)  

## Demo

[https://ndanmaku.xbottle.top](https://ndanmaku.xbottle.top)  

## 这是啥子嘞？ 

这是一个简单的、用于创建弹幕的浏览器JavaScript组件。

## 使用方法

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
    new NDanmaku(container, zIndex = 'auto', prefix = '')
    ```

    - `container` - 弹幕容器元素，可以是一个**字符串**(元素的`id`)，也可以是一个**DOM元素对象**。
    
    - `zIndex` - 上述容器将被设置的`z-index`值，默认为`auto`。

    - `prefix` - 容器弹幕的前缀，默认为空。

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






