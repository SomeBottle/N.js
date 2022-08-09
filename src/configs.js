// 弹幕默认配置
export const danmakuDefaultAttrs = {
    'color': '#FFF', // 颜色(同css)
    'size': null, // 字体大小(同css的font-size，如果是null则自动计算)
    'scale': 1, // 文字放大尺寸(倍数，只有size为null时有效，比如0.5, 2)
    'opacity': 100, // 透明度（0-100%）
    'weight': 'normal', // 字体粗细，这一项同css的font-weight
    'vertical_space': 2, // 弹幕纵向间距(px)
    'outline': true, // 是否自动添加黑色描边
    'reverse': false, // 是否逆向滚动(仅支持scroll/midscroll这类滚动类型)
    'type': 'scroll', // 弹幕类型，scroll / top / bottom / midscroll / midhang
    'life': 5000, // 弹幕生命时长（毫秒）
    'custom_css': {} // 自定义css样式，这里可以覆盖上面size,opacity,weight,color这些样式
};