# N.js

![Banner](N.banner.png)  

## 这是啥子嘞？ 

这是一个简单的、用于创建弹幕的浏览器JavaScript组件。<del>咱绞尽脑汁想出的</del>特色如下：

* 弹幕时间支持到**毫秒**级别
* 支持在屏幕**中间**的弹幕
* **尽量高**的弹幕可自定义度
* 自带弹幕碰撞判断，充分利用屏幕空间
* 链式语法
* 自带简单的**弹幕列表**，可按时刻装载/创建弹幕

## 目录

- [Demo](#demo)
- [使用它吧！](#使用它吧)  
    - [浏览器端](#浏览器端)
    - [与模块打包器一起使用](#与模块打包器一起使用)
- [关于弹幕](#关于弹幕)  
    - [弹幕属性](#弹幕属性)
        - [关于carry_sheet](#关于carry_sheet)
    - [弹幕类型](#弹幕类型)
        - [关于自由弹幕](#关于自由弹幕)
- [对象的方法和属性](#对象的方法和属性)  
    - [NDanmaku对象](#ndanmaku对象)  
    - [List对象](#list对象)
- [FAQ](#faq)
    - [弹幕容器container中可以有其他DOM元素吗？](#弹幕容器container中可以有其他dom元素吗)  
    - [如果container元素中有其他定位为absolute的元素遮挡了弹幕，怎么办？](#如果container元素中有其他定位为absolute的元素遮挡了弹幕怎么办)  
    - [每条弹幕对应的DOM元素都有独一无二的 id 吗?](#每条弹幕对应的dom元素都有独一无二的id属性吗)  
    - [如何获得弹幕自身的唯一id?](#如何获得弹幕自身的唯一id)  
- [感谢](#感谢)  
- [Copyright](#copyright)

## Demo

[https://ndanmaku.xbottle.top](https://ndanmaku.xbottle.top)  

## 使用它吧！

### 浏览器端

1. 引入`N.min.js`  

    在页面中引用位于本仓库`dist/`目录下的 [N.min.js](dist/N.min.js) 文件。

    ```html  
    <script src='./N.min.js'></script>  
    ```  

    或者如果`jsdelivr`仍然能使用的话：

    ```html
    <script src='https://cdn.jsdelivr.net/npm/n-danmaku@latest/dist/N.min.js'></script>  
    ```

2. 创建`NDanmaku`对象

    构造方法：

    ```javascript
    new NDanmaku(container, prefix = '', zIndex = 'auto')
    ```

    - `container` - 弹幕容器元素，可以是一个**字符串**(元素的`id`)，也可以是一个**DOM元素对象**。

    - `prefix` - 容器弹幕的前缀，默认为空。

    - `zIndex` - 上述容器将被设置的`z-index`值，默认为`auto`。

    详情见[构造方法文档](docs/constructor.md)  

    ------

    这里就说一下第一个参数`container`，这个参数代表的DOM元素就是**弹幕的容器**，弹幕将会在其中被创建。
    
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

    💡 其他更多方法详见[下方](#ndanmakuMethods)~

### 与模块打包器一起使用

1. 通过`npm`安装

    ```bash
    npm install n-danmaku --save
    ```

2. 在运用模块打包器(如`webpack`)的工程中使用：

    ```javascript
    import NDanmaku from 'n-danmaku';
    
    const danmaku = new NDanmaku(container);
    ```


------

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
| `carry_sheet` | `''` | 弹幕随身携带`<style>`元素包含的**CSS样式内容**，留空则弹幕不会随身携带样式元素 |

> `custom_css`和`carry_sheet`不同的地方就在于，`custom_css`是直接应用到**弹幕DOM元素**上的；而`carry_sheet`是在弹幕DOM元素中创建了一个子元素`<style>`，并将**CSS样式内容**写入到该子元素中。  

#### 关于`carry_sheet`

* [Demo](https://ndanmaku.xbottle.top/#弹幕携带style元素)  

`carry_sheet`和`custom_css`的区别上面已经提到了。这里提一下`carry_sheet`中的特殊占位字符串。

在[创建对象时设置了`prefix`](docs/constructor.md#prefix)的前提下，`carry_sheet`中所有的占位：

```
[selfId]
```

都会被替换为**弹幕DOM元素的id**。

举个栗子：

```javascript
const danmaku = new NDanmaku(container, 'vid'); // prefix为vid
danmaku.attrs('carry_sheet',`
    #[selfId] {
        color: red!important;
    }
`);
// 比如这条弹幕DOM元素的id是 N-danmaku-vid-0
danmaku.create('test'); 
```

实际上这里的CSS样式文本会被替换为：

```css
#N-danmaku-vid-0 {
    color: red!important;
}
```

------

设置属性的方法详见[下方](#ndanmaku对象)~

### 弹幕类型

Demo中有相应的[示例](https://ndanmaku.xbottle.top/#%E6%94%B9%E5%8F%98%E5%BC%B9%E5%B9%95%E7%B1%BB%E5%9E%8B)。

> 注：对于**滚动弹幕**来说，滚动方向的正方向是**自右向左**。

| 弹幕类型 | 说明 | 是否参与碰撞检测 |
|:---:|:---:| :---: | 
| `scroll` | 普通滚动弹幕 | 参与 |
| `midscroll` | 在中间滚动的弹幕 | 不参与 |
| `random` | 随机高度的滚动弹幕 | 不参与 |
| `top` | 顶部悬停弹幕 | 参与 |
| `bottom` | 底部悬停弹幕 | 参与 |
| `midhang` | 在中间悬停的弹幕 | 不参与 |
| `free` | 自由弹幕 | 不参与 |

#### 关于自由弹幕

自由弹幕与其他类型弹幕最大的不同就在于，自由弹幕除了[弹幕属性](#弹幕属性)的配置之外，**不会被附上任何其他样式**（如`animation`、`transform`、`top`、`bottom`等）。  

你可以结合`custom_css`和`carry_sheet`自由发挥。

* [Demo](https://ndanmaku.xbottle.top/#改变弹幕类型-自由弹幕)  

> 注：所有弹幕元素全都是`absolute`绝对定位。**自由弹幕**的生命期仍然受属性`life`控制。

## 对象的方法和属性

以下内容结合[Demo](#demo)食用更佳哦~(๑´ڡ`๑) 

### `NDanmaku`对象

* 方法

     <a id='ndanmakuMethods'></a>

    | 文档 | 涵盖的方法 |
    |:---:|:---:|
    |[构造方法](docs/constructor.md)|`constructor()`|
    |[弹幕创建方法](docs/create.md)|`create()`|
    |[弹幕属性设置方法](docs/attributes.md)|`attrs()`, `resetAttrs()`|
    |[弹幕生成范围设置方法](docs/ranges.md)|`ranges()`, `resetRanges()`|
    |[弹幕运行状态控制方法](docs/danmakuState.md)|`pause()`, `resume()`|
    |[弹幕清除相关方法](docs/clear.md)|`clear()`, `clearSome()`, `clearStyled()`|
    |[统计信息相关方法](docs/statistics.md)|`resetStatistics()`|
  
* 属性

    * `danmaku.state`

        一串**字符串**，代表容器**全部**弹幕的**运行状态**：

        * `'paused'` - 暂停状态 
        * `'running'` - 运行状态

    * `danmaku.statistics`

        > 有[相关方法](#ndanmakuMethods)能重置部分统计信息哦。

        一个**对象**，是容器中弹幕的**统计信息**。这里说明一下几个字段：
        
        | 属性 | 说明 |
        | :---:|:---:|
        | `current` | 实时弹幕情况 |
        | `created` | 已经创建了多少弹幕 |
        | `global_state` | 全局弹幕状态（同`danmaku.state`）|
        | 有`total`字样 | 某种弹幕的总数 |
        | 有`garbages`字样 | 某种弹幕的垃圾总数 |
        | 有`reversed`字样 | 某类滚动弹幕之中的**逆向弹幕**的总数 |

        > `garbages` 垃圾数仅作参考。
        > 弹幕元素在被删除后，程序中仍然会存留一些弹幕相关的对象，这些残留对象便被称为“垃圾”。
        > 每次创建弹幕的时候都会触发垃圾回收器，无需担心。
        
        示例返回数据如下：

        <details>
        <summary>点我展开示例</summary>

        ```javascript
        {
            'created': { // 已经创建了的弹幕
                'total': 0, // 目前为止总创建弹幕数量
                'scrolling': {
                    'total': 0, // 目前为止创建的总滚动弹幕数量
                    'scroll': {
                        'total': 0, // 目前为止创建的总滚动弹幕数
                    },
                    'random': {
                        'total': 0, // 目前为止创建的总随机弹幕总数
                    },
                    'midscroll': {
                        'total': 0, // 目前为止创建的总中部滚动弹幕总数
                    }
                },
                'hanging': {
                    'total': 0, // 目前为止创建的总悬停弹幕数量
                    'top': {
                        'total': 0 // 目前为止创建的总顶部悬停弹幕数
                    },
                    'bottom': {
                        'total': 0 // 目前为止创建的总底部悬停弹幕数
                    },
                    'midhang': {
                        'total': 0 // 目前为止创建的总中部悬停弹幕数
                    }
                },
                'freeing': {
                    'total': 0, // 目前为止创建的总自由弹幕数量
                }
            },
            'current': { // 实时弹幕情况
                'total': 0, // 所有弹幕的总数
                'garbages': 0, // 所有弹幕垃圾的总数
                'global_state': 'running', // 全局弹幕状态（同danmaku.state）
                // 自由类弹幕
                'freeing': {
                    'total': 0, // 自由类弹幕数
                    'garbages': 0 // 自由类弹幕垃圾数
                },
                // 滚动类弹幕
                'scrolling': {
                    'total': 0, // 总滚动弹幕数
                    'reversed': 0, // 反向滚动弹幕数
                    'garbages': 0, // 滚动弹幕垃圾数
                    'scroll': {
                        'total': 0, // 滚动弹幕数
                        'reversed': 0, // 反向滚动弹幕数
                        'garbages': 0 // 反向滚动弹幕垃圾数
                    },
                    'random': {
                        'total': 0, // 随机弹幕总数
                        'reversed': 0, // 反向滚动随机弹幕数
                        'garbages': 0 // 反向滚动随机弹幕垃圾数
                    },
                    'midscroll': {
                        'total': 0, // 中部滚动弹幕总数
                        'reversed': 0, // 反向滚动中部滚动弹幕数
                        'garbages': 0 // 反向滚动中部滚动弹幕垃圾数
                    }
                },
                'hanging': {
                    'total': 0, // 总悬停弹幕数
                    'garbages': 0, // 悬停弹幕垃圾数
                    'top': {
                        'total': 0, // 顶部悬停弹幕数
                        'garbages': 0 // 顶部悬停弹幕垃圾数
                    },
                    'bottom': {
                        'total': 0, // 底部悬停弹幕数
                        'garbages': 0 // 底部悬停弹幕垃圾数
                    },
                    'midhang': {
                        'total': 0, // 中部悬停弹幕数
                        'garbages': 0 // 中部悬停弹幕垃圾数
                    }
                }
            }
        }
        ```

        </details>


### `List`对象

* 示例页面：[Summertime Rendering](https://ndanmaku.xbottle.top/summer-time.html)  

如果你想要将弹幕应用到**视频、音频**这些媒体上，用这个对象的方法准没错！

每个`NDanmaku`的对象中都自带一个`List`对象，包含着**弹幕-时刻列表**的相关操作：

```javascript
danmaku.list
```

`List`对象的方法详见[这个文档](docs/list.md)。

-----

## FAQ

### 弹幕容器`container`中可以有其他DOM元素吗？

是可以有的，在**创建对象**的时候虽然传入了`container`对应的元素对象，但实际上程序会在这个元素中**创建**一个`<div>`元素作为弹幕层，所有弹幕都是**在这个弹幕层**内被创建的，因此并不会影响`container`中的其他元素。

值得注意的是，`container`对应的元素的定位属性会变更为`relative`(相对定位)。

------

### 如果`container`元素中有其他定位为`absolute`的元素遮挡了弹幕，怎么办？

你可以在**创建对象**的时候传入`zIndex`参数，调整**弹幕层**在`container`元素内的层级，以避免这种情况。  

详见[构造方法的文档](docs/constructor.md#zindex)。  

------

### 每条弹幕对应的DOM元素都有独一无二的`id`属性吗?  

有的！只不过需要在构造对象的时候**指定一下`prefix`参数**，详见[构造方法的文档](docs/constructor.md#prefix)。

------

### 如何获得弹幕自身的唯一`id`?  

弹幕自身的唯一`id`（不是弹幕DOM元素的id属性）目前只能通过**对象构造方法**的`created`回调函数来获得。  

详见[弹幕创建的文档](docs/create.md#created)。

------

## 感谢

* [@板砖猫](https://github.com/BanZhuan-CAT) - 提出了“中间”弹幕的想法

## Copyright

Copyright &copy; 2022 [SomeBottle](https://bottle.moe), under Apache-2.0 License.