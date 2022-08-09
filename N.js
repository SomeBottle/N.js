var $N = {
    mcss: '@keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-webkit-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-moz-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-o-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}.N-tm{-webkit-text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;-moz-text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;}.N-n{position:absolute}.N-d{position:absolute;animation:Ndm 5s;animation-fill-mode:forwards;animation-timing-function:linear;-webkit-animation-fill-mode:forwards;-webkit-animation-timing-function:linear;-moz-animation-fill-mode:forwards;-moz-animation-timing-function:linear;-o-animation-fill-mode:forwards;-o-animation-timing-function:linear;}.N-danmaku{position:absolute;overflow:hidden;}',
    scrollNum: {},
    /*Scrolling-Num*/
    containers: {},
    /*Containers*/
    topNum: {},
    /*Top-Num*/
    bottomNum: {},
    /*Bottom-Num*/
    bold: {},
    /*font weight(100-900)*/
    num: 0,
    /*Main Num*/
    hitBox: {},
    /*碰撞检测*/
    obnum: {},
    /*Barrage Num of different containers*/
    colour: {},
    /*Default Color*/
    ftsize: {},
    /*Default FontSize*/
    opa: {},
    /*Default Opacity*/
    el: 'none',
    /*Controlling Element*/
    wt: {},
    /*Default Running Time*/
    ps: {},
    psall: false,
    hs: {},
    list: {},
    hsall: false,
    ini: false,
    timer: 'none',
    end: {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    },
    /*CSS3 Animation Ending Events For Different Browsers*/
    md: {},
    x: function (e) {
        var that = this;
        if (that.s(e)) {
            that.el = e;
            that.hitBox[e] = that.hitBox[e] || [];/*2021.5.20，在json读取模式下每次切换容器时这里所有配置值会归零，这样改解决了这个问题*/
            that.ps[e] = that.ps[e] || false;
            that.colour[e] = that.colour[e] || '#FFF';
            that.opa[e] = that.opa[e] || 1;
            that.wt[e] = that.wt[e] || 5;
            that.scrollNum[e] = that.scrollNum[e] || 0;
            that.topNum[e] = that.topNum[e] || 0;
            that.bottomNum[e] = that.bottomNum[e] || 0;
            that.obnum[e] = that.obnum[e] || 0;
            that.bold[e] = that.bold[e] || 'normal';
            that.md[e] = that.md[e] || 'normal';
            var statu = 'running';
            if (!that.containers[e]) {
                var i = that.s(e);
                that.containers[e] = {};
                that.containers[e].height = i.offsetHeight;
                that.containers[e].width = i.offsetWidth;
            }
            if (!that.s('N-scroll' + e)) {
                var i = that.s('N-dm');
                var p = document.createElement('style');
                p.id = 'N-scroll' + e;
                p.innerHTML = '.N-scroll' + e + '{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
                i.appendChild(p);
            }
            if (!that.s('N-danmaku' + e)) {
                var i = that.s(e);
                var p = document.createElement('div');
                p.id = 'N-danmaku' + e;
                p.style.width = '100%';
                p.style.height = '100%';
                p.style.top = '0px';
                p.className = 'N-danmaku';
                i.appendChild(p);
            }
        }
    },
    center: function (e) {
        /*Set to center*/
        var i = e;
        i.style.left = '50%';
        i.setAttribute('style', i.style.cssText + 'transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-webkit-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-moz-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-o-transform:translateX(-50%);');
    },
    pf: function (e, t, c) {
        /*Count for no-scrolling danmus*/
        var ot = this;
        setTimeout(function () {
            var it = t;
            function pm(e) {
                if (e !== null && e !== undefined) {
                    if (!ot.ps[c] && !ot.psall) {
                        it -= 1;
                    }
                    if (it <= 0) {
                        e.parentNode.removeChild(e);
                        clearInterval(o);
                    }
                } else {
                    clearInterval(o);
                    /*Delete Timer*/
                }
            }
            var o = setInterval(function () {
                pm(ot.s(e));
            },
                1000);
        },
            10);
    },
    s: function (e) {
        return document.getElementById(e);
    },
    i: function () {
        var ot = this;
        if (!ot.ini) {
            ot.ini = true;
            /*Initial Work*/
            var t = document.createElement('div');
            t.id = 'N-dm';
            var o = document.createElement('style');
            o.innerHTML = ot.mcss;
            /*Import Main Style*/
            t.appendChild(o);
            document.body.appendChild(t);
            /*ot.timer = setInterval(function() {
                for (var u in ot.cons) {
                    var es = ot.cons;
                    var nh = ot.s(u).offsetHeight;
                    var nw = ot.s(u).offsetWidth;
                    if (es[u].height !== nh || es[u].width !== nw) {
                        es[u].height = nh;
                        es[u].width = nw;
                        var a = document.getElementById('N-danmaku' + u);
                        a.style.height = nh;
                        a.style.width = nw;
                    }
                }
            },
            2000);*/
            console.log('[N]Initialized.');
        }
    },
    p: function (pt, val) {
        /*Set Properties*/
        var o = this;
        if (pt == 'color') {
            o.colour[o.el] = val;
        } else if (pt == 'opacity') {
            o.opa[o.el] = (Number(val) / 100).toFixed(2);
        } else if (pt == 'time') {
            o.wt[o.el] = val;
        } else if (pt == 'md') {
            if (['normal', 'top', 'bottom', 'random'].indexOf(val) !== -1) {
                o.md[o.el] = val;
            }
        } else if (pt == 'bold') {
            if (val == 'normal') {
                val = 400;
            }
            val = Number(val);
            if (val >= 100 && val <= 900) {
                o.bold[o.el] = val;
            }
        } else if (pt == 'size') {
            if (val == 'normal') {
                val = 1;
            }
            val = Number(val);
            if (val >= 0.5 && val <= 2) {
                o.ftsize[o.el] = val;
            }
        }
    },
    c: function (txt) {
        /*Create*/
        var that = this;
        var element = that.el;
        var dm = that.s('N-danmaku' + element);
        if (element !== 'none' && that.s(element)) {
            var element = element;
            var life = that.wt[element];
            var container = that.s(element);
            var newDiv = document.createElement('div');
            var newText = document.createTextNode(txt);
            newDiv.appendChild(newText);
            var lh = 5 * (container.clientWidth / 180);
            if (that.ftsize[element] !== undefined && that.ftsize[element] !== 1) {
                lh = lh * parseFloat(that.ftsize[element]);
            }
            newDiv.style.fontSize = lh + 'px';
            newDiv.style.fontWeight = that.bold[element];
            newDiv.style.color = that.colour[element];
            newDiv.style.opacity = that.opa[element];
            newDiv.style.animationDuration = life + 's';
            container.style.wordBreak = 'keep-all';
            container.style.whiteSpace = 'nowrap';
            newDiv.setAttribute('style', newDiv.style.cssText + '-webkit-animation-duration:' + life + 's;');
            newDiv.setAttribute('style', newDiv.style.cssText + '-moz-animation-duration:' + life + 's;');
            newDiv.setAttribute('style', newDiv.style.cssText + '-o-animation-duration:' + life + 's;');
            newDiv.id = 'N-d' + that.num;
            container.style.position = 'relative';
            if (that.md[element] == 'normal' || that.md[element] == 'random') {
                var tophit = Math.floor(container.clientHeight / lh * 0.8);
                /*碰撞头*/
                var maxline = tophit + 1;
                newDiv.style.top = lh * that.scrollNum[element] + 'px';
                function rdu(obj) {
                    var r = Math.floor(Math.random() * maxline) + 1;
                    if (obj.hitbox[obj.el].indexOf(r) !== -1) {
                        return rdu(obj);
                    } else {
                        obj.hitbox[obj.el][(obj.hitbox[obj.el].length + 1)] = r;
                        return r;
                    }
                }
                if (that.md[element] == 'random') {
                    /*Random Lines防止碰撞*/
                    if (that.hitBox[element].length > maxline) {
                        that.hitBox[element] = [];
                    }
                    var line = rdu(that);
                    newDiv.style.top = lh * line + 'px';
                }
                newDiv.className = 'N-tm N-d N-scroll' + element;
                var et;
                for (et in that.end) {
                    if (newDiv.style[et] !== undefined) {
                        break;
                        /*Get the Right Event*/
                    }
                }
                newDiv.addEventListener(that.end[et],
                    function () {
                        dm.removeChild(newDiv);
                    });
                that.scrollNum[element] += 1;
                /*Listen to CSS3*/
                if (that.scrollNum[element] >= tophit) {
                    that.scrollNum[element] = 0;
                }
            } else if (that.md[element] == 'top') {
                newDiv.className = 'N-tm N-n N-ot' + element;
                newDiv.style.top = lh * that.topNum[element] + 'px';
                if (that.topNum[element] >= (container.clientHeight / (lh * 2))) {
                    that.topNum[element] = 0;
                } else {
                    that.topNum[element] += 1;
                }
                that.center(newDiv);
                that.pf(newDiv.id, life, element);
            } else if (that.md[element] == 'bottom') {
                newDiv.className = 'N-tm N-n N-bt' + element;
                newDiv.style.bottom = lh * that.bottomNum[element] + 'px';
                if (that.bottomNum[element] >= (container.clientHeight / (lh * 2))) {
                    that.bottomNum[element] = 0;
                } else {
                    that.bottomNum[element] += 1;
                }
                that.center(newDiv);
                that.pf(newDiv.id, life, element);
            }
            that.num += 1;
            that.obnum[element] += 1;
            dm.appendChild(newDiv);
        } else {
            console.log('[N]Empty Element.');
        }
    },
    theworld: function (f) {
        var ot = this;
        var i = ot.s('N-dm');
        var statu = 'paused';
        if (f) {
            if (!ot.psall && !ot.s('N-pause')) {
                ot.psall = true;
                var p = document.createElement('style');
                p.id = 'N-pause';
                p.innerHTML = '.N-d{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
                i.appendChild(p);
            } else {
                ot.psall = false;
                i.removeChild(ot.s('N-pause'));
            }
        } else {
            if (!ot.ps[ot.el] && !ot.s('N-' + ot.el + 'pause')) {
                ot.ps[ot.el] = true;
                var p = document.createElement('style');
                p.id = 'N-' + ot.el + 'pause';
                p.innerHTML = '.N-scroll' + ot.el + '{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
                i.appendChild(p);
            } else {
                ot.ps[ot.el] = false;
                i.removeChild(ot.s('N-' + ot.el + 'pause'));
            }
        }
    },
    cdm: function (e) {
        var ot = this;
        var k = document.getElementsByClassName(e);
        for (var d = 0; d < k.length; d++) {
            k[d].parentNode.removeChild(k[d]);
        }
        if (document.getElementsByClassName(e).length > 0) {
            return ot.cdm(e);
        }
    },
    clear: function (f) {
        var ot = this;
        var i = ot.s('N-dm');
        if (!f) {
            ot.cdm('N-scroll' + ot.el);
            ot.cdm('N-ot' + ot.el);
            ot.cdm('N-bt' + ot.el);
        } else {
            ot.cdm('N-d');
            ot.cdm('N-tm');
        }

    },
    createlist: function (l) {
        /*List id*/
        var o = this;
        if (o.list[l] == undefined || o.list[l] == null) {
            o.list[l] = {};
            o.list[l]['d'] = {};
            o.list[l]['id'] = 0;
            console.log('[N]Created List:' + l);
        }
    },
    dellist: function (l) {
        var o = this;
        if (o.list[l] !== undefined || o.list[l] !== null) {
            delete o.list[l];
            console.log('[N]Deleted List:' + l);
        } else {
            console.log('[N]Failed to delete List:' + l);
        }
    },
    json: function (j, l) {
        /*通过json填装弹幕列表(json,listid)*/
        var o = this;
        var jt = JSON.parse(j);
        var xpu = jt.x;
        var clu = jt.color;
        var opu = jt.opacity;
        var tmu = jt.time;
        var mdu = jt.md;
        var bdu = jt.bold;
        var szu = jt.size;
        /*初始化设置*/
        var dmlist = jt.danmaku;
        for (var i in dmlist) {
            var p = dmlist[i];
            if (p.x !== undefined) {
                xpu = p.x;
            }
            if (p.color !== undefined) {
                clu = p.color;
            }
            if (p.opacity !== undefined) {
                opu = p.opacity;
            }
            if (p.time !== undefined) {
                tmu = p.time;
            }
            if (p.md !== undefined) {
                mdu = p.md;
            }
            if (p.bold !== undefined) {
                bdu = p.bold;
            }
            if (p.size !== undefined) {
                szu = p.size;
            }
            o.adtl({
                x: xpu,
                color: clu,
                opacity: opu,
                time: tmu,
                md: mdu,
                bold: bdu,
                size: szu,
                text: p.text
            },
                p.ts, l);
        }
    },
    adtl: function (d, t, l) {
        /*Add Danmaku To List (danmu,time,listid)返回添加的弹幕id*/
        var o = this;
        if (o.list[l] !== undefined || o.list[l] !== null) {
            if (o.list[l][t] == undefined || o.list[l][t] == null) {
                o.list[l][t] = {};
            }
            var lt = Object.keys(o.list[l][t]).length;
            var rt = o.list[l]['id'];
            o.list[l]['d'][rt] = {
                /*索引*/
                tm: t,
                dm: lt
            };
            o.list[l][t][lt] = {
                ct: d['x'],
                /*Container*/
                cl: d['color'],
                /*Color*/
                op: d['opacity'],
                /*Opacity*/
                tm: d['time'],
                /*Running time*/
                md: d['md'],
                /*Danmaku mode*/
                bd: d['bold'],
                sz: d['size'],
                tx: d['text']
            };
            o.list[l]['id'] = parseInt(o.list[l]['id']) + 1;
            return rt;
        } else {
            console.log('[N]Failed to add danmaku to List:not exists');
        }
    },
    rdfl: function (d, l) {
        /*Remove Danmaku From List(danmuid,listid)*/
        var o = this;
        if (o.list[l] !== undefined || o.list[l] !== null) {
            var t = o.list[l]['d'][d].tm;
            var di = o.list[l]['d'][d].dm;
            if (o.list[l][t][di] !== undefined) {
                delete o.list[l][t][di];
            }
        } else {
            console.log('[N]Failed to delete:not exists');
        }
    },
    lc: function (t, l) {
        /*Create from list(time,listid)*/
        var o = this;
        if (o.list[l] !== undefined || o.list[l] !== null) {
            if (o.list[l][t] !== undefined) {
                var ls = o.list[l][t];
                for (var i in ls) {
                    if (o.el !== ls[i].ct) {
                        o.x(ls[i].ct);
                    }
                    o.p('color', ls[i].cl);
                    o.p('opacity', ls[i].op);
                    o.p('time', ls[i].tm);
                    o.p('md', ls[i].md);
                    o.p('bold', ls[i].bd);
                    o.p('size', ls[i].sz);
                    o.c(ls[i].tx);
                }
            }
        }
    }
};
$N.i();
/*N.js -SomeBottle*/
