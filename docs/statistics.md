# 统计信息相关方法

## 目录

- [重置统计信息的方法](#重置统计信息的方法) `resetStatistics()`
    - [type](#type)
    - [示例](#示例)

## 重置统计信息的方法

```javascript
danmaku.resetStatistics(type);
```

`type` - 重置的**统计信息类型**

### type

* 默认值: `''` 

取值为**一串字符串**，必须传入，不然方法**不会有任何操作**。  

目前的可选值：

| 可选值 | 描述 |
|:---:|:---:|
| `created` | 重置已创建弹幕数量的统计信息 |

### 示例

重置已创建弹幕的统计信息：

```javascript
danmaku.resetStatistics('created');
```