# 弹幕属性相关方法

## 设置属性

```javascript
danmaku.attrs(keyOrObject, value)
```

* `keyOrObject` - 属性键 或 包含属性键值对的对象

* `value` - 属性值（在第一个参数为**属性键**的情况下有效）  

------

弹幕属性及其值的说明请看[README](https://github.com/SomeBottle/N.js/#弹幕属性)哦~  

### 方法特点

在设置弹幕属性的时候，**没有指定的**弹幕属性会默认**继承之前的属性**。  

直观一点的话，可以看[这个示例](https://ndanmaku.xbottle.top/#属性的继承)。

### keyOrObject  

* [示例：传入字符串](https://ndanmaku.xbottle.top/#指定字体大小)  

* [示例：传入对象](https://ndanmaku.xbottle.top/#“一步”设置样式)  

这个参数取值可以是一串**字符串**，代表待设置的属性键；或者是一个包含**属性键值对**的对象。  

举个栗子吧~

当这个参数为**字符串**的时候：

```javascript
danmaku.attrs('size','2em')
```

当这个参数为**包含属性键值对**的对象的时候：

```javascript
danmaku.attrs({
    'outline': false, 
    'color': '#FE9A2E', 
    'size': '1.2em'
})
```

### value

* 默认值: `null` (无值)

* 示例见[keyOrObject](#keyorobject)的  

当`keyOrObject`为**字符串**的时候，这个参数是必需的。

## 重置所有弹幕属性

```javascript
danmaku.resetAttrs()
```

这个方法没有参数，会重置所有弹幕属性为默认值。  

* [Demo](https://ndanmaku.xbottle.top/#重置弹幕属性)  

默认值详见[README](https://github.com/SomeBottle/N.js/#弹幕属性)。