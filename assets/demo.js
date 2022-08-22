'use strict';
let demoBody = document.querySelector('.markdown-body'),
    demo_1, demo_2, demo_2_video, demo_3, demo_4, demo_5, demo_6, demo_7,
    demo4Timer, demo6Timer,
    previousScrollTop = 0, jumpToScrollTop = 0;
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
        let anchor = location.hash.slice(1), // 检查有没有锚点
            anchorTarget;
        if (anchor && (anchorTarget = document.getElementById(anchor))) {
            // 如果有锚点，滚动到锚点
            setTimeout(() => {
                anchorTarget.scrollIntoView({
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
        demo_2 = new NDanmaku('demo-2', 'demo');
        demo_2_video = new NDanmaku('demo-2-video');
        demo_3 = new NDanmaku('demo-3');
        demo_4 = new NDanmaku('demo-4');
        demo_5 = new NDanmaku('demo-5');
        demo_6 = new NDanmaku('demo-6');
        demo_7 = new NDanmaku('demo-7');
        demo_4_timer();
        demo6Timer = setInterval(() => {
            demo_6.resetAttrs()
                .attrs({
                    'size': '1.2em',
                    'life': 4000
                })
                .create('普通滚动弹幕')
                .attrs({
                    'reverse': true,
                    'life': 6000,
                    'color': 'blue'
                })
                .create('逆向滚动弹幕')
                .attrs({
                    'reverse': true,
                    'type': 'random',
                    'color': 'red'
                })
                .create('逆向滚动的随机弹幕')
                .attrs({
                    'type': 'midscroll',
                    'color': 'white'
                })
                .create('逆向的中部滚动弹幕')
                .attrs('reverse', false)
                .attrs('type', 'random')
                .create('滚动的随机弹幕')
                .attrs('type', 'midscroll')
                .create('中部滚动弹幕')
                .attrs('type', 'top')
                .create('顶部悬停弹幕')
                .attrs('color', 'green')
                .create('顶部悬停绿色弹幕')
                .attrs({
                    'type': 'bottom',
                    'color': 'orange'
                })
                .create('底部悬停弹幕')
        }, 5000);
        demo_7.list.new('test'); // 新建名为'test'的列表
        demo_7.list.use('test'); // 切换到'test'列表
        demo_7.list.addDm({
            text: '这是一条逆向滚动弹幕',
            reset_styles: true,
            styles: {
                life: 5000,
                reverse: true
            }
        }, 524); // 在524毫秒时刻添加一条弹幕
        demo_7.list.addDm({
            text: '这是一条蓝色弹幕',
            styles: {
                life: 7000,
                color: 'blue',
                reverse: false,
                bottom_space: 2,
                type: 'scroll'
            }
        }, 1024); // 在1024毫秒时刻添加一条弹幕
        demo_7.list.addDm({
            text: '这是一条无描边，底部悬停的绿色弹幕',
            styles: {
                color: 'green',
                life: 4000,
                outline: false,
                type: 'bottom',
                'bottom_space': 30
            }
        }, 2000); // 在2000毫秒时刻添加一条弹幕
        demo_7.list.uncertainty(0);
    });

// 隐藏返回按钮
function goBackBtnHide() {
    let goBackBtn = document.querySelector('.go-back');
    goBackBtn.style.opacity = 0;
    previousScrollTop = 0;
    jumpToScrollTop = 0;
    setTimeout(() => {
        goBackBtn.style.display = 'none';
    }, 500);
}

// 滚动监听
function scrollListener() {
    // 如果滚动了一段距离，就取消监听，隐藏返回按钮
    if (Math.abs(window.scrollY - jumpToScrollTop) > 500) {
        goBackBtnHide();
        window.removeEventListener('scroll', scrollListener);
    }
}

// 回到刚刚浏览的位置
function goBack() {
    window.scrollTo(0, previousScrollTop);
    goBackBtnHide();
}

// 滚动到demo
function scroll2demo(element) {
    let targetTop = element.offsetTop - element.offsetHeight / 2,
        goBackBtn = document.querySelector('.go-back');
    previousScrollTop = window.scrollY; // 记录之前浏览的位置
    jumpToScrollTop = targetTop; // 记录目标跳转位置
    scrollTo(0, targetTop);
    goBackBtn.style.display = 'inline-block';
    setTimeout(() => {
        goBackBtn.style.opacity = 1;
    }, 200);
    window.removeEventListener('scroll', scrollListener);
    window.addEventListener('scroll', scrollListener);
}

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
        case 13:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'scroll',
                    life: 4000,
                    bottom_space: 12
                });
            for (let i = 0; i < 4; i++) demo_2.create('间距12px');
            break;
        case 14:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'top',
                    life: 4000,
                    bottom_space: 4
                });
            for (let i = 0; i < 4; i++) demo_2.create('间距4px');
            break;
        case 15:
            demo_2.resetAttrs()
                .attrs({
                    size: '1.2em',
                    type: 'top',
                    color: '#0080FF',
                    carry_sheet: `
                        #[selfId]{
                            border: 1px solid #FE2E2E
                        }
                    `
                }).create('SA→KA→NA↗');
            break;
        case 16:
            demo_2.resetAttrs()
                .attrs({
                    'type': 'free',
                    'size': '1.5em',
                    'custom_css': {
                        animation: '2s ease infinite myRotate',
                        left: '50%',
                        top: '50%'
                    },
                    'carry_sheet': `
                    @keyframes myRotate{
                        0% {
                            transform: rotate3d(0, 1, 1, 0deg);
                        }
                        
                        50% {
                            transform: rotate3d(0, 1, 1, 360deg);
                        }
                        
                        100% {
                            transform: rotate3d(0, 1, 1, 0deg);
                        }
                    }
                    #[selfId]{
                        color: #FA58AC!important;
                    }
                ` // 要用!important是因为弹幕属性里包括了color，而其优先级比较高
                }).create('转啊转啊转啊');
            break;
        case 17:
            demo_2.resetAttrs()
                .attrs({
                    'type': 'free',
                    'size': '2em',
                    'opacity': 70,
                    'custom_css': {
                        animation: '1s ease forwards slideIn'
                    },
                    'carry_sheet': `
                        @keyframes slideIn{
                            0% {
                                top: 50%;
                                left: 100%;
                                transform: translate(100%, -50%) scale(0.5);
                            }
                            
                            100% {
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%) scale(1);
                            }
                        }
                        @keyframes slideOut{
                            0% {
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%) scale(1);
                            }
    
                            100% {
                                top: -50%;
                                left: 0;
                                transform: translate(-50%, -100%) scale(3);
                            }
                        }
                        #[selfId]{
                            color: red!important;
                        }
                    `
                });
            setTimeout(() => {
                demo_2.create('点我点我', (element, id) => {
                    demo_2.pause(id);
                    element.onclick = () => {
                        element.onclick = null;
                        element.style.animation = '1.5s ease forwards slideOut';
                        element.onanimationend = (e) => {
                            demo_2.clear(id);
                        }
                    }
                });
            }, 500);
            break;
    }
    scroll2demo(document.getElementById('demo-2'));
}

