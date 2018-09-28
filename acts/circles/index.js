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
	    .attr('viewBox', '0,0,' + width + ',' + height + '')
	    .style('width', dwidth)
	    .style('height', dwidth)
	    .append('g')
	    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
	    .append('g')

	function zoomed() {
	    var tr = (d3.zoomTransform(this))
	    canvas.attr("transform", "scale(" + tr.k + ")");
	}

	function circleBondary(r, x, y) {
	    return {
	        r: r,
	        x: x,
	        y: y
	    }
	}

	function circlePalatte(r, bondary) {
	    return {
	        r: r,
	        initDegree: 0,
	        bondary: bondary,
	        degree: 0,
	        getAbsolutePosition: function() {
	            var b = this.bondary
	            var r = b.r - this.r
	            return {
	                x: Math.cos(this.degree + this.initDegree) * r + b.x,
	                y: -Math.sin(this.degree + this.initDegree) * r + b.y
	            }
	        }
	    }
	}

	function pathPainter(r, d, c) {
	    return {
	        r: r,
	        d: d || 0,
	        palatte: c,
	        points: [],
	        getPath: function() {
	            return this.points.map(v => `L${v.x} ${v.y}`).join('').replace('L', 'M') + 'z'
	        },
	        getAbsolutePosition: function() {
	            var b = this.palatte.bondary
	            var p = this.palatte
	            var pr = b.r - p.r
	            var pp = {
	                x: Math.cos(p.degree + p.initDegree) * pr + b.x,
	                y: -Math.sin(p.degree + p.initDegree) * pr + b.y
	            }

	            var rotation = -p.degree * b.r / p.r + p.degree + this.d

	            var ppp = {
	                x: Math.cos(rotation) * this.r + pp.x,
	                y: -Math.sin(rotation) * this.r + pp.y
	            }
	            return ppp
	        },
	        drawf: function() {
	            this.points.push(this.getAbsolutePosition())
	            return this.getPath()
	        },
	        draw: function() {
	            this.points.push(this.getAbsolutePosition())
	        }
	    }
	}

	function minP(a, b) {
	    var max = Math.max(a, b)
	    var min = Math.min(a, b)
	    var c = max,
	        d = min
	    while (d > 0) {
	        min = c % d
	        max = d
	        c = max
	        d = min
	    }
	    return a * b / c
	}

	function test() {
	    var b = circleBondary(400, 0, 0)
	    var c = circlePalatte(210, b)
	    var maxRotation = minP(b.r, c.r) / b.r * Math.PI * 2
	    var bs = canvas.append('g')
	        .datum(b)
	        .append('circle')
	        .attr('cx', b => b.x)
	        .attr('cy', b => b.y)
	        .attr('r', b => b.r)
	        .attr('fill', 'transparent')
	        .attr('stroke', '#000')

	    var cs = canvas.append('g')
	        .datum(c)
	    var _cs = cs.append('circle')
	        .attr('cx', b => b.getAbsolutePosition().x)
	        .attr('cy', b => b.getAbsolutePosition().y)
	        .attr('r', b => b.r)
	        .attr('fill', '#000')
	        .attr('opacity', 0.1)


	    var ps = canvas.append('g')
	        .datum(c)
	        .append('path')
	        .attr('fill', '#00f')
	        .attr('fill-rule', 'evenodd')
	        .attr('stroke', '#f00')
	    var _cl = cs.append('path')
	        .attr('fill', 'transparent')
	        .attr('stroke', '#f00')

	    var pr1 = c.r,
	        p

	    function f2() {
	        pr1--
	        if (pr1 < 2) return
	        p = pathPainter(pr1, Math.PI / 2, c)
	        show()
	    }
	    setInterval(f2,100)

	    function frame() {
	        c.degree += Math.PI / 180 * 10
	        requestAnimationFrame(frame)
	        _cs.attr('cx', b => b.getAbsolutePosition().x)
	            .attr('cy', b => b.getAbsolutePosition().y)
	        _cl.attr('d', v => 'M' + v.getAbsolutePosition().x + ' ' + v.getAbsolutePosition().y + 'L' + p.getAbsolutePosition().x + ' ' + p.getAbsolutePosition().y)
	        if (c.degree > maxRotation + Math.PI / 180 * 10) return;
	        ps.attr('d', p.drawf())
	    }

	    function show() {
	        c.degree = 0;
	        while (c.degree < maxRotation + Math.PI / 180 * 10) {
	            c.degree += Math.PI / 180 * 10
	            p.draw()
	        }
	        ps.attr('d', p.getPath())
	    }
	}
	test()

/***/ })
/******/ ]);