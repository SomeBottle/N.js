var $N = {
    mcss: '@keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-webkit-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-moz-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}@-o-keyframes Ndm{from{left:120%}to{left:0;transform:translateX(-100%)}}.N-n{position:absolute}.N-d{position:absolute;animation:Ndm 5s;animation-fill-mode:forwards;animation-timing-function:linear;animation-play-state:running;}',
    dnum: 0,
    /*Scrolling-Num*/
    tnum: 0,
    /*Top-Num*/
    bnum: 0,
    /*Bottom-Num*/
    num: 0,
    /*Main Num*/
    colour: '#FFF',
    /*Default Color*/
    opa: 1,
    /*Default Opacity*/
    wt: 5,
    /*Default Running Time*/
    ps: false,
    end: {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    },
	/*CSS3 Animation Ending Events For Different Browsers*/
    md: 'normal',
    center: function(e) {
        /*Set to center*/
        var i = e;
        i.style.left = '50%';
        i.setAttribute('style', i.style.cssText + 'transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-webkit-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-moz-transform:translateX(-50%);');
        i.setAttribute('style', i.style.cssText + '-o-transform:translateX(-50%);');
    },
    pf: function(e, t) {
        /*Count for no-scrolling danmus*/
        var ot = this;
        setTimeout(function() {
            var it = t;
            function pm(e) {
                if (e !== null && e !== undefined) {
                    if (!ot.ps) {
                        it -= 1;
                    }
                    if (it <= 0) {
                        e.parentNode.removeChild(e);
                        clearInterval(o);
                    }
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
        /*Initial Work*/
        var t = document.createElement('div');
        t.id = 'N-dm';
        var o = document.createElement('style');
        o.innerHTML = this.mcss;
        /*Import Main Style*/
        t.appendChild(o);
        document.body.appendChild(t);
        console.log('[N]Initialized.');
    },
    p: function(pt, val) {
        /*Set Properties*/
        var o = this;
        if (pt == 'color') {
            o.colour = val;
        } else if (pt == 'opacity') {
            o.opa = (Number(val) / 100).toFixed(2);
        } else if (pt == 'time') {
            o.wt = val;
        } else if (pt == 'md') {
            if (['normal', 'top', 'bottom'].indexOf(val) !== -1) {
                o.md = val;
            }
        }
    },
    c: function(e, txt) {
        /*Create*/
        var ot = this;
        var ti = ot.wt;
        var i = ot.s(e);
        var d = document.createElement('div');
        var t = document.createTextNode(txt);
        d.appendChild(t);
        var lh = 5 * (i.clientWidth / 180);
        d.style.fontSize = lh + 'px';
        d.style.color = ot.colour;
        d.style.opacity = ot.opa;
        d.style.animationDuration = ti + 's';
		i.style.wordBreak='keep-all';
	    i.style.whiteSpace='nowrap';
        d.setAttribute('style', d.style.cssText + '-webkit-animation-duration:' + ti + 's;');
        d.setAttribute('style', d.style.cssText + '-moz-animation-duration:' + ti + 's;');
        d.setAttribute('style', d.style.cssText + '-o-animation-duration:' + ti + 's;');
        d.id = 'N-d' + ot.num;
        i.style.position = 'relative';
        i.style.overflow = 'hidden';
        if (ot.md == 'normal') {
            d.style.top = lh * ot.dnum + 'px';
            d.className = 'N-d';
            var et;
            for (et in ot.end) {
                if (d.style[et] !== undefined) {
                    break;
                }
            }
            d.addEventListener(ot.end[et],
            function() {
                i.removeChild(d);
            });
            /*Listen to CSS3*/
            if (ot.dnum >= (i.clientHeight / lh)) {
                ot.dnum = 0;
            } else {
                ot.dnum += 1;
            }
        } else if (ot.md == 'top') {
            d.className = 'N-n';
            d.style.top = lh * ot.tnum + 'px';
            if (ot.tnum >= (i.clientHeight / (lh * 2))) {
                ot.tnum = 0;
            } else {
                ot.tnum += 1;
            }
            ot.center(d);
            ot.pf(d.id, ti);
        } else if (ot.md == 'bottom') {
            d.className = 'N-n';
            d.style.bottom = lh * ot.bnum + 'px';
            if (ot.bnum >= (i.clientHeight / (lh * 2))) {
                ot.bnum = 0;
            } else {
                ot.bnum += 1;
            }
            ot.center(d);
            ot.pf(d.id, ti);
        }
        ot.num += 1;
        i.appendChild(d);
    },
    theworld: function() {
        var i = this.s('N-dm');
        var statu = 'paused';
        if (!this.ps) {
            this.ps = true;
            var p = document.createElement('style');
            p.id = 'N-pause';
            p.innerHTML = '.N-d{animation-play-state:' + statu + ';-webkit-animation-play-state:' + statu + ';-moz-animation-play-state:' + statu + ';-o-animation-play-state:' + statu + ';}';
            i.appendChild(p);
        } else {
            this.ps = false;
            i.removeChild(this.s('N-pause'));
        }
    }
};
$N.i();
/*N.js -SomeBottle*/