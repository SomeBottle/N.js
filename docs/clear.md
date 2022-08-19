# 弹幕清除相关方法

## 目录

- [清除所有或者某一条弹幕的方法](#清除所有或者某一条弹幕的方法) `clear()`
    - [danmakuId](#danmakuid)
- [清除部分弹幕的方法](#清除部分弹幕的方法) `clearSome()`
    - [type](#type)
    - [reversed](#reversed)
    - [易错提示](#易错提示)  
- [清除指定样式弹幕的方法](#清除指定样式弹幕的方法) `clearStyled()` 
    - [styles](#styles)
    - [逻辑取反](#逻辑取反)  

## 清除所有或者某一条弹幕的方法

```javascript
danmaku.clear(danmakuId = null)
```

- `danmakuId` 弹幕（在当前容器内）的**唯一ID**（不是弹幕DOM元素的id哦！）

### danmakuId

* 默认值: `null` (不指定弹幕)

* [示例：清除所有弹幕](https://ndanmaku.xbottle.top/#清理所有弹幕)  

本参数取值是一个**整数**，是某一条弹幕的唯一id。

当指定了`danmakuId`时，程序会清除容器中**指定（ID对应）的弹幕**；

当不指定的时候，程序会清除容器中**所有弹幕**。

-------

## 清除部分弹幕的方法

强烈建议围观[Demo](https://ndanmaku.xbottle.top/#清理部分弹幕)，一目了然。  

```javascript
danmaku.clearSome(type = '', reversed = 'all')
```

* `type` - 弹幕类型

* `reversed` - （**仅针对滚动弹幕**）清除的是否是反向的弹幕

### type

* 默认值: `''` (不指定弹幕类型)  

当不指定`type`参数时，程序会清除容器中**所有弹幕**。

| 可选值 | 说明 |
|:---:|:---:|
|`'random'`, `'scroll'`, `'top'`, `'bottom'`, `'midscroll'`, `'midhang'` | `danmaku.attrs()`支持设置的弹幕类型 |
|`'all'` | 代表所有的弹幕 |
|`'scrolling'`| 代表所有滚动弹幕 (包括`random`, `scroll`, `midscroll`) |
|`'hanging'`| 代表所有悬停弹幕 (包括`top`, `bottom`, `midhang`) |

### reversed

* 默认值: `'all'` (无论正向还是反向滚动)  

本选项只有在`type`参数取值为`scroll`, `midscroll`, `random`, `scrolling`, `all`时有效（也就是**仅对滚动弹幕有效**）。

| 可选值 | 说明 |
|:---:|:---:|
| `true` | 在`type`对应的滚动弹幕中，清除**逆向滚动**的弹幕 |
| `false` | 在`type`对应的滚动弹幕中，清除**正向滚动**的弹幕 |
| `'all'` | 在`type`对应的滚动弹幕中，清除**所有滚动弹幕** |

### 易错提示

当`type`参数取值为`all`时，就算传入了`reversed`参数，**悬停弹幕也是会被全部清除的**：

```javascript
// 这样会清除 所有的逆向滚动弹幕 和 所有的悬停弹幕
danmaku.clearSome('all', true);
```

要想只清除逆向滚动弹幕而不清除悬停弹幕，可以这样写：

```javascript
danmaku.clearSome('scrolling', true);
```

------

## 清除指定样式弹幕的方法

> ⚠ 注意，该方法可能不太稳定。之所以不稳定，是因为每次清除时传入的样式要保证和目标弹幕的样式**完全一致**。  

Demo：[清除指定样式的弹幕](https://ndanmaku.xbottle.top/#清除带有指定样式的弹幕)

```javascript
danmaku.clearStyled(styles)
```

* `styles` - 包含`CSS`样式键值对的对象

### styles

* 无默认值，**必须传入**  

取值为一个**对象**，这个对象包含了一些`CSS`样式键值对。

举个栗子，清除所有颜色为蓝色的弹幕：  

```javascript
danmaku.clearStyled({
    'color': 'blue'
});
```

### 逻辑取反

实际上这里的`CSS`样式值还是支持逻辑取反操作的，只需要在值前面加上`!`即可。

比如，清除所有颜色**不为**白色的弹幕：

```javascript
danmaku.clearStyled({
    'color': '!white' // 默认情况下弹幕样式的color值为'white'
});
```