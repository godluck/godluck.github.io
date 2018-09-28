/**
 * Created by hzzouchangpan on 2016/6/1.
 */
;(function(global,factory){
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory();
    } else {
        //浏览器全局变量(global 即 window)
        global.PSC_PhoneVerify = factory(global);
    }
}(typeof window !== "undefined" ? window : this,function(global){

    var count = 1,
        jsonpCount = 1,
        hasShade = false;

    function getByClassName(className) {
        if (document.getElementByClassName) {
            return document.getElementByClassName(className);
        }
        var nodes = document.getElementsByTagName('*');
        var arr = [];
        for (var i = 0; i < nodes.length; i++) {
            if (hasClass(nodes[i], className)) arr.push(nodes[i]);
        }
        return arr;
    }
    function isFunc(f){
        return typeof f === 'function';
    }

    function addEvent(obj, evtype, fn, useCapture) {
        if (obj.addEventListener) {
            obj.addEventListener(evtype, fn, useCapture);
        } else if (obj.attachEvent) {
            obj.attachEvent('on' + evtype, fn);//IE不支持事件捕获
        } else {
            obj['on' + evtype] = fn;//事实上这种情况不会存在
        }
    }
    function delEvent(obj, evtype, fn, useCapture) {
        if (obj.removeEventListener) {
            obj.removeEventListener(evtype, fn, useCapture);
        } else if (obj.detachEvent) {
            obj.detachEvent('on' + evtype, fn);
        } else {
            obj['on' + evtype] = null;
        }
    }
    //设置cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }
    //获取cookie
    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return '';
    }
    //清除cookie
    function clearCookie(name) {
        setCookie(name, "", -1);
    }
    function hasClass(obj, cls) {
        var type = typeof obj;
        if (obj == null || type != 'object') {
            return false;
        }
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        var type = typeof obj;
        if (obj == null || type != 'object') {
            return;
        }
        if (obj.length) {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                if (!hasClass(obj[i], cls)) obj[i].className += " " + cls;
            }
        } else {
            if (!hasClass(obj, cls)) obj.className += " " + cls;
        }
    }

    function removeClass(obj, cls) {
        var type = typeof obj;
        if (obj == null || type != 'object') {
            return;
        }
        if (obj.length) {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                if (hasClass(obj[i], cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    obj[i].className = obj[i].className.replace(reg, ' ');
                }
            }
        } else {
            if (hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

    }
    function getJsonp(url, data, cb) {
        var toString = Object.prototype.toString;
        var params = '';
        var jsonpCbName = 'jsonp' + (jsonpCount++);
        cb = isFunc(cb) ? cb : function(){};
        global[jsonpCbName] = cb;
        if (toString.call(data) == '[object Object]') {
            var flag = true;
            for (var i in data) {
                if (flag) {
                    params += i + '=' + data[i];
                    flag = false;
                } else {
                    params += '&' + i + '=' + data[i];
                }

            }
        } else if (toString.call(data) == '[object String]') {
            params += data;
        }
        if (params != '') {
            params = '?' + params + '&callback=' + jsonpCbName;
        } else {
            params = '?callback=' + jsonpCbName;
        }

        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.src = url + params;
        document.body.appendChild(script);
        return jsonpCbName;
    }
    function isPhoneNumber(value) {
        var phoneReg=/^1[35784][0-9][0-9]{8}$/;
        if (!phoneReg.test(value)) {
            return false;
        }
        return true;
    }
    /*function verifyPhone(flag1, flag2) {
        var phone = document.querySelector('.J_PSC_phone');
        var code = document.querySelector('.J_PSC_getcode');
        if (isPhoneNumber(phone.value)) {
            if (flag2) {
                addClass(code, 'light');
                code.disabled = false;
                code.style.cursor = 'pointer';
            }
            flag1 = true;
        } else {
            removeClass(code, 'light');
            code.disabled = true;
            code.style.cursor = 'not-allowed';
            flag1 = false;
        }
    }*/
    function lightBtn(btn) {
        addClass(btn, 'light');
        btn.disabled = false;
        btn.style.cursor = 'pointer';
    }

    function disableBtn(btn) {
        removeClass(btn, 'light');
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    }

    function setInnerText(element, text) {
        if (typeof element.textContent == "string") {
            element.textContent = text;
        } else {
            element.innerText = text;
        }
    }

    var PSC_PhoneVerify = function (config) {

        if (config) {
            for (var i in config) {
                PSC_PhoneVerify.opts[i] = config[i];
            }
        }

        return new PSC_PhoneVerify.prototype.init();
    };

    PSC_PhoneVerify.opts = {

        // 校验码
        captcha: '',
        
        // 购物地址
        goodsUrl: 'http://you.163.com/',
        
        // 领取成功回调函数
        applySuccess: '',

        // z-index值
        zIndex: 9999

    };

    PSC_PhoneVerify.prototype = {

        /**
         * 初始化函数
         * */
        init: function () {
            var _this = this;
            if (getByClassName('m-PSC-phoneverify').length != 0) {
                return false;
            }
            _this.flag1 = false; // 手机号是否正确
            _this.flag2 = true; // 是否未点击获取验证码，true未点击
            _this.flag3 = true; // 验证码是否为空
            _this.hasApplied = false; // 是否正在请求优惠券
            _this.applyTimeout = null;
            // _this.orihost = window.location.host;
            _this.orihost = /\/pre\//.test(location.href) ? 'you.yxp.163.com' : 'you.163.com';
            _this.url = /\/pre\//.test(location.href) ? 'http://'+ _this.orihost +'/act/pre/touch/yxcoupon/' : (/\/pub\//.test(location.href) ? 'http://'+ _this.orihost +'/act/pub/api1/yxcoupon/' : 'http://'+ _this.orihost +'/act/static/api1/yxcoupon/');
            // _this.url = '';
            _this.createDialog();
            _this.bindEvents();
            _this.initStatus();

            /*防止刷新：检测是否存在cookie*/
            if(getCookie('captcha')){
                _this.flag1 = true;
                var count = getCookie('captcha');
                var phoneValue = getCookie('phone');
                var btn = getByClassName('J_PSC_getcode')[0];
                var phone = getByClassName('J_PSC_phone')[0];
                phone.value = phoneValue;

                btn.value = count+'秒';
                disableBtn(btn);
                var resend = setInterval(function(){
                    count--;
                    if (count > 0){
                        btn.value = count + '秒';
                        disableBtn(btn);
                        setCookie('captcha', count, (1/86400)*count);
                        setCookie('phone', phoneValue, (1/86400)*count);
                        _this.flag2 = false;
                    }else {
                        clearInterval(resend);
                        btn.value = '获取验证码';
                        if (_this.flag1) {
                            lightBtn(btn);
                        }
                        _this.flag2 = true;

                    }
                }, 1000);
            }
            
            return _this;
        },

        /**
         * 创建弹窗
         * */
        createDialog: function () {

            //对话框模板
            var diaTpl = '<div class="u-PSC-close J_PSC_close"></div>'
                        +'<div class="u-PSC-phoneverify hide">'
                        +     '<h1 class="u-PSC-title">请验证手机号再领取优惠</h1>'
                        +     '<div class="u-PSC-row">'
                        +          '<input type="text" class="phone J_PSC_phone" placeholder="请输入您的手机号" maxlength="11">'
                        +          '<input type="button" class="u-PSC-code J_PSC_getcode" value="获取验证码" disabled>'
                        +     '</div>'
                        +     '<div class="u-PSC-row">'
                        +          '<input type="text" class="code J_PSC_code" placeholder="请输入您收到的验证码">'
                        +     '</div>'
                        +     '<div class="u-PSC-error J_PSC_error hide"></div>'
                        +     '<input type="button" class="u-PSC-sure J_PSC_sure" value="确定" disabled>'
                        +'</div>'
                        +'<div class="u-PSC-phoneverify1 hide">'
                        +     '<div class="u-PSC-title1"></div>'
                        +     '<p class="u-PSC-row1">您已领取过此优惠券</p>'
                        +     '<div class="u-PSC-btnGroup">'
                        +          '<a href="http://you.163.com/coupon" target="_blank" class="u-PSC-checkcoupon">查看优惠券</a>'
                        +          '<a href="' + PSC_PhoneVerify.opts.goodsUrl + '" target="_blank" class="u-PSC-shop">立即购物</a>'
                        +     '</div>'
                        +'</div>'
                        +'<div class="u-PSC-phoneverify2 hide">'
                        +     '<div class="u-PSC-title2">验证成功!</div>'
                        +     '<p class="u-PSC-row2"></p>'
                        +     '<div class="u-PSC-btnGroup">'
                        +          '<a href="http://you.163.com/coupon" target="_blank" class="u-PSC-checkcoupon">查看优惠券</a>'
                        +          '<a href="' + PSC_PhoneVerify.opts.goodsUrl + '" target="_blank" class="u-PSC-shop">立即购物</a>'
                        +     '</div>'
                        +'</div>'
                        +'<div class="u-PSC-phoneverify3 hide">'
                        +     '<div class="u-PSC-title3"></div>'
                        +     '<p class="u-PSC-row3">手太慢，优惠券已领完！</p>'
                        +     '<div class="u-PSC-btnGroup">'
                        +          '<a href="http://you.163.com/" target="_blank" class="u-PSC-shop">去首页逛逛</a>'
                        +     '</div>'
                        +'</div>'
                        +'<div class="u-PSC-phoneverify4 hide">'
                        +     '<div class="u-PSC-title3"></div>'
                        +     '<p class="u-PSC-row3">今日已领完，明天再来！</p>'
                        +     '<div class="u-PSC-btnGroup">'
                        +          '<a href="javascript:;" target="_blank" class="u-PSC-sure1 J_PSC_sure1">确定</a>'
                        +     '</div>'
                        +'</div>';
            var div = document.createElement('div');
            div.className = 'm-PSC-phoneverify';
            div.style.zIndex = PSC_PhoneVerify.opts.zIndex + (count++);
            div.innerHTML = diaTpl;
            document.body.appendChild(div);
            this.dialog = div;
            this.addShade();

        },

        /**
         * 初始化状态
         * */
        initStatus: function () {
            var _this = this;
            getJsonp(_this.url + 'ajax/getApplyStatus.do', {captcha: PSC_PhoneVerify.opts.captcha}, function (data) {
                if (data.code) {
                    switch (data.code) {
                        case 200:
                            if (data.content.applied == 1) {
                                _this.showSuccess2();
                            } else {
                                _this.showMain();
                                var desc = data.content.desc || '';
                                getByClassName('u-PSC-row2')[0].innerHTML = desc.replace(/(\r\n)|\n/g,'<br>');
                                // document.querySelector('.u-PSC-row2').innerHTML = desc.replace(/(\r\n)|\n/g,'<br>');
                            }
                            break;
                        case 201:
                            _this.showMain();
                            _this.showError('参数错误！');
                            break;
                        case 401:
                            _this.showMain();
                            _this.showError('请先登录！');
                            break;
                        default:
                            _this.showError('参与人数过多，等会儿再来吧！');
                    }
                }
            });
        },
        
        /**
         * 绑定事件
         * */
        bindEvents: function () {
            var _this = this;
            addEvent(getByClassName('J_PSC_getcode')[0], 'click', function () {
                var btn = getByClassName('J_PSC_getcode')[0];
                var phoneValue = getByClassName('J_PSC_phone')[0].value;
                var count = 60;
                var resend = setInterval(function(){
                    count--;
                    if (count > 0){
                        btn.value = count + '秒';
                        disableBtn(btn);
                        setCookie('captcha', count, (1/86400)*count);
                        setCookie('phone', phoneValue, (1/86400)*count);
                        _this.flag2 = false;
                    } else {
                        clearInterval(resend);
                        btn.value = '获取验证码';

                        if (_this.flag1) {
                            lightBtn(btn);
                        }
                        _this.flag2 = true;
                    }
                }, 1000);
                btn.value = count + '秒';
                disableBtn(btn);
                _this.getCode(phoneValue);
            }, false);
            addEvent(getByClassName('J_PSC_phone')[0], 'keyup', function () {
                var phone = getByClassName('J_PSC_phone')[0];
                var code = getByClassName('J_PSC_getcode')[0];
                var sure = getByClassName('J_PSC_sure')[0];
                _this.hideError();
                if (isPhoneNumber(phone.value)) {
                    if (_this.flag2) {
                        lightBtn(code);
                    }
                    if (!_this.flag3 && !_this.hasApplied) {
                        lightBtn(sure);
                    }
                    _this.flag1 = true;
                } else {
                    disableBtn(code);
                    disableBtn(sure);
                    _this.flag1 = false;
                }
            }, false);
            addEvent(getByClassName('J_PSC_code')[0], 'keyup', function () {
                var code = getByClassName('J_PSC_code')[0];
                var sure = getByClassName('J_PSC_sure')[0];
                _this.hideError();
                if (code.value.length != 0) {
                    if (_this.flag1 && !_this.hasApplied) {
                        lightBtn(sure);
                    }
                    _this.flag3 = false;
                } else {
                    disableBtn(sure);
                    _this.flag3 = true;
                }
            }, false);
            addEvent(getByClassName('J_PSC_close')[0], 'click', function () {
                _this.close();
            }, false);
            addEvent(getByClassName('J_PSC_sure1')[0], 'click', function () {
                _this.close();
            }, false);
            addEvent(getByClassName('J_PSC_sure')[0], 'click', function () {
                var code = getByClassName('J_PSC_code')[0];
                var phone = getByClassName('J_PSC_phone')[0];
                _this.applyCoupon(phone.value, code.value);
            
            }, false);
        },

        /**
         * 显示错误提示
         * */
        showError: function (text) {
            var error = getByClassName('J_PSC_error')[0];
            setInnerText(error, text);
            removeClass(error, 'hide');
        },

        /**
         * 隐藏错误提示
         * */
        hideError: function () {
            var error = getByClassName('J_PSC_error')[0];
            // addClass(error, 'hide');
            setInnerText(error, '双11期间验证码可能较慢收到，请耐心等待。');
            removeClass(error, 'hide');
        },

        /**
         * 显示首页
         * */
        showMain: function () {
            var page1 = getByClassName('u-PSC-phoneverify')[0];
            removeClass(page1, 'hide');
            this.hideError();
        },

        /**
         * 显示领取成功页面
         * */
        showSuccess: function () {
            var cb = PSC_PhoneVerify.opts.applySuccess;
            if (isFunc(cb)) {
                this.close();
                cb();
            } else {
                var page1 = getByClassName('u-PSC-phoneverify')[0];
                var page2 = getByClassName('u-PSC-phoneverify2')[0];
                addClass(page1, 'hide');
                removeClass(page2, 'hide');
            }
        },

        /**
         * 显示已领取页面
         * */
        showSuccess2: function () {
            var page1 = getByClassName('u-PSC-phoneverify')[0];
            var page2 = getByClassName('u-PSC-phoneverify1')[0];
            addClass(page1, 'hide');
            removeClass(page2, 'hide')
        },

        /**
         * 显示已领完页面
         * */
        showFail: function () {
            var page1 = getByClassName('u-PSC-phoneverify')[0];
            var page2 = getByClassName('u-PSC-phoneverify3')[0];
            addClass(page1, 'hide');
            removeClass(page2, 'hide')
        },

        /**
         * 显示今日已领完页面
         * */
        showFail1: function () {
            var page1 = getByClassName('u-PSC-phoneverify')[0];
            var page2 = getByClassName('u-PSC-phoneverify4')[0];
            addClass(page1, 'hide');
            removeClass(page2, 'hide')
        },

        /**
         * 获取验证码
         * */
        getCode: function (phone) {
            var _this = this;
            getJsonp(_this.url + 'ajax/sendCode.do', {mobile: phone}, function (data) {
                if (data.code) {
                    switch (data.code) {
                        case 200:
                            break;
                        case 401:
                            _this.showError('请先登录！');
                            break;
                        case 407:
                            _this.showError('手机号输入错误！');
                            break;
                        case 408:
                            _this.showError('每个手机号每天只可收3次验证码！');
                            break;
                        case 409:
                        case 411:
                            _this.showError('验证码获取太频繁！');
                            break;
                        case 500:
                            _this.showError('参与人数过多，等会儿再来吧！');
                            break;
                        default:
                            _this.showError('参与人数过多，等会儿再来吧！');
                    }
                }
            });
        },

        /**
         * 申领优惠券
         * */
        applyCoupon: function (phone, code) {
            var _this = this;
            var sure = document.querySelector('.J_PSC_sure');
            disableBtn(sure);
            _this.hasApplied = true;
            var funcName = getJsonp(_this.url + 'ajax/applyCoupon.do', {mobile: phone, code: code, captcha: PSC_PhoneVerify.opts.captcha}, function (data) {
                if (data.code) {
                    switch (data.code) {
                        case 200:
                            _this.showSuccess();
                            break;
                        case 204:
                            _this.showFail();
                            break;
                        case 205:
                            _this.showFail1();
                            break;
                        case 401:
                            _this.showError('请先登录！');
                            break;
                        case 405:
                            _this.showError('验证码错误！');
                            break;
                        case 411:
                            _this.showError('申请太过频繁');
                            break;
                        case 500:
                            _this.showError('参与人数过多，等会儿再来吧！');
                            break;
                        case 600:
                            _this.showSuccess2();
                            break;
                        case 601:
                            _this.showError('仅限新用户领取！');
                            break;
                        case 610:
                            _this.showError('该手机号已领取过优惠券！');
                            break;
                        default:
                            _this.showError('参与人数过多，等会儿再来吧！');
                    }
                }
                if (_this.flag1 && !_this.flag3) {
                    lightBtn(sure);
                }
                _this.hasApplied = false;
                clearTimeout(_this.applyTimeout);
            });
            clearTimeout(_this.applyTimeout);
            _this.applyTimeout = setTimeout(function () {
                if (_this.flag1 && !_this.flag3) {
                    lightBtn(sure);
                }
                _this.showError('参与人数过多，等会儿再来吧！');
                global[funcName] = function(){};
                _this.hasApplied = false;
            }, 10000);
        },

        /**
         * 设置遮罩
         */
        addShade: function () {
            if (hasShade) return;
            var div = document.createElement('div');
            div.className = 'm-PSC-shade';
            div.style.zIndex = PSC_PhoneVerify.opts.zIndex;
            document.body.appendChild(div);
            this.shade = div;
            hasShade = true;
        },

        /**
         * 移除遮罩
         */
        removeShade: function() {
            if (hasShade) {
                document.body.removeChild(this.shade);
                hasShade = false;
            }
        },

        /**
         * 关闭对话框
         */
        close: function() {
            document.body.removeChild(this.dialog);
            this.removeShade();
        }

    };



    PSC_PhoneVerify.prototype.init.prototype = PSC_PhoneVerify.prototype;
    return PSC_PhoneVerify;
}));