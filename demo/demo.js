'use strict';
let demoBody = document.querySelector('.markdown-body'),
    demo_1, demo_2;
fetch('./demo.md').then(resp => resp.text())
    .then(text => {
        demoBody.innerHTML = window.markdownit({
            html: true,
            linkify: true
        }).render(text);
        hljs.highlightAll();
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
                .create('Wow~我好大啊~');
            break;
    }
}