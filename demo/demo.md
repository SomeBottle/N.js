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

<div class="danmaku-container small" id="demo-1"></div>

点击<a href='javascript:void(0);' onclick="trigger_demo_1()">这里</a>生成一条普通的<del>Disco</del>弹幕

```javascript
demo_ins.create('普通的disco我们普通的摇~🎶');
```

## 变更样式

<div class="danmaku-container small" id="demo-2"></div>

默认情况下字体大小是**程序自动判断**的，其实咱也可以直接自行指定。比如说，<a href='javascript:void(0);' onclick="trigger_demo_2(1)">2em的弹幕</a>。

```javascript
demo_ins.attrs('size','2em').create('Woah~我超大的啦~'); // 支持链式语法
```

样式是**能够继承的**。**假设在执行上面这条语句后**，咱加个粗体，再给弹幕涂上蓝色（<a href='javascript:void(0);' onclick="trigger_demo_2(2)">点我查看效果</a>）。

## 弹幕类型

