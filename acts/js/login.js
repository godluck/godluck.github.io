!(function(){
    function outLogin(_uid,fn){
        var _tail = _uid.split('@')[1],
            _domain = _tail.indexOf('188') > -1 ? 'vip.188.com' : _tail,
            _url = (!(_domain == 'vip.188.com' || _domain == 'vip.163.com') ? 'http://reg.163.com/Logout.jsp' : 'http://webmail.' + _domain + '/js6/logout.jsp') + '?url=http%3A%2F%2Fvpay.vip.163.com%2Fvippayunion%2F' + '&username=' + _uid + '&uid=' + _uid;
        var _iframe = $('body').append('<iframe src="' + _url + '" style="display:none;" id="J_logout"></iframe>');
        $('#J_logout').load(function() {
            if(isFunction(fn)){
                fn();
            }else{
                window.location.reload();
            }
        });
        return false;
    };

    function isFunction(fn){
        return typeof fn === 'function';
    };

    function freeLogin(opts){
        var _email = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
            _userTip = opts.user || "请输入正确的邮箱帐号！",
            _passTip = opts.pass || "您输入的密码不正确！",
            _getUid = opts.url || "http://dashi.hztest.mail.163.com/commonapi/ajax/getUid.do";

        function isIE6(){
            var ie=!!window.ActiveXObject,
                ie6=ie&&!window.XMLHttpRequest;
            return ie6;
        };

        function productID(){
            var _host = window.location.host,
                _moneyJumpUrl = (_host == "money.hztest.mail.163.com") ? "http://money.hztest.mail.163.com/act/pre/6NOwT75YzD.html" : "http://activity.mail.163.com/static/6NOwT75YzD.html";
            return _moneyJumpUrl;

        };

        function parseSearch(){
            var _search = location.search ? location.search.slice(1) : "",
                _searchArr = _search.split("&"),
                _searchObj = {};
            if(!location.search) return {};
            for(var _i=0,_len=_searchArr.length;_i<_len;_i++){
                var _arr  = _searchArr[_i].split("=");
                if(!_arr[0] || !_arr[1]) continue;
                _searchObj[_arr[0].replace(/script|%22|%3E|%3C|'|"|>|<|\\/ig,'_')] = _arr[1].replace(/script|%22|%3E|%3C|'|"|>|<|\\/ig,'_');
            };
            return _searchObj;
        };
        function makeSearch(_search){
            _search = _search || {};
            var _newSearch = '';
            for(var _i in _search){
                if(!_search[_i]) continue;
                _newSearch += ('&' + _i +'='+_search[_i]);
            }
            return _newSearch;
        };

        function isLogined(){
            var _search = parseSearch();

            if(_search['pagename'] == 'mpay'){
                resetLoginBtnColor();
                $("body").css('display','block');
                return;
            };

            $.ajax({
                type : "GET",
                url : _getUid,// 请求数据
                dataType : 'jsonp',
                headers:{
                    'Referer':'163.com'
                },
                async: false,
                cache:false,
                success : function(data) {
                    if(data.code == 200){
                        window.uid = data.content.uid;
                    }
                }
            });
        };

        function resetLoginBtnColor(){
            var _parseSearch = parseSearch();
            if(!_parseSearch["domain"]) return;

            $('body').addClass('page-' + _parseSearch["domain"]);
        };

        function init(){
            isLogined();
        };
        init();

        function postSubmit(_e){
            _e = _e || window.event;
            if(_e.type == "keyup" && _e.keyCode != "13"){
                return;
            };
            var _loginFrame = decodeURIComponent(productID()),
                _errorFrame = decodeURIComponent(productID());
            $("body").append('<iframe name="loginIframe" id="loginIframe" src="about:blank" style="display:none;"></iframe>');
            $(".J-form").attr("action", 'https://reg.163.com/logins.jsp?url='+ _loginFrame +'&url2=' + _errorFrame);

            var _name = $.trim($(".J-username").val()),
                _pwd  = $(".J-password").val();
            if(!_name || !_email.test(_name)){
                showError(_userTip);
                return;
            }
            if(!_pwd || _pwd.length < 6){
                showError(_passTip);
                return;
            };

            $(".J-form").submit();
            $("#loginIframe").load(function(){
                var _that = $(this);
                setTimeout(function(){_that.remove();},900);
            });
            return false;
        };

        function supportPlaceHolder(e){
            var placeHolder = $(this).attr("data-placeholder");
            e = e || window.event;
            if(e.type == "focus" || e.type == "focusin"){
                if($(this).val() == placeHolder){
                    $(this).val("");
                }
            }else{
                if($(this).val() == ""){
                    $(this).val(placeHolder);
                }
            };
        };
        $("input").bind({"focus":supportPlaceHolder,"blur":supportPlaceHolder});

        function hideError(){
            $(".J-error").html("").css("visilibity","hidden");
        };

        function changeVal(_e){
            var _e = _e || window.event,
                _target = _e.target || _e.srcElement,
                _html = _target.value,
                _keyMailReg = //,
                _domain = [/^([a-zA-Z0-9_\.\-])+@vip\.163\.com/,/^([a-zA-Z0-9_\.\-])+@vip\.126\.com/,/^([a-zA-Z0-9_\.\-])+@188\.com/,/^([a-zA-Z0-9_\.\-])+@163\.com/,/^([a-zA-Z0-9_\.\-])+@126\.com/,/^([a-zA-Z0-9_\.\-])+@yeah\.net/],
                _domainB = ['163.com','126.com','yeah.net','vip.163.com','vip.126.com','188.com'],
                _phone = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|170)[0-9]{8}$/,
                _appendHTML = [],
                _search = parseSearch(),
                _needDomain = _search["type"] == "needFree" ? _domain :_domain.slice(0,3),
                _needDoaminSuffix = _search["type"] == "needFree" ? _domainB : _domainB.slice(0,3);

            hideError();
            var _arr = _html.split("@"),
                _prefix = _arr[0],
                _suffix = _arr[1];

            for(var _i=0;_i<_needDomain.length;_i++){
                if((_prefix.match(/([a-zA-Z0-9_\.\-])+/) && _needDoaminSuffix[_i].indexOf(_suffix) >= 0) || (_html.indexOf("@") < 0 && _html)){
                    _appendHTML.push('<a href="javascript:;">'+ _prefix +'@'+ _needDoaminSuffix[_i] +'</a>');
                }
            }
            if(_appendHTML.length > 1 && _html){
                $(".J-noticeMailList").show().html(_appendHTML.join("")).css("height","auto");
            }else{
                $(".J-noticeMailList").hide().html('');
            }
            chooseList(_e);
            if(_e.keyCode && _e.keyCode == 8){
                _currentKeyCode = -1;
            }

        };

        var _hiddenTimeout;
        function hiddenNoticeMail(e){
            _hiddenTimeout = setTimeout(function(){
                $(".J-noticeMailList").hide().html("").css("height","0");
            },13);
            _currentKeyCode = -1;
        };

        var _currentKeyCode = -1;
        function chooseList(e){
            e = e || window.event;
            if(e.type != "keyup" || $(".J-noticeMailList a").length == 0) return;
            if(e.keyCode && e.keyCode == 13 && _currentKeyCode == -1) _currentKeyCode = 0;
            var _code = e.keyCode;
            if(_code == 38){
                _currentKeyCode = _currentKeyCode == -1 ? 0 : _currentKeyCode;
                _currentKeyCode = (_currentKeyCode === 0) ? $(".J-noticeMailList a").length-1 :  _currentKeyCode - 1;
                $(".J-noticeMailList a").eq(_currentKeyCode).addClass("on");
                selectRange($(".J-username"),100,100);
            }else if(_code == 40){
                _currentKeyCode = (_currentKeyCode === $(".J-noticeMailList a").length-1) ? 0 :  _currentKeyCode + 1;
                $(".J-noticeMailList a").eq(_currentKeyCode).addClass("on");
            }else if(_code == 13){
                $(".J-username").val($(".J-noticeMailList a").eq(_currentKeyCode).html());
                hiddenNoticeMail();
                selectRange($(".J-username"),100,100);
            }
        };

        function clickList(e){
            e = e || window.event;
            var _target = e.target || e.srcElement;
            $(".J-username").val(_target.innerHTML);
            hiddenNoticeMail(e);
        };


        $(".J-submit").on({"click":postSubmit});
        $(".J-password").on({"keyup":postSubmit});

        $(".J-username").on({
            "focus":changeVal,
            "keyup":changeVal,
            "propertychange":changeVal,
            "mouseleave" : hiddenNoticeMail
        });
        $(".J-noticeMailList").on({
            "click" : clickList,
            "touchend" : clickList,
            "mouseleave" : hiddenNoticeMail,
            "mouseenter" : function(){clearTimeout(_hiddenTimeout);}
        });

        $(".J-linkBtn").on({
            "click" : function(){
                var _href =$(this).attr("data-href");
                window.open(_href,"_blank");
            }
        });

        function selectRange(obj,start,end){
            obj.each(function(){
                if (this.setSelectionRange) {
                    this.focus();
                    this.setSelectionRange(start, end);
                } else if (this.createTextRange) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            })
        };

        function showError(_notice){
            $(".J-error").html('<i></i>'+_notice).css("visibility","visible");
        };

        window.top.loginCallback = function(_data){
            if(_data.sErrorName){
                switch(_data.sErrorName){
                    case '412':
                        showError('该帐号登录错误过多，请稍后重试');
                        break;
                    case '428':
                        showError('异地登陆');
                        break;
                    case '460':
                        showError('帐户密码错误');
                        break;
                    case '420':
                        showError("用户名不存在。");
                        break;
                    case '412':
                    case '414':
                    case '415':
                        showError("您尝试的次数已经太多，请过一段时间再试。");
                        break;
                    case '416':
                    case '417':
                    case '418':
                    case '419':
                        showError("您在短时间内存在频繁登录邮箱的非正常状态。");
                        break;
                    case '422':
                        showError("您的帐号已被锁定！");
                        break;
                    case '500':
                        showError("未知原因导致登录异常，请稍后再试。");
                        break;
                    case '503':
                        showError("邮箱系统正在升级维护中，请稍后再试。");
                        break;
                    default:
                        showError("未知原因导致登录失败，请稍后再试。");
                        break;
                }
            }else{
                opts.callback(window.uid);
            }
        };
    };

    window.PSC_C_login = {
        outLogin:outLogin,
        login:freeLogin
    };

})();
