/* 注：这个不是油猴脚本，是可以直接在页面中通过<script>引入的
   快捷生成文章目录 
   使用方法
    在文章页面中引入该js文件
    Catalogue.init(文章所在容器元素Element[,['h2', 'h3', 'h4', 'a']])  <--第二个参数可选，默认是识别'h2', 'h3', 'h4', 'a'
    ↑ 生成目录

        - 其中a标签的识别有一定要求：
            1. a标签需要拥有'title'属性来存放这个锚点的标题
            2. a标签需要有'id'属性用作权重识别，比如：

                <a id="title1-title2" name="title2" for-anchor="true"></a>
                <a id="title1-title2-title3" name="title3" for-anchor="true"></a>  

               渲染出来形如：  
                    title1
                        title2
                            title3  

                id属性中"-"（连字符）的个数决定了标题的层级  

    Catalogue.show()  
    ↑ 展示目录  

    Catalogue.close()
    ↑ 关闭目录

- SomeBottle 2022.4.23
*/
'use strict';

const Catalogue = {
    anchors: [],
    jump: function (elem) {
        let cataId = elem.getAttribute("cata-id"),
            anchor = this.anchors[cataId];
        if (!anchor) {
            console.log('[Somebottle\'s Catalogue] Item not found.');
        } else {
            anchor[1].scrollIntoView({
                behavior: 'smooth'
            });
        }
    },
    reindent: function (anchors) {
        let hasGap = false, // 是否有间隙
            startIndent = false,
            lower = 0, // 低端，比如2和5权重，相隔5-2=3，低端是5
            minus = 0; // 要减去的数量, 像上面5-2=3的话，这里就是2，也就是后面每项都减去2，使得权重之间间隔最多只有1
        do {
            hasGap = false;
            for (let i = 1, len = anchors.length; i < len; i++) { // 处理锚点权重
                let current = anchors[i],
                    prev = anchors[i - 1];
                if (!startIndent && current[2] - prev[2] > 1) { // 权重相隔不紧凑
                    lower = current[2]; // 将当前权重设为低端
                    minus = current[2] - prev[2] - 1; // 后面每层要减去的数量
                    startIndent = true; // 开始缩进
                    hasGap = true;
                } else if (current[2] < lower) { // 有更高权重的标题出现，停止缩进
                    startIndent = false;
                }
                if (startIndent) current[2] -= minus; // 将当前权重减去要减去的数量
            }
        } while (hasGap); // 内层循环要经历多次，直到没有缩进
    },
    show: function () {
        let elem = document.getElementById('catalogueContainer');
        if (elem) {
            elem.style.display = 'block';
            setTimeout(function () {
                elem.style.transform = "unset";
            }, 10);
        } else {
            console.log('[Somebottle\'s Catalogue] Catalogue not exist.');
        }
    },
    close: function () {
        let elem = document.getElementById('catalogueContainer');
        if (elem) {
            elem.style.transform = "translateX(100%)";
            setTimeout(function () {
                elem.style.display = 'none';
            }, 500);
        } else {
            console.log('[Somebottle\'s Catalogue] Catalogue not exist.');
        }
    },
    init: function (target, types = ['h2', 'h3', 'h4', 'a']) {
        if (!(target instanceof Element)) {
            console.log('[Somebottle\'s Catalogue] Please specify the container element of the post.');
            return false;
        }
        let priorities = { // 数字越小标题权重越高
            'h2': 2,
            'h3': 3,
            'h4': 4,
            'h5': 5,
            'h6': 6,
            'a': 'auto' // 紧跟上一个权重后面，只有a标签有这个选项
        }, lastPriority = 1, // 上一个标题元素的权重，权重为'auto'的项不会更改此项
            anchors = [],
            maxPriority = false; // 找到权重值最大值
        types.sort((a, b) => { // 排序，以确保获取文章中标题的顺序是正确的
            if (!a[1]) {
                return 1;
            } else if (!b[1]) {
                return -1;
            } else {
                return a[1] - b[1];
            }
        });
        let elements = target.querySelectorAll(types.join(','));
        for (let j = 0, len = elements.length; j < len; j++) {
            let anchorElement = elements[j],
                type = anchorElement.tagName.toLowerCase(),
                priority = priorities[type], // 获得元素权重
                aTitle = anchorElement.getAttribute('title'), // a标签标题写在title属性里
                aId = anchorElement.getAttribute('id'),
                forAnchor = anchorElement.getAttribute('for-anchor'),
                hTitles = anchorElement.childNodes, // h1-h6标题元素标题，需要从子节点过滤出来
                hTitle = '';
            hTitles.forEach((node) => {
                if (node.nodeType === 3) { // 是文字节点
                    hTitle += node.nodeValue; // 加入标题内容
                }
            });
            if (!aTitle && hTitle.match(/^\s*$/)) { // 既没有title属性也没有innerText属性，这个元素不是锚点
                continue; // 跳过
            } else if (aTitle && aId && forAnchor) { // 如果有title，是a标签
                let subLevel = aId.split('-').length - 1, // 一个连字符往后推一级
                    level = lastPriority + subLevel + 1; // 小标题的权重
                if (priority !== 'auto') level = priority; // 如果不是auto就是另有设置了
                anchors.push([ // 推入锚点数组
                    aTitle,
                    anchorElement,
                    level
                ]);
                priority = level;
            } else if (!isNaN(priority)) { // 是大标题h1-h6
                lastPriority = priority; // 改变上一个权重
                anchors.push([
                    hTitle,
                    anchorElement,
                    priority
                ]);
            } else {
                priority = undefined;
            }
            if (!maxPriority || priority < maxPriority) maxPriority = priority;
        }
        /* 这一部分可能有点模糊，在上面处理后，得到的锚点权重可能是这样的：（示例）
            1
             2
                4
                 5
             2  
                  6
                  6
                   7
            这个时候标题缩进就并不紧凑了，经过下面处理变成这样：
            1
             2
              3
               4
             2
              3
              3
               4
            原理其实很简单：
            1   
             2
                4  <--在这里发现4-2>1，4- 1 =3是最紧凑的。设置minus=1,lower=4,后面每项都减去1
                 5 <-- 5-1=4   
             2  <-- 2<lower=4，停止减去  
                  6 <--- 6-2=4>1，又出现了大间隔，再次开始变紧凑,minus=3,lower=6
                  6 <--- 6-3=3 
                   7 <----7-3=4
            这个循环会经历多次
        */
        this.reindent(anchors);
        this.anchors = anchors; // 储存锚点
        let rendered = document.createElement('div'), // 创建一个容器,
            cataTarget = document.getElementById('catalogueContainer');
        rendered.className = 'content';
        for (let i = 0, len = anchors.length; i < len; i++) {
            let anchor = anchors[i],
                indent = 10 + (anchor[2] - maxPriority) * 20, // 根据权重计算缩进
                testSize = 1.3 - (anchor[2] - maxPriority) * 0.2, // 根据权重计算字体大小 
                fontSize = testSize > 0 ? testSize : 0.2,
                pElement = document.createElement('p'),
                aElement = document.createElement('a');
            pElement.style['margin-left'] = `${indent}px`;
            pElement.style['font-size'] = `${fontSize}em`;
            aElement.setAttribute('href', 'javascript:void(0);');
            aElement.setAttribute('cata-id', i);
            aElement.setAttribute('onclick', 'Catalogue.jump(this);');
            aElement.appendChild(document.createTextNode(anchor[0]));
            pElement.appendChild(aElement);
            rendered.appendChild(pElement);
        }
        if (!cataTarget) {
            let div = document.createElement('div'); // 创建一个div，用于渲染目录
            div.className = 'floatCatalogue';
            div.id = 'catalogueContainer';
            div.innerHTML = `<style>
        .floatCatalogue {
            position: fixed;
            transform: translateX(100%);
            display: none;
            overflow: auto;
            z-index: 5000;
            right: 0;
            top: 0;
            width: 40%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            transition: .5s ease;
        }
        
        .floatCatalogue::-webkit-scrollbar {
            display: none;
        }
        
        .floatCatalogue .head {
            position: relative;
            height: 3em;
        }
        
        .floatCatalogue span {
            position: fixed!important;
            display: block!important;
            color: #484848!important;
            font-size: 1.5em!important;
            font-weight: bolder!important;
            margin: .5em!important;
        }
        
        .floatCatalogue .content {
            margin: .5em;
        }
        
        .floatCatalogue .close {
            display: block;
            position: fixed!important;
            right: 0;
            top: 0;
            font-size: 2em!important;
            z-index: 5001;
            color: #3f3f3f!important;    
            cursor: pointer;
            margin: .2em .3em!important;
            background-color:transparent!important;
            border:none!important;
            transition: .5s ease;
        }
        
        .floatCatalogue .close:hover {
            color: #888888!important;
            text-decoration: underline!important;
        }
        
        .floatCatalogue p {
            margin: .6em 10px;
            word-break: keep-all;
        }
        
        .floatCatalogue p a {
            color: #6a6a6a!important;
            text-decoration: none!important;
            transition: .5s ease;
        }
        
        .floatCatalogue p a:hover {
            color: #484848!important;
            text-decoration: underline!important;
        }
        
        @media screen and (max-width: 820px) {
            .floatCatalogue {
                width: 100%;
            }
        }
        </style>
        <button class="close" onclick="Catalogue.close()">×</button>
        <div class="head">
            <span class="title">目录</span>
        </div>`;
            target.appendChild(div);
            div.appendChild(rendered);
        } else {
            // 看看有没有残留元素，有的话删除
            let previous = cataTarget.querySelector('.content');
            if (previous)
                cataTarget.removeChild(previous);
            cataTarget.appendChild(rendered);
        }
    }
};
