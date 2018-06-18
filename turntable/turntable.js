function initTurntable(config) {
    var defaultConfig = {
        distance: 500, //半径
        elements: null, //卡片元素
        useRem: false, //是否使用rem单位长度
        container: null, //直接包含卡片元素的容器
        returnSpeed: 1, //滚动恢复的速度
        onTouchend:function(degree){} //触摸结束时,转盘回弹之前的回调
    }
    var opts = {}
    opts = $.extend(opts, defaultConfig, config);
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var start = [0, 0]
    var offset
    var center
    var degree
    var animating
    var current
    var speed
    var timestamp
    var container = opts.container
    var btns = opts.elements
    var isAndroid = /android/i.test(navigator.userAgent);
    var distance = opts.useRem?(-1*opts.distance+'rem'):(-1*distance+'px')
    rotate(0)
    container.on({
        touchstart: function(e) {
            if (animating) {
                return;
            }
            var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : e.changedTouches[0];
            start = [touch.pageX, touch.pageY]
            offset = container.offset()
            offset.width = container.width()
            offset.height = container.height()
            center = [offset.left + offset.width / 2, offset.top + offset.height / 2];
            timestamp = Date.now();
        },
        touchmove: function(e) {
            e.preventDefault();
            if (animating) {
                return false;
            }
            var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : e.changedTouches[0];
            if (isAndroid) {
                if (Date.now() - timestamp > 33) {
                    current = [touch.pageX, touch.pageY];
                    degree = ~~getdegree(center, start, current)
                    rotate(degree)
                    timestamp = Date.now()
                }
            } else {
                current = [touch.pageX, touch.pageY];
                degree = ~~getdegree(center, start, current)
                rotate(degree)
            }
        },
        touchend: function(e) {
            if (animating) {
                return;
            }
            degree = ~~degree
            speed = Math.abs(degree / 30 / opts.returnSpeed)
            animating = true;
            opts.onTouchend(degree)
            reset()
        }
    })

    function reset() {
        if (degree > 0) {
            degree -= speed;
            rotate(degree)
        }
        if (degree < 0) {
            degree += speed;
            rotate(degree)
        }
        if (Math.abs(degree) > speed) {
            requestAnimFrame(reset)
        }
        if (Math.abs(degree) <= speed) {
            rotate(0)
            animating = false;
        }
    }

    function getdegree(c, a, b) {
        var v1 = [a[0] - c[0], a[1] - c[1]],
            v2 = [b[0] - c[0], b[1] - c[1]],
            xp = v1[0] * v2[0] + v1[1] * v2[1],
            m1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]),
            m2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]),
            p = m1 * m2,
            cos = xp / p,
            cp = v1[0] * v2[1] - v2[0] * v1[1];
        return Math.acos(cos) / Math.PI * 180 * cp / Math.abs(cp)
    }

    function rotate(deg) {
        for (var i = 0; i < btns.length; i++) {
            btns.eq(i).css('transform', 'rotateZ(' + (~~(360 / (btns.length + 1) * (i + 1)) + deg) + 'deg) translate3d(0,'+distance+',0) rotateZ(' + (~~(-360 / (btns.length + 1) * (i + 1)) - deg) + 'deg)')
        }
    }

    function rem2px(rem) {
        var width = document.documentElement.clientWidth;
        return width / 6.4 * rem;
    }
}
