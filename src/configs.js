// 弹幕默认配置
export const danmakuDefaultAttrs = {
    'color': '#FFF', // 颜色(同css)
    'size': null, // 字体大小(同css的font-size，如果是null则自动计算)
    'scale': 1, // 文字放大尺寸(倍数，只有size为null时有效，比如0.5, 2)
    'opacity': 100, // 透明度（0-100%）
    'weight': 'normal', // 字体粗细，这一项同css的font-weight
    'bottom_space': 2, // 弹幕底部的间距(px)，对random弹幕不起效
    'outline': true, // 是否自动添加黑色描边
    'reverse': false, // 是否逆向滚动(仅支持random/scroll/midscroll这类滚动类型)
    'type': 'scroll', // 弹幕类型，random / scroll / top / bottom / midscroll / midhang
    'life': 5000, // 弹幕生命时长（毫秒）
    'custom_css': {} // 自定义css样式，这里可以覆盖上面size,weight,color这些样式
};

// 弹幕在容器中至少生成在距起点多高的位置（百分比）（和碰撞集/attrs[type]相对应）
export const danmakuMinHeight = {
    'top': 0,
    'bottom': 0,
    'scroll': 0,
    'random': 0
}

// 弹幕在容器中至多生成在距起点多高的位置（百分比）（和碰撞集/attrs[type]相对应）
export const danmakuMaxHeight = {
    'top': 70,
    'bottom': 70,
    'scroll': 100,
    'random': 100
}