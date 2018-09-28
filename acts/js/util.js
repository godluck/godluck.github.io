;

+ function() {
    function preventDefault(e) {
        e = e || window.event;
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
    }

    var keys = { 32: 1, 37: 1, 38: 1, 39: 1, 40: 1 };


    function preventDefaultForScrollKeys(e) {
        try {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        } catch (e) {}
    }
    var oldonwheel, oldonmousewheel1, oldonmousewheel2, oldontouchmove, oldonkeydown, isDisabled;

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        oldonwheel = window.onwheel;
        window.onwheel = preventDefault; // modern standard

        oldonmousewheel1 = window.onmousewheel;
        window.onmousewheel = preventDefault; // older browsers, IE
        oldonmousewheel2 = document.onmousewheel;
        document.onmousewheel = preventDefault; // older browsers, IE

        oldontouchmove = document.ontouchmove;
        document.ontouchmove = preventDefault; // mobile

        oldonkeydown = document.onkeydown;
        document.onkeydown = preventDefaultForScrollKeys;
        isDisabled = true;
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        })
    }

    function enableScroll() {
        if (!isDisabled) return;
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);

        window.onwheel = oldonwheel; // modern standard

        window.onmousewheel = oldonmousewheel1; // older browsers, IE
        document.onmousewheel = oldonmousewheel2; // older browsers, IE

        document.ontouchmove = oldontouchmove; // mobile

        document.onkeydown = oldonkeydown;
        isDisabled = false;
        $(document).off('touchmove');
    }

    function windowY() {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        // var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y;
    }

    function getPosition(target, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (target < arr[i]) {
                return i;
            }
        }
        return i;
    }

    function getExtend(str) {
        var n_v, v, n, attrs = str.split('|');
        var data = {};
        for (var i in attrs) {
            n_v = attrs[i].split('&');
            n = null;
            v = null;
            for (var j in n_v) {
                if (n_v[j].indexOf('name') !== -1) {
                    n = n_v[j].substr(5);
                }
                if (n_v[j].indexOf('value') !== -1) {
                    v = n_v[j].substr(6);
                }
            }
            data[n] = v;
        }
        return data;
    }

    function getQuery(str) {
        var n_v, v, n, attrs = str;
        var data = {};
        n_v = attrs.split('&');
        n = null;
        v = null;
        for (var j in n_v) {
            var i = n_v[j].indexOf('=');
            if (i !== -1) {
                n = n_v[j].substr(0, i);
                v = n_v[j].substr(i + 1);
                data[n] = v;
            }
        }
        return data;
    }

    function _getJson(url, data, callback, error) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: data,
            async: true,
            cache: false,
            jsonp: "callback",
            success: function(data) {
                if (data && data.code) {
                    if ($.isFunction(callback)) {
                        callback(data) || callback;
                    }
                } else {
                    error && error()
                }
            },
            error: function(xhr, textStatus) {
                error && error();
            }
        });
    }
    var _currentId = 0;

    function toggleNumber(end) {
        return _currentId < end ? _currentId++ : (_currentId -= end, end);
    }

    function stopScrollAtBorder(ele) {
        var startX, startY;

        $(ele).on('touchstart', function(e) {
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
        });

        // 仿innerScroll方法
        $(ele).on('touchmove', function(e) {
            e.stopPropagation();

            var deltaX = e.changedTouches[0].pageX - startX;
            var deltaY = e.changedTouches[0].pageY - startY;

            // 只能纵向滚
            if (Math.abs(deltaY) < Math.abs(deltaX)) {
                e.preventDefault();
                return false;
            }

            var box = $(this).get(0);

            if ($(box).height() + box.scrollTop >= box.scrollHeight - 10) {
                if (deltaY < 0) {
                    e.preventDefault();
                    return false;
                }
            }
            if (box.scrollTop === 0) {
                if (deltaY > 0) {
                    e.preventDefault();
                    return false;
                }
            }
            // 会阻止原生滚动
            // return false;
        });
    }
    //设置cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }
    //获取cookie
    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return '';
    }
    //清除cookie
    function clearCookie(name) {
        setCookie(name, "", -1);
    }

    function checkPlatform() {
        var ua = navigator.userAgent,
            touchRegex = new RegExp('(MIDP)|(WAP)|(UP.Browser)|(Smartphone)|(Obigo)|(Mobile)|(AU.Browser)|(wxd.Mms)|(WxdB.Browser)|(CLDC)|(UP.Link)|(KM.Browser)|(UCWEB)|(SEMC-Browser)|(Mini)|(Symbian)|(Palm)|(Nokia)|(Panasonic)|(MOT-)|(SonyEricsson)|(NEC-)|(Alcatel)|(Ericsson)|(BENQ)|(BenQ)|(Amoisonic)|(Amoi-)|(Capitel)|(PHILIPS)|(SAMSUNG)|(Lenovo)|(Mitsu)|(Motorola)|(SHARP)|(WAPPER)|(LG-)|(LG/)|(EG900)|(CECT)|(Compal)|(kejian)|(Bird)|(BIRD)|(G900/V1.0)|(Arima)|(CTL)|(TDG)|(Daxian)|(DAXIAN)|(DBTEL)|(Eastcom)|(EASTCOM)|(PANTECH)|(Dopod)|(Haier)|(HAIER)|(KONKA)|(KEJIAN)|(LENOVO)|(Soutec)|(SOUTEC)|(SAGEM)|(SEC-)|(SED-)|(EMOL-)|(INNO55)|(ZTE)|(iPhone)|(Android)|(Windows CE)', 'i');
        if (/yanxuan/i.test(ua) || /MailMaster/i.test(ua) || /MoneyKeeper/i.test(ua) || /duobao/i.test(ua)) {
            //app
            if (/android/i.test(ua)) {
                //android
                return 6
            } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
                //apple
                return 5
            }
        } else if (/MicroMessenger/i.test(ua)) {
            //weixin
            return 3
        } else if (/YiXin/i.test(ua)) {
            //yixin
            return 4
        } else if (/Trident/i.test(ua) || /Presto/i.test(ua) || /AppleWebKit/i.test(ua) || /Gecko/i.test(ua)) {
            //pc&&h5
            if (touchRegex.test(ua)) {
                return 2
            } else {
                //pc
                return 0
            }
        } else if (touchRegex.test(ua)) {
            //h5
            return 2
        } else {
            return 0
        }
    }

    function escape(str) {
        if (!str) {
            return ''
        }
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        }
        for (var i in map) {
            str = str.replace(new RegExp(i, 'g'), map[i])
        }
        return str
    }

    window.UTIL = {
        setCookie: setCookie,
        getCookie: getCookie,
        clearCookie: clearCookie,
        enableScroll: enableScroll,
        disableScroll: disableScroll,
        windowY: windowY,
        getPosition: getPosition,
        getExtend: getExtend,
        getJson: _getJson,
        toggleNumber: toggleNumber,
        stopScrollAtBorder: stopScrollAtBorder,
        checkPlatform: checkPlatform,
        escape:escape
    }
}();
