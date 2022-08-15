'use strict';
let demoBody = document.querySelector('.markdown-body'),
    demo_1, demo_2;
fetch('./demo.md').then(resp => resp.text())
    .then(text => {
        demoBody.innerHTML = window.markdownit({
            html: true,
            linkify: true
        }).use(window.markdownItAnchor, {
            permalink: window.markdownItAnchor.permalink.linkInsideHeader({
                symbol: '#',
                placement: 'after'
            })
        }).render(text);
        hljs.highlightAll();
        Catalogue.init(demoBody);
        let anchor = location.hash.slice(1); // 检查有没有锚点
        if (anchor) {
            // 如果有锚点，滚动到锚点
            setTimeout(() => {
                document.getElementById(anchor).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 500); // 可能页面有些内容需要加载，延迟一下
        }
        // 给所有标题附上class
        document.querySelectorAll('.markdown-body h2, .markdown-body h3, .markdown-body h4').forEach(e => {
            e.classList.add('title');
        });
        // 将所有站外链接标记为新窗口打开
        document.querySelectorAll('.markdown-body a').forEach(e => {
            if (e.href.indexOf(location.host) === -1 && e.href.indexOf('javascript:') === -1) {
                e.target = '_blank';
            }
        });
        return Promise.resolve('done');
    }).then(res => {
        demo_1 = new NDanmaku('demo-1');
        demo_2 = new NDanmaku('demo-2');
    });

function trigger_demo_1() {
    demo_1.create('普通的disco我们普通的摇~🎶');
}

function trigger_demo_2(step) {
    switch (step) {
        case 1:
            demo_2.resetAttrs()
                .attrs('size', '2em')
                .create('Woah~我超大的啦~');
            break;
        case 2:
            demo_2.resetAttrs()
                .attrs('size', '2em')
                .create('Woah~我超大的啦~')
                .attrs('weight', 'bold')
                .attrs('color', 'blue')
                .create('大~粗~蓝~的~弹~幕~');
            break;
        case 3:
            demo_2.resetAttrs()
                .attrs('opacity', 20)
                .attrs('color', '#2EFE2E')
                .create('原谅我这么绿~');
            break;
        case 4:
            demo_2.resetAttrs()
                .attrs({
                    outline: false,
                    color: '#FE9A2E',
                    size: null,
                    scale: 1.5,
                    weight: 'lighter',
                    opacity: 80
                }).create('蜜柑色~🍊');
            break;
        case 5:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.5em',
                    custom_css: {
                        border: '1px solid #2ECCFA'
                    }
                }).create('2333333333');
            break;
        case 6:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'random'
                }).create('随机弹幕~');
            break;
        case 7:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'top'
                }).create('顶部悬停弹幕');
            break;
        case 8:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'bottom'
                }).create('底部悬停弹幕');
            break;
        case 9:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'midhang'
                }).create('中部悬停弹幕');
            break;
        case 10:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'midscroll'
                }).create('中部滚动弹幕');
            break;
        case 11:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'scroll',
                    reverse: true
                }).create('逆向滚动弹幕');
            break;
        case 12:
            demo_2.resetAttrs()
                .attrs({
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
            break;
    }
    document.getElementById('demo-2').scrollIntoView({
        behavior: 'smooth'
    });
}