/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var css3d = __webpack_require__(1)
	var scene1 = new css3d.Scene('./fullbg.png', [5500, 1345], 50, './top.png', './btm.png')
	css3d.target.appendChild(scene1.container)

	// var scene2 = new css3d.Scene('./layer.png', [900, 200], 50)
	// css3d.target.appendChild(scene2.container)

	var controller = new css3d.Controller.DeviceOrientationController(css3d.target)
	// var controller = new css3d.Controller.TouchController(css3d.target)
	controller.init()

	scene1.addMark('./btn.png', [0,100], function(){
		alert('你点到我了！')
	}, {
		name:'float',
		from:{
			'transform':'translate3d(0,.3rem,0)',
			'-webkit-transform':'translate3d(0,.3rem,0)',
		},
		to:{
			'transform':'translate3d(0,-.3rem,0)',
			'-webkit-transform':'translate3d(0,-.3rem,0)',
		}
	}, 'float 2s ease-in-out infinite alternate')

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var Scene = __webpack_require__(2)
	var Controller = __webpack_require__(5)

	function initBase() {
	    var css = '\
				* {margin:0;padding:0;box-sizing:border-box;}\
				html,body {width:100%;height:100%;background:#fcfcfc;font-size:initial;margin:0 auto;overflow:hidden;}\
				img {border:none;}\
				.css3d-stage {width:100%;height:100%;position:relative;-webkit-perspective:1000;perspective:1000;-webkit-perspective-origin:50% 50%;perspective-origin:50% 50%;}\
				.css3d-scene,.css3d-box {position:absolute;top:0;left:0;width:100%;height:100%;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;}\
				.css3d-slice {position:absolute;top:50%;left:50%;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:50% 50% 0;transform-origin:50% 50% 0;}\
				.css3d-scene,.css3d-slice{pointer-events:none;} .css3d-sprite{pointer-events:initial;width:0;height:0;} .css3d-sprite img{position:absolute;transform:translate(-50%,-50%)}\
		   	',
	        head = document.head || document.getElementsByTagName('head')[0],
	        style = document.createElement('style');

	    style.type = 'text/css';
	    if (style.styleSheet) {
	        style.styleSheet.cssText = css;
	    } else {
	        style.appendChild(document.createTextNode(css));
	    }
	    head.appendChild(style);
	    var target = document.querySelector('.css3d-stage')
	    if (!target) {
	        target = document.createElement('div')
	        target.className = 'css3d-stage'
	        document.body.appendChild(target)
	    }
	    var box = document.createElement('div')
	    box.className = 'css3d-box'
	    target.appendChild(box)
	    return box
	}

	module.exports = {
	    Scene: Scene,
	    Controller: Controller,
	    target: initBase()
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var fixer = __webpack_require__(3)
	var addMark = __webpack_require__(4)
	function Scene(img, imageSize, verticalSliceCount, imgTop, imgBtm) {
	    var self = this
	    this.img = loadImage(img)
	    this.img.onload = function() {
	        self.img.loaded = true;
	    }
	    this.imgBtm = imgBtm ? loadImage(imgBtm) : null
	    this.imgTop = imgTop ? loadImage(imgTop) : null
	    this.imageSize = imageSize
	    this.verticalSliceCount = verticalSliceCount

	    this.radiusScale = .99 //避免PC中图片间白线
	    this.r = Math.abs(imageSize[0] / verticalSliceCount / 2 / Math.tan(360 / verticalSliceCount / 2 / 180 * Math.PI)) * this.radiusScale
	    this.container = document.createElement('div')
	    this.container.className = 'css3d-scene'
	    this.init()
	}

	Scene.prototype = {
	    init: function() {
	        var self = this
	        if (this.img.loaded) {
	            var canvas = document.createElement('canvas')
	            canvas.width = this.imageSize[0] / this.verticalSliceCount;
	            canvas.height = this.imageSize[1];
	            var ctx = canvas.getContext('2d')
	            var imgs = []
	            for (var i = 0; i < this.imageSize[0]; i += canvas.width) {
	                ctx.clearRect(0, 0, canvas.width, canvas.height)
	                ctx.drawImage(this.img, -i, 0)
	                var t = new Image()
	                t.src = canvas.toDataURL()
	                t.className = 'css3d-slice css3d-slice-' + (i / canvas.width)
	                imgs.push(t)
	            }
	            imgs.forEach(function(v, i){
	                self.container.appendChild(v)
	                v.style['WebkitTransform'] = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -360 / self.verticalSliceCount * i + 'deg) translate3d(0,0,' + (-self.r) + 'px)'
	                v.style.transform = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -360 / self.verticalSliceCount * i + 'deg) translate3d(0,0,' + (-self.r) + 'px)'
	            })

	            if (this.imgTop) {
	                this.imgTop.width = this.r * 2
	                this.imgTop.height = this.r * 2
	                this.imgTop.className = 'css3d-slice'
	                this.imgTop.style['WebkitTransform'] = 'translate3d(-50%,-50%,' + this.imageSize[1] / 2 + 'px) rotateX(180deg)'
	                this.imgTop.style.transform = 'translate3d(-50%,-50%,' + this.imageSize[1] / 2 + 'px) rotateX(180deg)'
	                this.container.appendChild(this.imgTop)
	            }
	            if (this.imgBtm) {
	                this.imgBtm.width = this.r * 2
	                this.imgBtm.height = this.r * 2
	                this.imgBtm.className = 'css3d-slice'
	                this.imgBtm.style['WebkitTransform'] = 'translate3d(-50%,-50%,' + -this.imageSize[1] / 2 + 'px)'
	                this.imgBtm.style.transform = 'translate3d(-50%,-50%,' + -this.imageSize[1] / 2 + 'px)'
	                this.container.appendChild(this.imgBtm)
	            }
	        } else {
	            this.img.onload = function() {
	                self.img.loaded = true;
	                self.init()
	            }
	        }
	    },
	    addMark:function(imgURL, position, callback, keyframes, animation){
	    	addMark(this, imgURL, position, callback, keyframes, animation)
	    }
	}

	function loadImage(url) {
	    var img = new Image()
	    img.crossOrigin = "Anonymous"
	    if (/blob/i.test(url) || /base64/i.test(url)) {
	        img.src = url
	    } else {
	        img.src = ((/\?/.test(url) ? url + '&' : url + '?') + btoa(window.location.origin) + Math.random().toFixed(3) + Date.now()).replace('http:', '')
	    }
	    return img
	}

	module.exports = Scene

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * StyleFix 1.0.3 & PrefixFree 1.0.7
	 * @author Lea Verou
	 * MIT license
	 */
	var StyleFix,PrefixFree
	(function(){function t(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(!window.addEventListener)return;var e=StyleFix=window.StyleFix={link:function(t){try{if(t.rel!=="stylesheet"||t.hasAttribute("data-noprefix"))return}catch(n){return}var r=t.href||t.getAttribute("data-href"),i=r.replace(/[^\/]+$/,""),s=(/^[a-z]{3,10}:/.exec(i)||[""])[0],o=(/^[a-z]{3,10}:\/\/[^\/]+/.exec(i)||[""])[0],u=/^([^?]*)\??/.exec(r)[1],a=t.parentNode,f=new XMLHttpRequest,l;f.onreadystatechange=function(){f.readyState===4&&l()};l=function(){var n=f.responseText;if(n&&t.parentNode&&(!f.status||f.status<400||f.status>600)){n=e.fix(n,!0,t);if(i){n=n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,n){return/^([a-z]{3,10}:|#)/i.test(n)?e:/^\/\//.test(n)?'url("'+s+n+'")':/^\//.test(n)?'url("'+o+n+'")':/^\?/.test(n)?'url("'+u+n+'")':'url("'+i+n+'")'});var r=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");n=n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+r,"gi"),"$1")}var l=document.createElement("style");l.textContent=n;l.media=t.media;l.disabled=t.disabled;l.setAttribute("data-href",t.getAttribute("href"));a.insertBefore(l,t);a.removeChild(t);l.media=t.media}};try{f.open("GET",r);f.send(null)}catch(n){if(typeof XDomainRequest!="undefined"){f=new XDomainRequest;f.onerror=f.onprogress=function(){};f.onload=l;f.open("GET",r);f.send(null)}}t.setAttribute("data-inprogress","")},styleElement:function(t){if(t.hasAttribute("data-noprefix"))return;var n=t.disabled;t.textContent=e.fix(t.textContent,!0,t);t.disabled=n},styleAttribute:function(t){var n=t.getAttribute("style");n=e.fix(n,!1,t);t.setAttribute("style",n)},process:function(){t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);t("style").forEach(StyleFix.styleElement);t("[style]").forEach(StyleFix.styleAttribute)},register:function(t,n){(e.fixers=e.fixers||[]).splice(n===undefined?e.fixers.length:n,0,t)},fix:function(t,n,r){for(var i=0;i<e.fixers.length;i++)t=e.fixers[i](t,n,r)||t;return t},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};(function(){setTimeout(function(){t('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})();(function(e){function t(e,t,r,i,s){e=n[e];if(e.length){var o=RegExp(t+"("+e.join("|")+")"+r,"gi");s=s.replace(o,i)}return s}if(!window.StyleFix||!window.getComputedStyle)return;var n=PrefixFree=window.PrefixFree={prefixCSS:function(e,r,i){var s=n.prefix;n.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(e,t,n,r){return t+(n||"")+"linear-gradient("+(90-r)+"deg"}));e=t("functions","(\\s|:|,)","\\s*\\(","$1"+s+"$2(",e);e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+s+"$2$3",e);e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+s+"$2:",e);if(n.properties.length){var o=RegExp("\\b("+n.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,s+"$1")},e)}if(r){e=t("selectors","","\\b",n.prefixSelector,e);e=t("atrules","@","\\b","@"+s+"$1",e)}e=e.replace(RegExp("-"+s,"g"),"-");e=e.replace(/-\*-(?=[a-z]+)/gi,n.prefix);return e},property:function(e){return(n.properties.indexOf(e)>=0?n.prefix:"")+e},value:function(e,r){e=t("functions","(^|\\s|,)","\\s*\\(","$1"+n.prefix+"$2(",e);e=t("keywords","(^|\\s)","(\\s|$)","$1"+n.prefix+"$2$3",e);n.valueProperties.indexOf(r)>=0&&(e=t("properties","(^|\\s|,)","($|\\s|,)","$1"+n.prefix+"$2$3",e));return e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+n.prefix})},prefixProperty:function(e,t){var r=n.prefix+e;return t?StyleFix.camelCase(r):r}};(function(){var e={},t=[],r={},i=getComputedStyle(document.documentElement,null),s=document.createElement("div").style,o=function(n){if(n.charAt(0)==="-"){t.push(n);var r=n.split("-"),i=r[1];e[i]=++e[i]||1;while(r.length>3){r.pop();var s=r.join("-");u(s)&&t.indexOf(s)===-1&&t.push(s)}}},u=function(e){return StyleFix.camelCase(e)in s};if(i.length>0)for(var a=0;a<i.length;a++)o(i[a]);else for(var f in i)o(StyleFix.deCamelCase(f));var l={uses:0};for(var c in e){var h=e[c];l.uses<h&&(l={prefix:c,uses:h})}n.prefix="-"+l.prefix+"-";n.Prefix=StyleFix.camelCase(n.prefix);n.properties=[];for(var a=0;a<t.length;a++){var f=t[a];if(f.indexOf(n.prefix)===0){var p=f.slice(n.prefix.length);u(p)||n.properties.push(p)}}n.Prefix=="Ms"&&!("transform"in s)&&!("MsTransform"in s)&&"msTransform"in s&&n.properties.push("transform","transform-origin");n.properties.sort()})();(function(){function i(e,t){r[t]="";r[t]=e;return!!r[t]}var e={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};e["repeating-linear-gradient"]=e["repeating-radial-gradient"]=e["radial-gradient"]=e["linear-gradient"];var t={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display",grid:"display","inline-grid":"display","min-content":"width"};n.functions=[];n.keywords=[];var r=document.createElement("div").style;for(var s in e){var o=e[s],u=o.property,a=s+"("+o.params+")";!i(a,u)&&i(n.prefix+a,u)&&n.functions.push(s)}for(var f in t){var u=t[f];!i(f,u)&&i(n.prefix+f,u)&&n.keywords.push(f)}})();(function(){function s(e){i.textContent=e+"{}";return!!i.sheet.cssRules.length}var t={":read-only":null,":read-write":null,":any-link":null,"::selection":null},r={keyframes:"name",viewport:null,document:'regexp(".")'};n.selectors=[];n.atrules=[];var i=e.appendChild(document.createElement("style"));for(var o in t){var u=o+(t[o]?"("+t[o]+")":"");!s(u)&&s(n.prefixSelector(u))&&n.selectors.push(o)}for(var a in r){var u=a+" "+(r[a]||"");!s("@"+u)&&s("@"+n.prefix+u)&&n.atrules.push(a)}e.removeChild(i)})();n.valueProperties=["transition","transition-property"];e.className+=" "+n.prefix;StyleFix.register(n.prefixCSS)})(document.documentElement);

	if(window.$){
		(function(){var e=!1,n="animation",t=prefix="",i=["Webkit","Moz","O","ms","Khtml"];$(document).ready(function(){var o=document.body.style;if(void 0!==o.animationName&&(e=!0),e===!1)for(var a=0;a<i.length;a++)if(void 0!==o[i[a]+"AnimationName"]){prefix=i[a],n=prefix+"Animation",t="-"+prefix.toLowerCase()+"-",e=!0;break}});var o=function(e,n){return $.keyframe.debug&&console.log(e+" "+n),$("<style>"+n+"</style>").attr({"class":"keyframe-style",id:e,type:"text/css"}).appendTo("head")};$.keyframe={debug:!1,getVendorPrefix:function(){return t},isSupported:function(){return e},generate:function(e){var i=e.name||"",a="@"+t+"keyframes "+i+" {";for(var r in e)if("name"!==r&&"media"!==r&&"complete"!==r){a+=r+" {";for(var s in e[r])a+=s+":"+e[r][s]+";";a+="}"}window.PrefixFree?a=PrefixFree.prefixCSS(a+"}"):a+="}",e.media&&(a="@media "+e.media+"{"+a+"}");var f=$("style#"+e.name);if(f.length>0){f.html(a);var l=$("*").filter(function(){return this.style[n+"Name"]===i});l.each(function(){var e=$(this),n=e.data("keyframeOptions");e.resetKeyframe(function(){e.playKeyframe(n)})})}else o(i,a)},define:function(e){if(e.length)for(var n=0;n<e.length;n++){var t=e[n];this.generate(t)}else this.generate(e)}};var a="animation-play-state",r="running";$.fn.resetKeyframe=function(e){$(this).css(t+a,r).css(t+"animation","none");e&&setTimeout(e,1)},$.fn.pauseKeyframe=function(){$(this).css(t+a,"paused")},$.fn.resumeKeyframe=function(){$(this).css(t+a,r)},$.fn.playKeyframe=function(e,n){var i=function(e){return e=$.extend({duration:"0s",timingFunction:"ease",delay:"0s",iterationCount:1,direction:"normal",fillMode:"forwards"},e),[e.name,e.duration,e.timingFunction,e.delay,e.iterationCount,e.direction,e.fillMode].join(" ")},o="";if($.isArray(e)){for(var s=[],f=0;f<e.length;f++)s.push("string"==typeof e[f]?e[f]:i(e[f]));o=s.join(", ")}else o="string"==typeof e?e:i(e);var l=t+"animation",m=["webkit","moz","MS","o",""];!n&&e.complete&&(n=e.complete);var c=function(e,n,t){for(var i=0;i<m.length;i++){m[i]||(n=n.toLowerCase());var o=m[i]+n;e.off(o).on(o,t)}};return this.each(function(){var i=$(this).addClass("boostKeyframe").css(t+a,r).css(l,o).data("keyframeOptions",e);if($.keyframe.debug){console.group(),t&&console.log("Vendor Prefix: "+t),console.log("Style Applied: "+o);var s=i.css(l);console.log("Rendered Style: "+(s?s:i[0].style.animation)),console.groupEnd()}n&&(c(i,"AnimationIteration",n),c(i,"AnimationEnd",n))}),this},o("boost-keyframe"," .boostKeyframe{"+t+"transform:scale3d(1,1,1);}")}).call(this);
	}

	module.exports = {
		styleFix:StyleFix,
		prefixFree:PrefixFree
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var fixer = __webpack_require__(3)

	function addMark(scene, imgURL, position, callback, keyframes, animation) {
	    var img = loadImage(imgURL)
	    var container = document.createElement('div')
	    container.appendChild(img)
	    img = container
	    img.className = 'css3d-slice css3d-sprite'
	    var radius = position[0] / scene.imageSize[0] * 360
	    var offset = position[1] - scene.imageSize[1] / 2
	    var transformBase = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -radius + 'deg) translate3d(0,' + offset + 'px,' + -scene.r * .9 + 'px)'
	    img.style['WebkitTransform'] = transformBase
	    img.style.transform = transformBase
	    scene.container.appendChild(img)
	    img.onload = function() {
	    	if(img.loaded)return;
	    	img.loaded = true
	        var canvas = document.createElement('canvas')
	        canvas.width = img.width
	        canvas.height = img.height
	        var ctx = canvas.getContext('2d')
	        ctx.drawImage(img, 0, 0)
	        img.src = canvas.toDataURL()
	        // img.style.width7 = img.width + 'px'
	        // img.style.height = img.height + 'px'
	    }
	    img.onclick = callback
	    if (window.$ && window.$.keyframe) {
	        createAnimation(transformBase, keyframes)
	        applyAnimation(img, animation)
	    }
	    return img
	}

	function createAnimation(base, keyframes) {
	    for (var i in keyframes) {
	        if (i != 'name') {
	            var keyframe = keyframes[i]
	            if (keyframe.transform) {
	                keyframe.transform = base + ' ' + keyframe.transform
	            }
	            if (keyframe['-webkit-transform']) {
	                keyframe['-webkit-transform'] = base + ' ' + keyframe['-webkit-transform']
	            }
	        }
	    }
	    $.keyframe.define(keyframes)
	}

	function applyAnimation(target, animationConfig) {
	    $(target).playKeyframe(animationConfig)
	}

	function loadImage(url) {
	    var img = new Image()
	    img.crossOrigin = "Anonymous"
	    if (/blob/i.test(url) || /base64/i.test(url)) {
	        img.src = url
	    } else {
	        img.src = ((/\?/.test(url) ? url + '&' : url + '?') + btoa(window.location.origin) + Math.random().toFixed(3) + Date.now()).replace('http:', '')
	    }
	    return img
	}

	module.exports = addMark

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var fixer = __webpack_require__(3)
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();
	function DeviceOrientationController(target, depth, noInterpolation, scaler) {
	    this.target = target;
	    this.useQuaternion = !noInterpolation;
	    this.scaler = scaler;
	    this.alphaOffset = 0;
	    this.depth = depth || target.offsetWidth;
	    this.m = {
	        curMatrix: null,
	        preMatrix: null
	    }
	    this.q = {
	        targetQuaternion: null,
	        curQuaternion: null,
	        preQuaternion: null
	    }
	}

	DeviceOrientationController.prototype = {
	    init: function() {
	        var self = this;
	        if (this.useQuaternion) {
	            window.addEventListener('deviceorientation', function(e) {
	                e = self.scaler ? self.scaler(e) : e
	                self.e = e
	                self.q.targetQuaternion = getQuaternionFromEuler((e.beta /*/ 6 + 75*/ ) / 180 * Math.PI, -e.gamma / 180 * Math.PI, (e.alpha + self.alphaOffset) / 180 * Math.PI)
	            });
	            this.animate()
	        } else {
	            window.addEventListener('deviceorientation', function(e) {
	                e = self.scaler ? self.scaler(e) : e
	                self.e = e
	                var _matrix = makeRotationFromEuler((e.beta /*/ 6 + 75*/ ) / 180 * Math.PI, -e.gamma / 180 * Math.PI, (e.alpha + self.alphaOffset) / 180 * Math.PI, self.depth * .9)
	                self.target.style.transform = self.target.style['WebkitTransform'] = self.m.curMatrix = 'matrix3d(' + _matrix.join(',') + ')'
	            });
	        }
	        this.addTouch()
	    },
	    addTouch: function() {
	        var self = this
	        var width = this.target.offsetWidth
	        var position
	        document.addEventListener('touchstart', handleStart)
	        document.addEventListener('touchmove', handleMove)

	        function handleStart(e) {
	            var touch = e.changedTouches[0]
	            position = [touch.pageX, touch.pageY]
	        }

	        function handleMove(e) {
	            var touch = e.changedTouches[0]
	            var _position = [touch.pageX, touch.pageY]
	            // var offsetD = Math.abs(self.e.gamma) < 45 ? (position[0] - _position[0]) : (position[1] - _position[1]) * -Math.abs(self.e.gamma)/self.e.gamma
	            var offsetD = position[0] - _position[0]
	            position = _position
	            self.alphaOffset -= offsetD / width * 45
	            e.preventDefault();
	        }
	    },
	    animate: function() {
	        var self = this
	        frame()

	        function frame() {
	            requestAnimationFrame(frame)
	            if (!self.q.curQuaternion) {
	                self.q.curQuaternion = self.q.targetQuaternion
	                return;
	            }
	            self.q.curQuaternion = slerp(self.q.curQuaternion, self.q.targetQuaternion, 1 / 6)
	            var _matrix = makeRotationFromQuaternion(self.q.curQuaternion, self.depth * .9)
	            self.target.style.transform = self.target.style['WebkitTransform'] = 'matrix3d(' + _matrix.join(',') + ')'
	        }
	    }
	}

	function TouchController(target, depth) {
	    this.target = target
	    this.alpha = 0;
	    this.beta = 90;
	    this.depth = depth || 1000;
	    this.q = {
	        targetQuaternion: null,
	        curQuaternion: null,
	        preQuaternion: null
	    }
	}
	TouchController.prototype = {
	    init: function() {
	        this.addTouch()
	        this.animate()
	    },
	    addTouch: function() {
	        var self = this
	        var width = this.target.offsetWidth
	        var height = this.target.offsetHeight
	        var position
	        document.addEventListener('touchstart', handleStart)
	        document.addEventListener('touchmove', handleMove)

	        function handleStart(e) {
	            var touch = e.changedTouches[0]
	            position = [touch.pageX, touch.pageY]
	        }

	        function handleMove(e) {
	            var touch = e.changedTouches[0]
	            var _position = [touch.pageX, touch.pageY]
	            var offsetX = position[0] - _position[0]
	            var offsetY = position[1] - _position[1]
	            position = _position
	            self.alpha -= offsetX / width * 45
	            self.beta -= offsetY / height * 45
	            self.beta = self.beta > 179 ? 179 : self.beta < 1 ? 1 : self.beta
	            e.preventDefault();
	        }
	    },
	    animate: function() {
	        var self = this
	        var step = 1;
	        frame()

	        function frame() {
	            requestAnimationFrame(frame)
	            self.q.targetQuaternion = getQuaternionFromEuler(self.beta / 180 * Math.PI, 0, self.alpha / 180 * Math.PI)
	            if (!self.q.curQuaternion) {
	                self.q.curQuaternion = self.q.targetQuaternion
	            }
	            self.q.curQuaternion = slerp(self.q.curQuaternion, self.q.targetQuaternion, step / 6)
	            var _matrix = makeRotationFromQuaternion(self.q.curQuaternion, self.depth * .9)
	            self.target.style.transform = self.target.style['WebkitTransform'] = 'matrix3d(' + _matrix.join(',') + ')'
	        }
	    }
	}


	module.exports = {
	    DeviceOrientationController: DeviceOrientationController,
	    TouchController: TouchController
	}























	function getQuaternion(matrix) {
	    var q = {}
	    var te = matrix,
	        m11 = te[0],
	        m12 = te[4],
	        m13 = te[8],
	        m21 = te[1],
	        m22 = te[5],
	        m23 = te[9],
	        m31 = te[2],
	        m32 = te[6],
	        m33 = te[10],
	        trace = m11 + m22 + m33,
	        s;
	    if (trace > 0) {
	        s = 0.5 / Math.sqrt(trace + 1.0);
	        q._w = 0.25 / s;
	        q._x = (m32 - m23) * s;
	        q._y = (m13 - m31) * s;
	        q._z = (m21 - m12) * s;
	    } else if (m11 > m22 && m11 > m33) {
	        s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
	        q._w = (m32 - m23) / s;
	        q._x = 0.25 * s;
	        q._y = (m12 + m21) / s;
	        q._z = (m13 + m31) / s;
	    } else if (m22 > m33) {
	        s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
	        q._w = (m13 - m31) / s;
	        q._x = (m12 + m21) / s;
	        q._y = 0.25 * s;
	        q._z = (m23 + m32) / s;
	    } else {
	        s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
	        q._w = (m21 - m12) / s;
	        q._x = (m13 + m31) / s;
	        q._y = (m23 + m32) / s;
	        q._z = 0.25 * s;

	    }
	    return q;
	}

	function slerp(qa, qb, t) {
	    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
	    if (t === 0) return qa;
	    if (t === 1) return qb;
	    var x = qa._x,
	        y = qa._y,
	        z = qa._z,
	        w = qa._w;
	    var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
	    if (cosHalfTheta < 0) {
	        qa._w = -qb._w;
	        qa._x = -qb._x;
	        qa._y = -qb._y;
	        qa._z = -qb._z;
	        cosHalfTheta = -cosHalfTheta;
	    } else {
	        qa = qb;
	    }
	    if (cosHalfTheta >= 1.0) {
	        qa._w = w;
	        qa._x = x;
	        qa._y = y;
	        qa._z = z;
	        return qa;
	    }
	    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
	    if (Math.abs(sinHalfTheta) < 0.001) {
	        qa._w = 0.5 * (w + qa._w);
	        qa._x = 0.5 * (x + qa._x);
	        qa._y = 0.5 * (y + qa._y);
	        qa._z = 0.5 * (z + qa._z);
	        return qa;
	    }
	    var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
	    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
	        ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
	    qa._w = (w * ratioA + qa._w * ratioB);
	    qa._x = (x * ratioA + qa._x * ratioB);
	    qa._y = (y * ratioA + qa._y * ratioB);
	    qa._z = (z * ratioA + qa._z * ratioB);
	    return qa;
	}

	function getQuaternionFromEuler(x, y, z) {
	    // http://www.mathworks.com/matlabcentral/fileexchange/
	    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
	    //	content/SpinCalc.m
	    var q = {}
	    var cos = Math.cos;
	    var sin = Math.sin;
	    var c1 = cos(x / 2);
	    var c2 = cos(y / 2);
	    var c3 = cos(z / 2);
	    var s1 = sin(x / 2);
	    var s2 = sin(y / 2);
	    var s3 = sin(z / 2);
	    q._x = s1 * c2 * c3 + c1 * s2 * s3;
	    q._y = c1 * s2 * c3 - s1 * c2 * s3;
	    q._z = c1 * c2 * s3 - s1 * s2 * c3;
	    q._w = c1 * c2 * c3 + s1 * s2 * s3;
	    return q;
	}

	function makeRotationFromEuler(x, y, z, depth) {
	    var te = [];
	    var a = Math.cos(x),
	        b = Math.sin(x);
	    var c = Math.cos(y),
	        d = Math.sin(y);
	    var e = Math.cos(z),
	        f = Math.sin(z);
	    var ce = c * e,
	        cf = c * f,
	        de = d * e,
	        df = d * f;
	    te[0] = ce + df * b;
	    te[4] = de * b - cf;
	    te[8] = a * d;
	    te[1] = a * f;
	    te[5] = a * e;
	    te[9] = -b;
	    te[2] = cf * b - de;
	    te[6] = df + ce * b;
	    te[10] = a * c;
	    // last column
	    te[3] = 0;
	    te[7] = 0;
	    te[11] = 0;
	    // bottom row
	    te[12] = 0;
	    te[13] = 0;
	    te[14] = depth; // translateZ
	    te[15] = 1;
	    return te;
	}

	function makeRotationFromQuaternion(q, depth) {
	    var te = [];
	    var x = q._x,
	        y = q._y,
	        z = q._z,
	        w = q._w;
	    var x2 = x + x,
	        y2 = y + y,
	        z2 = z + z;
	    var xx = x * x2,
	        xy = x * y2,
	        xz = x * z2;
	    var yy = y * y2,
	        yz = y * z2,
	        zz = z * z2;
	    var wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	    te[0] = 1 - (yy + zz);
	    te[4] = xy - wz;
	    te[8] = xz + wy;
	    te[1] = xy + wz;
	    te[5] = 1 - (xx + zz);
	    te[9] = yz - wx;
	    te[2] = xz - wy;
	    te[6] = yz + wx;
	    te[10] = 1 - (xx + yy);
	    // last column
	    te[3] = 0;
	    te[7] = 0;
	    te[11] = 0;
	    // bottom row
	    te[12] = 0;
	    te[13] = 0;
	    te[14] = depth; //translateZ
	    te[15] = 1;
	    return te;
	}

/***/ })
/******/ ]);