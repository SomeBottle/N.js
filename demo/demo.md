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

<div class="danmaku-container tiny" id="demo-1"></div>

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

### 属性的继承

属性是**能够继承的**。 **假设**在执行上面这条语句后，咱加个粗体，再给弹幕涂上蓝色（<a href='javascript:void(0);' onclick="trigger_demo_2(2)">点我查看效果</a>）：

```javascript
demo_ins.attrs('size','2em').create('Woah~我超大的啦~');
demo_ins.attrs('weight', 'bold')
    .attrs('color', 'blue')
    .create('大~粗~蓝~的~弹~幕~');
```

### 重置弹幕属性

坏了！咱记不住之前的样式是咋样的了！没关系，咱们其实可以**重置**属性(包括样式)为初始状态。<del>其实上面的示例为了保证效果，在源码中是进行了重置的</del>  

在样式重置后，迎面而来的是<a href='javascript:void(0);' onclick="trigger_demo_2(3)">一条20%透明的绿色弹幕</a>：

```javascript
demo_ins.resetAttrs() // 重置弹幕属性
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

<!--Demo_3-->

<div class="danmaku-container big" id="demo-3"></div>

弹幕量很多时，我们观赏原内容的体验会下降。<del>更不谈有些视频中存在着遮挡字幕的弹幕</del>

因此，`N.js`有一个限定弹幕生成范围的功能，可以通过`NDanmaku`对象的`range`方法来进行设置。  

比如，我可以设置让滚动弹幕**最多只占屏幕的50%**（<a href='javascript:void(0);' onclick="trigger_demo_3(1)">点击查看效果</a>）：  

```javascript
demo_ins.range('scroll', [0, 50]); // 生成范围从0%到50%
for (let i = 0; i < 6; i++) demo_ins.create('测试弹幕');
```

------
亦可以设置让底部弹幕只在**屏幕的20%至70%处**生成（<a href='javascript:void(0);' onclick="trigger_demo_3(2)">点击查看效果</a>）：

```javascript
demo_ins.range('bottom', [20, 70]).attrs('type','bottom');
for (let i = 0; i < 6; i++) demo_ins.create('测试弹幕');
```

------
和`attrs()`方法相同的地方是，你也可以直接给`range()`方法传入一个对象，以**同时设定**多个值：

```javascript
demo_ins.range({
    'bottom':[20, 70],
    'top':[0, 50]
});
```
------

当然，弹幕生成范围和弹幕属性一样能够通过一个方法进行**重置**：```resetRange()```，这里就不演示了。

## 暂停和恢复

<!--Demo_4-->

<div class="danmaku-container tiny" id="demo-4"></div>

### 暂停所有弹幕

点击<a href='javascript:void(0);' onclick="trigger_demo_4(1)">这里</a>暂停上面容器内的所有弹幕。

```javascript
demo_ins.pause();
```

### 恢复所有弹幕

点击<a href='javascript:void(0);' onclick="trigger_demo_4(2)">这里</a>恢复上面容器内的所有弹幕。

```javascript
demo_ins.resume();
```

### 暂停/恢复指定弹幕

实际上`pause()`和`resume()`方法都可以接受一个**弹幕（在本容器内）的唯一ID**作为参数。

```javascript
demo_ins.pause(danmakuId);
demo_ins.resume(danmakuId);
```

相关示例可以看[这里](#created)。

## create的回调函数

<!--Demo_5-->

<div class="danmaku-container tiny" id="demo-5"></div>

用于创建弹幕的方法`create()`其实还能接受`2`个回调函数作为参数：

```javascript
create(text[, created[, callback]]);
```

### created

这个回调函数在**弹幕刚刚被创建后**就会被调用，它会接收到两个参数：

```javascript
created(newElement,danmakuId);
```

* `newElement` - 新创建的弹幕元素对象(HTMLDivElement)
* `danmakuId` - 新创建的弹幕(在本容器内)的唯一ID

举个例子。利用这个回调函数，咱们可以实现一个**鼠标经过弹幕上方时让弹幕暂停**的效果（<a href='javascript:void(0);' onclick="trigger_demo_5(1)">点我查看</a>）：

```javascript
demo_ins.attrs('size', '1.2em')
    .create('鼠标移动到我身上', (element, id) => {
        element.onmouseover = () => {
            demo_ins.pause(id);
        };
        element.onmouseout = () => {
            demo_ins.resume(id);
        }
    });
