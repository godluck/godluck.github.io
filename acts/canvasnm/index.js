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
/***/ (function(module, exports) {

	var canvas = $('canvas')[0]
	var ctx = canvas.getContext('2d')
	var datas = ctx.createImageData(600, 600)
	var rgb = datas.data

	var ocanvas = $('canvas')[1]
	var octx = ocanvas.getContext('2d')
	var normals, bases,heights
	$('.base').on('load', function(e) {
	    ctx.drawImage(this, 0, 0, 600, 600)
	    bases = ctx.getImageData(0, 0, 600, 600).data
	})
	$('img').each(function(i, v) {
	    v.src = v.className + '.png'
	})
	$('.nm').on('load', function(e) {
	    octx.drawImage(this, 0, 0, 600, 600)
	    normals = octx.getImageData(0, 0, 600, 600).data
	})
	$('.hm').on('load', function(e) {
	    octx.drawImage(this, 0, 0, 600, 600)
	    heights = octx.getImageData(0, 0, 600, 600).data
	})
	bindEvents()
	function bindEvents() {
	    $(canvas).on({
	        touchstart: addLight,
	        touchmove: addLight,
	        touchend: removeLight,
	        touchcancel: removeLight,
	    })
	}

	function removeLight() {
	    ctx.clearRect( 0, 0, 600, 600)
	}

	function addLight(e) {
	    var hasHeight = $('input')[0].checked
	    console.log(hasHeight)
	    var touch = e.changedTouches[0]
	    var p = {
	        x: touch.pageX,
	        y: touch.pageY
	    }
	    for (var i = 0; i < 600; i++) {
	        for (var j = 0; j < 600; j++) {
	            var index = i + j * 600;
	            var position = index * 4;
	            var r = bases[position],
	                g = bases[position + 1],
	                b = bases[position + 2]
	            var lv = [p.x - i, p.y - j,hasHeight ? 50 + heights[position] : 305]
	            var normal = [
	                normals[position],
	                normals[position + 1],
	                normals[position + 2],
	            ]
	            var lightStrength = Math.max(dot(normalize(normal), normalize(lv)), 0)
	            rgb[position] = 255 * lightStrength
	            rgb[position + 1] = 255 * lightStrength
	            rgb[position + 2] = 255 * lightStrength
	            rgb[position + 3] = 255
	        }
	    }
	    // console.log(lv)
	    var index = 4 * (p.x + p.y * 600);
	    // console.log(rgb[index + 0], rgb[index + 1], rgb[index + 2], rgb[index + 3])
	    // console.log(bases[index + 0], bases[index + 1], bases[index + 2], bases[index + 3])
	    // console.log(normals[index + 0], normals[index + 1], normals[index + 2], normals[index + 3])
	    ctx.putImageData(datas, 0, 0)
	}

	function dot(v1, v2) {
	    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
	}

	function normalize(v) {
	    var length = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2))
	    return [v[0] / length, v[1] / length, v[2] / length]
	}

/***/ })
/******/ ]);