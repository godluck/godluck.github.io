/*!
 * PSC_C_lazyload v1.0.3
 * Licensed under MIT ()
 * Developer kimi
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
        global.PSC_C_lazyload = factory(global);
    }
}(typeof window !== "undefined" ? window : this,function(){
	//在IE8中提供Date.now()方法的polyfill 
	Date.now = Date.now ? Date.now : function(){
		return +new Date()
	}
    var PSC_C_lazyload = function(config){
        var _window = $(window),
            eLnow = Date.now();
        var settings = {
            ele:'J_lazyload',
            inViewTreshhold:10,
            placeholder:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2QTA4RkM3QUYxQTIxMUU1OEI5OEExNjBDNUM5RkFCMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2QTA4RkM3QkYxQTIxMUU1OEI5OEExNjBDNUM5RkFCMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZBMDhGQzc4RjFBMjExRTU4Qjk4QTE2MEM1QzlGQUIwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZBMDhGQzc5RjFBMjExRTU4Qjk4QTE2MEM1QzlGQUIwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ec5c0wAAAA9JREFUeNpi+PLlC0CAAQAFvALddHJsygAAAABJRU5ErkJggg=='
        };
        var imgHook = $('img.' + settings.ele);

        $.extend({},settings, config);

        function imgView (){
            $.each(imgHook,function(i){
                var eLvW,
                    elvH,
                    _this = $(this);

                //inViewTreshhold值可以根据页面是否加载完动态改变大小，当页面加载完的时候增大，也可说页面负担小的时候预加载多一些

                eLvW = window.innerWidth || document.documentElement.clientWidth + settings.inViewTreshhold;
                elvH = window.innerHeight || document.documentElement.clientHeight + settings.inViewTreshhold;
                eLnegativeTreshhold = settings.inViewTreshhold * -1;
                rect = imgHook[i].getBoundingClientRect();

                if (!/.jpg|.png/gi.test(_this.attr('src')) || _this.attr('src') === undefined || _this.attr('src') === '' || _this.attr('src') === false) {
                    if (_this.is("img")) {
                        _this.attr("src", settings.placeholder);
                    }
                };

                //判断是否在可视区域
                if ((eLbottom = rect.bottom) >= eLnegativeTreshhold &&
                    (eLtop = rect.top) <= elvH &&
                    (eLright = rect.right) >= eLnegativeTreshhold &&
                    (eLleft = rect.left) <= eLvW &&
                    (eLbottom || eLright || eLleft || eLtop)) {
                    //图片要进行的动画
                    var imgUrl = _this.attr('data-original');
                    _this.attr("src",imgUrl).removeClass(settings.ele).addClass('a-img-show');
                }
            })
        };

        //事件节流处理
        var eventThrottling = (function() {
            var timer, running;
            var unblock = function() {
                running = false;
            };
            var run = function() {
                clearTimeout(timer);
                imgView();
                setTimeout(unblock);
            };
            return {
                debounce: function() {
                    clearTimeout(timer);
                    running = true;
                    timer = setTimeout(run, 66);
                },
                throttled: function() {
                    var delay;
                    if (!running) {
                        running = true;
                        clearTimeout(timer);
                        delay = Date.now() - eLnow;
                        if (delay > 300) {
                            delay = 9;
                        } else {
                            delay = 99;
                        }
                        timer = setTimeout(run, delay);
                    }
                }
            };
        })();

        imgView();

        _window.on('scroll',eventThrottling.throttled);
        _window.on('touchmove',eventThrottling.throttled);
        _window.on('resize',eventThrottling.debounce);
        _window.on('focus',eventThrottling.throttled);
    };

    return PSC_C_lazyload;
}));
