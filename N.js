var $N = {
    mcss: '@keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-webkit-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-moz-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-o-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}.N-tm{-webkit-text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;-moz-text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;text-shadow:#000 0.5px 0 0,#000 0 0.5px 0,#000 -0.5px 0 0,#000 0 -0.5px 0;}.N-n{position:absolute}.N-d{position:absolute;animation:Ndm 5s;animation-fill-mode:forwards;animation-timing-function:linear;-webkit-animation-fill-mode:forwards;-webkit-animation-timing-function:linear;-moz-animation-fill-mode:forwards;-moz-animation-timing-function:linear;-o-animation-fill-mode:forwards;-o-animation-timing-function:linear;}.N-danmaku{position:absolute;overflow:hidden;}',
    dnum: {},
    /*Scrolling-Num*/
    cons: {},
    /*Containers*/
    tnum: {},
    /*Top-Num*/
    bnum: {},
    /*Bottom-Num*/
    bold: {},
    /*font weight(100-900)*/
    num: 0,
    /*Main Num*/
    obnum: {},
    /*Barrage Num of different containers*/
    colour: {},
    /*Default Color*/
    opa: {},
    /*Default Opacity*/
    el: 'none',
    /*Controlling Element*/
    wt: {},
    /*Default Running Time*/
    ps: {},
    psall: false,
    hs: {},
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
    x: function(e) {
        var o = this;
        if (o.s(e)) {
            o.el = e;
            o.ps[e] = false;
            o.colour[e] = '#FFF';
            o.opa[e] = 1;
            o.wt[e] = 5;
            o.dnum[e] = 0;
            o.tnum[e] = 0;
            o.bnum[e] = 0;
            o.obnum[e] = 0;
            o.bold[e] = 'normal';
            o.md[e] = 'normal';
            var statu = 'running';
            if (!o.cons[e]) {
                var i = o.s(e);
                o.cons[e] = {};
                o.cons[e].height = i.offsetHeight;
                o.cons[e].width = i.offsetWidth;
            }
            if (!o.s('N-ob' + e)) {
                var i = o.s('N-dm');
                var p = document.createElement('style');
                p.id = 'N-ob' + e;
                p.innerHTML = '.N-ob' + e + '{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
                i.appendChild(p);
            }
            if (!o.s('N-danmaku' + e)) {
                var i = o.s(e);
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
    center: function(e) {
        /*Set to center*/
        var i = e;
        i.style.left = '50%';
        i.setAttribute('style', i.style.cssText + 'transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-webkit-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-moz-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-o-transform:translateX(-50%);');
    },
    pf: function(e, t, c) {
        /*Count for no-scrolling danmus*/
        var ot = this;
        setTimeout(function() {
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
            var o = setInterval(function() {
                pm(ot.s(e));
            },
            1000);
        },
        10);
    },
    s: function(e) {
        return document.getElementById(e);
    },
    i: function() {
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
    p: function(pt, val) {
        /*Set Properties*/
        var o = this;
        if (pt == 'color') {
            o.colour[o.el] = val;
        } else if (pt == 'opacity') {
            o.opa[o.el] = (Number(val) / 100).toFixed(2);
        } else if (pt == 'time') {
            o.wt[o.el] = val;
        } else if (pt == 'md') {
            if (['normal', 'top', 'bottom'].indexOf(val) !== -1) {
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
        }
    },
    c: function(txt) {
        /*Create*/
        var ot = this;
        var el = ot.el;
        var dm = ot.s('N-danmaku' + el);
        if (el !== 'none' && ot.s(el)) {
            var e = el;
            var ti = ot.wt[el];
            var i = ot.s(e);
            var d = document.createElement('div');
            var t = document.createTextNode(txt);
            d.appendChild(t);
            var lh = 5 * (i.clientWidth / 180);
            d.style.fontSize = lh + 'px';
            d.style.fontWeight = ot.bold[el];
            d.style.color = ot.colour[el];
            d.style.opacity = ot.opa[el];
            d.style.animationDuration = ti + 's';
            i.style.wordBreak = 'keep-all';
            i.style.whiteSpace = 'nowrap';
            d.setAttribute('style', d.style.cssText + '-webkit-animation-duration:' + ti + 's;');
            d.setAttribute('style', d.style.cssText + '-moz-animation-duration:' + ti + 's;');
            d.setAttribute('style', d.style.cssText + '-o-animation-duration:' + ti + 's;');
            d.id = 'N-d' + ot.num;
            i.style.position = 'relative';
            if (ot.md[el] == 'normal') {
                d.style.top = lh * ot.dnum[el] + 'px';
                d.className = 'N-tm N-d N-ob' + el;
                var et;
                for (et in ot.end) {
                    if (d.style[et] !== undefined) {
                        break;
                        /*Get the Right Event*/
                    }
                }
                d.addEventListener(ot.end[et],
                function() {
                    dm.removeChild(d);
                });
                /*Listen to CSS3*/
                if (ot.dnum[el] >= (i.clientHeight / lh * 0.8)) {
                    ot.dnum[el] = 0;
                } else {
                    ot.dnum[el] += 1;
                }
            } else if (ot.md[el] == 'top') {
                d.className = 'N-tm N-n N-ot' + el;
                d.style.top = lh * ot.tnum[el] + 'px';
                if (ot.tnum[el] >= (i.clientHeight / (lh * 2))) {
                    ot.tnum[el] = 0;
                } else {
                    ot.tnum[el] += 1;
                }
                ot.center(d);
                ot.pf(d.id, ti, el);
            } else if (ot.md[el] == 'bottom') {
                d.className = 'N-tm N-n N-bt' + el;
                d.style.bottom = lh * ot.bnum[el] + 'px';
                if (ot.bnum[el] >= (i.clientHeight / (lh * 2))) {
                    ot.bnum[el] = 0;
                } else {
                    ot.bnum[el] += 1;
                }
                ot.center(d);
                ot.pf(d.id, ti, el);
            }
            ot.num += 1;
            ot.obnum[el] += 1;
            dm.appendChild(d);
        } else {
            console.log('[N]Empty Element.');
        }
    },
    theworld: function(f) {
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
                p.innerHTML = '.N-ob' + ot.el + '{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
                i.appendChild(p);
            } else {
                ot.ps[ot.el] = false;
                i.removeChild(ot.s('N-' + ot.el + 'pause'));
            }
        }
    },
    cdm: function(e) {
        var ot = this;
        var k = document.getElementsByClassName(e);
        for (var d = 0; d < k.length; d++) {
            k[d].parentNode.removeChild(k[d]);
        }
        if (document.getElementsByClassName(e).length > 0) {
            return ot.cdm(e);
        }
    },
    clear: function(f) {
        var ot = this;
        var i = ot.s('N-dm');
        if (!f) {
            ot.cdm('N-ob' + ot.el);
            ot.cdm('N-ot' + ot.el);
            ot.cdm('N-bt' + ot.el);
        } else {
            ot.cdm('N-d');
            ot.cdm('N-tm');
        }

    }
};
$N.i();
/*N.js -SomeBottle*/