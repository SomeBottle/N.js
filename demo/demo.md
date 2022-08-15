## 开始
(｡･∀･)ﾉﾞ嗨，你好！咱们先搓一个**NDanmaku**对象吧
```javascript
// container-id即弹幕div的id
const demo_ins = new NDanmaku('container-id');

// 其实你还可以直接传入一个元素对象
const demo_ins = new NDanmaku(
    document.querySelector('.danmaku-container')
);
```

## 创建一条弹幕

<!--Demo_1-->

<div class="danmaku-container small" id="demo-1"></div>

点击<a href='javascript:void(0);' onclick="trigger_demo_1()">这里</a>生成一条普通的<del>Disco</del>弹幕

```javascript
demo_ins.create('普通的disco我们普通的摇~🎶');
```

## 变更弹幕属性

<!--Demo_2-->

<div class="danmaku-container small" id="demo-2"></div>

### 指定字体大小

默认情况下字体大小是**程序自动判断**的，其实咱也可以直接自行指定。比如说，<a href='javascript:void(0);' onclick="trigger_demo_2(1)">2em的弹幕</a>：

```javascript
demo_ins.attrs('size','2em').create('Woah~我超大的啦~'); // 支持链式语法
```

### 样式的继承

样式是**能够继承的**。 **假设**在执行上面这条语句后，咱加个粗体，再给弹幕涂上蓝色（<a href='javascript:void(0);' onclick="trigger_demo_2(2)">点我查看效果</a>）：

```javascript
demo_ins.attrs('size','2em').create('Woah~我超大的啦~');
demo_ins.attrs('weight', 'bold')
    .attrs('color', 'blue')
    .create('大~粗~蓝~的~弹~幕~');
```

### 重置样式

坏了！咱记不住之前的样式是咋样的了！没关系，咱们其实可以**重置**样式为初始状态。<del>其实上面的示例为了保证效果，在源码中是重置了样式的</del>  

在样式重置后，迎面而来的是<a href='javascript:void(0);' onclick="trigger_demo_2(3)">一条20%透明的绿色弹幕</a>：

```javascript
demo_ins.resetStyles() // 重置样式
    .attrs('opacity', 20)
    .attrs('color', '#2EFE2E')
    .create('原谅我这么绿~');
```

### “一步”设置样式

改弹幕样式要写这么多```.attrs()```，能不能一步到位啊喂！  

当然冇问题啦！实际上你可以直接**传一个对象**给```.attrs()```，以同时设置多个样式（<a href='javascript:void(0);' onclick="trigger_demo_2(4)">点我查看效果</a>）：

```javascript
demo_ins.attrs({
    outline: false, // 关闭自动描黑边
    color: '#FE9A2E', // 设置为柑橘色
    size: null, // 设置为null自动计算字体大小
    scale: 1.5, // 在自动计算的基础上放大1.5倍
    weight: 'lighter', // 设置为细体
    opacity: 80 // 设置为80%透明
}).create('蜜柑色~🍊');
```

### 自定义弹幕样式

平时在某站发弹幕时，咱们自己的弹幕会被着重显示（比如加上一个高亮边框）。  

实际上，`N.js`也在弹幕属性中提供了**自定义样式**来实现这些额外的效果。接下来，咱们发一条<a href='javascript:void(0);' onclick="trigger_demo_2(5)">带有蓝色边框的弹幕</a>：

```javascript
demo_2.attrs({
    size: '1.5em',
    custom_css: {
        border: '1px solid #2ECCFA'
    }
}).create('2333333333');
```

### 改变弹幕类型

弹幕肯定不会只有一种滚动的方式吧！`N.js`**除了滚动弹幕**外还支持以下这些弹幕类型：

* <a href='javascript:void(0);' onclick="trigger_demo_2(6)">随机滚动弹幕</a>

    ```javascript
    demo_ins.attrs({
            size: '1.2em',
            type: 'random'
        }).create('随机弹幕~');
    ```

* <a href='javascript:void(0);' onclick="trigger_demo_2(7)">顶部悬停弹幕</a>

    ```javascript
    demo_ins.attrs('type', 'top').create('顶部悬停弹幕');
    ```

* <a href='javascript:void(0);' onclick="trigger_demo_2(8)">底部悬停弹幕</a>

    ```javascript
    demo_ins.attrs('type', 'bottom').create('底部悬停弹幕');
    ```

* <a href='javascript:void(0);' onclick="trigger_demo_2(9)">中部悬停弹幕</a>

    ```javascript
    demo_ins.attrs('type', 'midhang').create('中部悬停弹幕');
    ```

* <a href='javascript:void(0);' onclick="trigger_demo_2(10)">中部滚动弹幕</a>

    ```javascript
    demo_ins.attrs('type', 'midscroll').create('中部滚动弹幕');
    ```

中部弹幕来自于[@板砖猫](https://github.com/BanZhuan-CAT)的建议。

### 弹幕滚动方向

对于滚动弹幕来说，咱们还可以设置弹幕的**滚动方向**。接下来的这条弹幕便是<a href='javascript:void(0);' onclick="trigger_demo_2(11)">一条逆向普通滚动的弹幕</a>：

```javascript
demo_ins.attrs({
    size: '1.2em',
    type: 'scroll',
    reverse: true // 仅对滚动弹幕起效
}).create('逆向滚动弹幕');
```

### 调节弹幕生命时长

每条弹幕都有消逝的时候，而从出现到消逝的这段时间便是弹幕的**生命**时长，也就是弹幕在屏幕前展示的时间长度。

接下来咱们创建<a href='javascript:void(0);' onclick="trigger_demo_2(12)">几条生命时长不同的弹幕</a>试试：

```javascript
demo_ins.attrs({
    size: '1.2em',
    type: 'scroll',
    life: 2000,
}).create('2秒的弹幕')
.attrs({
    type: 'top',
    life: 3000
}).create('3秒的弹幕')
.attrs({
    type: 'bottom',
    life: 4000
}).create('4秒的弹幕')
.attrs({
    type: 'scroll',
    reverse: true,
    life: 5000
}).create('5秒的弹幕');
```


-------

其他没有提到的属性可前往围观[README](https://github.com/SomeBottle/N.js#readme)描述哦~

## 限定弹幕生成范围


## create的回调函数