# 弹幕创建的方法

```javascript
// danmaku是NDanmaku的对象
danmaku.create(text, created = null, callback = null) 
```

* `text` - 弹幕文本

* `created` - 弹幕**创建后**的回调函数

* `callback` - 弹幕**正常消失后**的回调函数

## text

* [Demo](https://ndanmaku.xbottle.top/#创建一条弹幕)  

取值为一串**字符串**。  

代表待弹幕的文本内容。

## created

* 默认取值: `null` (默认无回调函数)  

* [Demo](https://ndanmaku.xbottle.top/#created)  

取值为一个**函数**。这个函数在**弹幕刚刚创建后**会被调用。

```javascript
created(danmakuElement, danmakuId)
```

- `danmakuElement` - 刚刚创建的弹幕对应的**DOM元素**  

- `danmakuId` - 刚刚创建的**弹幕**（在当前容器内）的**唯一ID**（并不是弹幕DOM元素的id哦！）

## callback

* 默认取值: `null` (默认无回调函数)

* [Demo](https://ndanmaku.xbottle.top/#callback)  

取值为一个**函数**。这个函数在**弹幕正常消失后**会被调用。  

也就是说，弹幕如果是调用方法（如`danmaku.clear()`）的情况下被清除的话，是**不会调用这个函数的**。

```javascript
callback(danmakuId)
```

- `danmakuId` - 刚刚消失的**弹幕**（在当前容器内）的**唯一ID**（并不是弹幕DOM元素的id哦！）
