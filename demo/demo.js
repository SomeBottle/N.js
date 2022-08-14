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
            demo_2.resetStyles()
                .attrs('size', '2em')
                .create('Woah~我超大的啦~');
            break;
        case 2:
            demo_2.resetStyles()
                .attrs('size', '2em')
                .attrs('weight', 'bold')
                .attrs('color', 'blue')
                .create('大~粗~蓝~的~弹~幕~');
            break;
    }
    document.getElementById('demo-2').scrollIntoView({
        behavior: 'smooth'
    });
}