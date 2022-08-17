# 弹幕创建的方法

```javascript
// danmaku是NDanmaku的对象
danmaku.create(text, created = null, callback = null) 
```

* `text` - 弹幕文本

* `created` - 弹幕**创建后**的回调函数

* `callback` - 弹幕**正常消失后**的回调函数

## text

取值为一串**字符串**。  

代表待弹幕的文本内容。

## created

* 默认取值: `null` (默认无回调函数)