function trigger_demo_2_vid(step) {
    switch (step) {
        case 1:
            demo_2_video.resetAttrs()
                .attrs('size', '1.3em')
                .create('本处原画：William Lee', (element, id) => {
                    element.onclick = () => {
                        alert(`你点击了ID为${id}的弹幕`);
                    }
                });
            break;
        case 2:
            demo_2_video.resetAttrs()
                .attrs({
                    'size': '1.3em',
                    'pointer_events': false
                })
                .create('你点不到我！', (element, id) => {
                    element.onclick = () => {
                        alert(`你点击了ID为${id}的弹幕`);
                    }
                });
            break;
    }
}

function trigger_demo_3(step) {
    switch (step) {
        case 1:
            demo_3.resetAttrs().ranges('scroll', [0, 50]);
            for (let i = 0; i < 6; i++) demo_3.create('测试弹幕');
            break;
        case 2:
            demo_3.resetAttrs().ranges('bottom', [20, 70]).attrs('type', 'bottom');
            for (let i = 0; i < 6; i++) demo_3.create('测试弹幕');
            break;
    }
    scroll2demo(document.getElementById('demo-3'));
}

function demo_4_timer() {
    clearInterval(demo4Timer);
    demo4Timer = setInterval(() => {
        demo_4.create('测试弹幕');
    }, 1000);
}

function trigger_demo_4(step) {
    switch (step) {
        case 1:
            demo_4.pause();
            // 暂停的时候就不要再生成更多弹幕了
            clearInterval(demo4Timer);
            break;
        case 2:
            demo_4.resume();
            demo_4_timer();
            break;
    }
}


function trigger_demo_5(step) {
    switch (step) {
        case 1:
            demo_5.resetAttrs().attrs('size', '1.2em')
                .create('鼠标移动到我身上', (element, id) => {
                    element.onmouseover = () => {
                        demo_5.pause(id);
                    };
                    element.onmouseout = () => {
                        demo_5.resume(id);
                    }
                });
            break;
        case 2:
            demo_5.resetAttrs().attrs('size', '1.2em')
                .create('我消失后会弹窗哦', null, (id) => {
                    alert(`ID为${id}的弹幕刚刚消失了！`)
                });
            break;
    }
    scroll2demo(document.getElementById('demo-5'));
}

function trigger_demo_6(step) {
    setTimeout(() => {
        switch (step) {
            case 1:
                demo_6.clear();
                break;
            case 2:
                demo_6.clearSome();
                break;
            case 3:
                demo_6.clearSome('all', true);
                break;
            case 4:
                demo_6.clearSome('scrolling', true);
                break;
            case 5:
                demo_6.clearSome('hanging');
                break;
            case 6:
                demo_6.clearSome('midscroll', true);
                break;
            case 7:
                demo_6.clearSome('random');
                break;
            case 8:
                demo_6.clearStyled({
                    'color': 'blue',
                    'font-size': '1.2em'
                });
                break;
            case 9:
                demo_6.clearStyled({
                    'color': '!white'
                });
                break;
        }
    }, 500);
    scroll2demo(document.getElementById('demo-6'));
}

function trigger_demo_7(step) {
    switch (step) {
        case 1:
            demo_7.list.uncertainty(0);
            demo_7.list.tick(1024);
            break;
        case 2:
            demo_7.list.uncertainty(500);
            demo_7.list.tick(1024);
            break;
    }
    scroll2demo(document.getElementById('demo-7'));
}