```

### callback

<del>懒得想形参名了，就定为callback啦</del>

这个回调函数会在**弹幕正常消失**后被触发。它接收一个参数：

```javascript
callback(danmakuId);
```

* `danmakuId` - 新创建的弹幕(在本容器内)的唯一ID

下面这个例子中的弹幕在**正常**消失后会通过`window.alert()`提醒咱们（<a href='javascript:void(0);' onclick="trigger_demo_5(2)">点我查看</a>）：

```javascript
demo_ins.attrs('size', '1.2em')
    .create('我消失后会弹窗哦', null, (id) => {
        alert(`ID为${id}的弹幕刚刚消失了！`)
    });
```

为什么说是“正常消失”呢，因为实际上弹幕是可以被手动清除的（详情看下方）。  
被手动清除的弹幕不会触发`callback()`回调。  

## 清除弹幕

<!--Demo_6-->

<div class="danmaku-container small" id="demo-6"></div>

<del>弹幕的非自然死亡</del>

> 注：以下的演示在被触发后都会**延迟半秒**再清除相应弹幕，以便观察。

### 清理所有弹幕

```javascript
demo_ins.clear();
```

<a href='javascript:void(0);' onclick="trigger_demo_6(1)">点此</a>查看效果

### 清理指定ID的弹幕

```javascript
demo_ins.clear(danmakuId);
```

### 清理部分弹幕

```javascript
demo_ins.clearSome([type = '', [reversed = 'all']])
// type - 弹幕类型，可选值：all / scrolling / hanging / ...其他attrs可设置的类型
// reversed - 待清理的是不是逆向运行的弹幕（仅对滚动弹幕起效）
```

* 不传入任意参数，则<a href='javascript:void(0);' onclick="trigger_demo_6(2)">清理所有弹幕</a>  
    <del>其实`clear()`不传入参数时就是调用`clearSome()`</del>

    ```javascript
    demo_ins.clearSome();
    ```

* 第一个参数传入`'all'`，第二个参数传入`true`，<a href='javascript:void(0);' onclick="trigger_demo_6(3)">清除所有逆向滚动的弹幕和所有悬停弹幕</a>

    ```javascript
    demo_ins.clearSome('all', true);
    ```

* 第一个参数传入`'scrolling'`，第二个参数传入`true`，<a href='javascript:void(0);' onclick="trigger_demo_6(4)">清除所有逆向滚动的弹幕</a>

    ```javascript
    demo_ins.clearSome('scrolling', true);
    ```

* 第一个参数传入`'hanging'`，则<a href='javascript:void(0);' onclick="trigger_demo_6(5)">清除所有悬停弹幕</a>

    ```javascript
    demo_ins.clearSome('hanging');
    ```

* 第一个参数传入`'midscroll'`，第二个参数传入`true`，则<a href='javascript:void(0);' onclick="trigger_demo_6(6)">清除所有逆向且在中间滚动的弹幕</a>

    ```javascript
    demo_ins.clearSome('midsroll', true);
    ```

* 第一个参数传入`'random'`，则<a href='javascript:void(0);' onclick="trigger_demo_6(7)">清除所有随机滚动弹幕</a>

    ```javascript
    demo_ins.clearSome('random');
    ```

* 以此类推...

### 清除带有指定样式的弹幕

> 注：这个方式可能**不太稳定**

```javascript
demo_ins.clearStyled(styles);
```

向第一个参数传入一个**包含CSS样式键值对的对象**即可。

比如清除所有颜色为**蓝色**，且字体大小为**1.2em**的<a href='javascript:void(0);' onclick="trigger_demo_6(8)">弹幕</a>：

```javascript
demo_ins.clearStyled({
    'color': 'blue',
    'font-size': '1.2em'
});
```

> 之所以不稳定，是因为每次清除时传入的样式要保证和**目标弹幕的样式完全一致**。

------

另外，这个方法在匹配弹幕的时候还支持逻辑取反，只需要在样式值的**前面加上一个`!`即可**。  

比如，我要清除**所有不是白色的弹幕**，可以这样写（<a href='javascript:void(0);' onclick="trigger_demo_6(9)">点我查看效果</a>）：

```javascript
demo_ins.clearStyled({
    'color': '!white' // 默认情况下弹幕样式的color值为'white'
    // 值得注意的是，一旦设置为了十六进制或者rgb值，这样就没效果了
    // 所以才说clearStyled不太稳定
});
```


## 弹幕-时刻列表

<!--Demo_7-->

<div class="danmaku-container tiny" id="demo-7"></div>

弹幕往往是和媒体搭配在一起的，在这种场景下，弹幕出现在媒体播放的不同时刻处。  

为了方便实现这种应用，`N.js`自带简单的**弹幕-时刻列表**功能。

具体的使用方法见README，这里简单演示一下**根据媒体时刻创建弹幕**。

### 根据时刻创建弹幕

先创建列表，加入几条弹幕：

```javascript
demo_ins.list.new('test'); // 新建名为'test'的列表
demo_ins.list.use('test'); // 切换到'test'列表
demo_ins.list.addDm({
    text: '这是一条逆向滚动弹幕',
        reset_styles: true,
        styles: {
            life: 5000,
            reverse: true
        }
}, 524); // 在524毫秒时刻添加一条弹幕
demo_ins.list.addDm({
    text: '这是一条蓝色弹幕',
        styles: {
            life: 7000,
            color: 'blue',
            reverse: false,
            bottom_space: 2,
            type: 'scroll'
        }
}, 1024); // 在1024毫秒时刻添加一条弹幕
demo_ins.list.uncertainty(0); // 这里先设置时刻不确定度为0
```

通过调用`tick(time)`方法，程序会在列表中寻找对应时刻的弹幕进行创建：

```javascript
demo_ins.list.tick(1024); // 创建1024毫秒处的弹幕
```

<a href='javascript:void(0);' onclick="trigger_demo_7(1)">点此</a>尝试上面的语句。

### 时刻不确定度

`N.js`的弹幕相关时间/时刻都是**毫秒级**的，问题也出现在这里。  

对于普通的视频/音频来说，通常秒级精度已经够用了。就算能精确到毫秒，也很难保证**每次播放时**程序都能完美地触发**每一毫秒**时刻的弹幕。  

但是吧，如果我把创建弹幕的时刻扩大为**两个时刻之间的一段时间间隔**，那么程序命中的可能性就会大大增加，由此便引入了时刻不确定度：

```javascript
demo_ins.list.uncertainty(time); // 单位仍然是毫秒
```

------

上面的例子中，咱们调用`tick(1024)`让程序生成了第`1024`毫秒处的弹幕。接下来咱们设置时间不确定度为 `±0.5s` （也就是500ms）  

```javascript
demo_ins.list.uncertainty(500);
```

接下来我们再调用`tick(1024)`，程序就会**在列表中搜索`[1024-500, 1024+500]`这个区间内的弹幕**，并加以创建。  

也就是说，原本的单一时刻被拓宽成了一个时间搜索范围：`1024±500ms`。  

<a href='javascript:void(0);' onclick="trigger_demo_7(2)">点我</a>尝试一下吧！

## 到底啦

至此这个简单的演示文档就结束了。这里咱只粗略地演示了一下相关功能，详细介绍一定要多看**README/文档**哦！

![readme-2022-08-16](https://images.weserv.nl/?url=https://raw.githubusercontent.com/cat-note/bottleassets/main/img/readme-2022-08-16.png)