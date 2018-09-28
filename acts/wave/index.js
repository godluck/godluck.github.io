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

	var dwidth = document.documentElement.clientWidth
	var dheight = document.documentElement.clientHeight
	var width = 1000
	var height = 1000
	var basicRadius = 10;
	var zoom = d3.zoom()
	var canvas = d3.select('.canvas')
	    .call(zoom.on('zoom', zoomed))
	    .attr('width', width)
	    .attr('height', width)
	var ctx = canvas.node().getContext('2d')
	ctx.fillStyle = "#fff"
	ctx.strokeStyle = "#000"
	var iso = new isometric(ctx)
	iso.scale3d(30, 30, 30)
	console.log(iso)


	function zoomed() {
	    var tr = (d3.zoomTransform(this))
	    canvas.style("transform", "scale(" + tr.k + ")");
	}

	function drawCubeAt(c) {
	    ctx.save()
	    iso.save()
	    ctx.translate(500, 900)
	    iso.translate3d(...c)
	    iso.rotateZ(c.degree)
	    ctx.beginPath()
	    var _x = c.x || 1
	    var _y = c.y || 1
	    var _z = c.z || 1
	    iso.moveTo(+0.5 * _x, -0.5 * _y, _z);
	    iso.lineTo(+0.5 * _x, +0.5 * _y, _z);
	    iso.lineTo(-0.5 * _x, +0.5 * _y, _z);
	    iso.lineTo(-0.5 * _x, +0.5 * _y, -0.5);
	    iso.lineTo(-0.5 * _x, -0.5 * _y, -0.5);
	    iso.lineTo(+0.5 * _x, -0.5 * _y, -0.5);
	    ctx.lineWidth = 2
	    ctx.closePath()
	    ctx.stroke()
	    ctx.fill()

	    ctx.beginPath()

	    iso.moveTo(-0.5 * _x, -0.5 * _y, _z);
	    iso.lineTo(+0.5 * _x, -0.5 * _y, _z);
	    iso.moveTo(-0.5 * _x, -0.5 * _y, _z);
	    iso.lineTo(-0.5 * _x, +0.5 * _y, _z);
	    iso.moveTo(-0.5 * _x, -0.5 * _y, _z);
	    iso.lineTo(-0.5 * _x, -0.5 * _y, -0.5);
	    ctx.lineWidth = 1
	    ctx.closePath()
	    ctx.stroke()
	    ctx.fill()

	    ctx.restore()
	    iso.restore()
	}

	function getPositions() {
	    var column = 20;
	    var row = 20;
	    var ps = []
	    for (var i = 0; i < column; i++) {
	        for (var j = 0; j < row; j++) {
	            ps.push([i, j])
	        }
	    }
	    return ps
	}

	function init() {
	    var cubes = getPositions().map((v, i) => {
	        v.f = i * 5
	        v.push(0)
	        v.z = Math.floor(Math.random() * 5) + 1
	        v.direction = .08 * Math.random() + .02
	        v.degree = 0
	        return v
	    }).reverse()

	    function animateDegree(c) {
	        var r = (c.f % 180) / 45
	        var f = Math.floor(r)
	        switch (f) {
	            case 0:
	                c.degree = r * Math.PI / 8 - Math.PI / 4
	                break;
	            case 1:
	                c.degree = r * Math.PI / 8 - Math.PI / 4;
	                break;
	            case 2:
	                c.degree = (r - 2) * Math.PI / 8;
	                break;
	            case 3:
	                c.degree = (r - 2) * Math.PI / 8
	                break;
	        }
	    }

	    function frame() {
	        ctx.clearRect(0, 0, width, width)
	        moveWater(20, 20)
	        cubes.forEach((cube, i) => {
	            cube.f++;
	            cube.z = water[i]
	            if (cube.z > 10 || cube.z < 1) {
	                cube.direction = -cube.direction
	            }
	            // animateDegree(cube)
	            drawCubeAt(cube)
	        })
	        requestAnimationFrame(frame)
	    }
	    frame()
	}

	var water = buildWater(20, 20)
	var tempWater = new Array(20 * 20)
	var v = ('a').repeat(20*20-1).split('a').map(v=>0)
	var c = 1
	var _t = 1 / 10

	function buildWater(width, height) {
	    var column = width || 20;
	    var row = height || 20;
	    var ps = []
	    for (var i = 0; i < column; i++) {
	        for (var j = 0; j < row; j++) {
	            ps.push(1)
	        }
	    }
	    return ps
	}
	setInterval(function(){
	    var s= Math.floor(Math.random() * 12)
	    var t
	    switch(s%4){
	        case 0:
	        t = 0;
	        break;
	        case 1:
	        t = 19;
	        break;
	        case 2:
	        t = 19 * 20 + 19;
	        break;
	        case 3:
	        t = 19 * 20
	        break;
	    }
	    water[t] = 5
	},1000)
	function moveWater(column, row) {
	    for (var i = 0; i < column; i++) {
	        for (var j = 0; j < row; j++) {
	            var t1 = water[(i - 1) * row + j],
	                t2 = water[(i + 1) * row + j],
	                t3 = water[i * row + j + 1],
	                t4 = water[i * row + j - 1];
	            if (!(i > 0 && i < column - 1 && j > 0 && j < row - 1)) {
	                if (i < 1) { t1 = water[i * row + j] }
	                if (i > column - 2) { t2 = water[i * row + j] }
	                if (j > row - 2) { t3 = water[i * row + j] }
	                if (j < 1) { t4 = water[i * row + j] }
	            }
	            var f = c * c * (t1 + t2 + t3 + t4 - water[i * row + j] * 4) / 1 / 1
	            var _f = -.3 * v[i * row + j]
	            f += _f
	            v[i * row + j] = v[i * row + j] ? v[i * row + j] + f * _t : f * _t
	            tempWater[i * row + j] = v[i * row + j] * _t + water[i * row + j]
	            if (v[i * row + j] != v[i * row + j]) {
	                console.log(i, j)
	                console.log(water[i * row + j])
	                console.log(t1, t2, t3, t4)
	            }
	        }
	    }
	    var temp = water
	    water = tempWater
	    tempWater = temp
	}

	init()

/***/ })
/******/ ]);