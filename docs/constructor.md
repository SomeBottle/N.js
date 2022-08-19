# NDanmaku构造方法

```javascript
new NDanmaku(container, prefix = '', zIndex = 'auto')
```

- `container` - 弹幕容器元素，可以是一个**字符串**(元素的`id`)，也可以是一个**DOM元素对象**。

- `prefix` - 容器弹幕的前缀，默认为空。

- `zIndex` - 上述容器将被设置的`z-index`值，默认为`auto`。

## container

取值为**DOM元素对象**或者**DOM元素的id**。

弹幕将会在这个元素内进行创建，因此咱们也称其为“弹幕的**容器**”。

此参数已经在[README](https://github.com/SomeBottle/N.js/#readme)中说明过了，这里不再赘述。

## prefix

- 默认值: `''`

取值为**可以用作DOM元素的`id`的**字符串。

当`prefix`取值不为空时，程序将会给**每一条弹幕的DOM元素**设置一个**唯一的`id`**，这个`id`的格式如下：

```
N-danmaku-{prefix}-{弹幕的唯一id}
```

举个栗子：

* 创建对象时没有设置`prefix`

    ```javascript
    const demo_1 = new NDanmaku('demo-1');
    ```

    ![20220817211158-2022-08-17](https://images.weserv.nl/?url=https://raw.githubusercontent.com/cat-note/bottleassets/main/img/20220817211158-2022-08-17.png)  

    可以看到弹幕元素并没有`id`属性。

    ------

* 创建对象时设置`prefix`为`test`

    ```javascript
    const demo_1 = new NDanmaku('demo-1', 'test');
    ```

    ![20220817211440-2022-08-17](https://images.weserv.nl/?url=https://raw.githubusercontent.com/cat-note/bottleassets/main/img/20220817211440-2022-08-17.png)  

    可以看到此时弹幕元素`id`为`N-danmaku-test-0`。

## zIndex

- 默认值: `'auto'`

这个参数的**取值**和[CSS中的`z-index`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)属性是一致的。  

在对象创建后，程序会在`container`元素中创建一个`div`元素，作为该容器的**弹幕层**。紧接着，程序会将该**弹幕层**的样式的`z-index`属性为本参数的值。  

当弹幕层元素受**容器中**其他层元素遮挡时，这个参数非常有用。