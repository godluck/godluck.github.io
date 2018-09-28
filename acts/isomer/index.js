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
	    ctx.translate(500, 500)
	    iso.translate3d(...c)
	    iso.rotateZ(c.degree)
	    ctx.beginPath()

	    iso.moveTo(+0.5, -0.5, +0.5);
	    iso.lineTo(+0.5, +0.5, +0.5);
	    iso.lineTo(-0.5, +0.5, +0.5);
	    iso.lineTo(-0.5, +0.5, -0.5);
	    iso.lineTo(-0.5, -0.5, -0.5);
	    iso.lineTo(+0.5, -0.5, -0.5);
	    ctx.lineWidth = 2
	    ctx.closePath()
	    ctx.stroke()

	    ctx.beginPath()

	    iso.moveTo(-0.5, -0.5, +0.5);
	    iso.lineTo(+0.5, -0.5, +0.5);
	    iso.moveTo(-0.5, -0.5, +0.5);
	    iso.lineTo(-0.5, +0.5, +0.5);
	    iso.moveTo(-0.5, -0.5, +0.5);
	    iso.lineTo(-0.5, -0.5, -0.5);
	    ctx.lineWidth = 1
	    ctx.closePath()
	    ctx.stroke()

	    ctx.restore()
	    iso.restore()
	}

	function getPositions() {
	    var colum = 5;
	    var row = 5;
	    var ps = []
	    for (var i = 0; i < colum; i++) {
	        for (var j = 0; j < row; j++) {
	            ps.push([i * 2, j * 2])
	        }
	    }
	    return ps
	}

	function init() {
	    getPositions().map(v => [v[0], v[1], 0]).sort((a, b) => a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]).map((v, i) => {
	        v.degree = i * Math.PI / 2 / 24
	        v.degree = v.degree % (Math.PI / 2) - Math.PI / 4
	        console.log(i)
	        return v
	    }).forEach(drawCubeAt)
	}

	function init2() {
	    var cube = [0, 0, 0]
	    cube.degree = -Math.PI / 4;

	    function frame() {
	        cube.degree += Math.PI / 180 / 2
	        cube.degree = cube.degree > Math.PI / 4 ? -Math.PI / 4 : cube.degree
	        ctx.clearRect(0, 0, width, width)
	        drawCubeAt(cube)
	        requestAnimationFrame(frame)
	    }
	    frame()
	}

	function init3() {
	    var cubes = getPositions().map((v, i) => {
	        v.f = i * 5
	        v.push(0)
	        return v
	    })

	    function animateDegree(c) {
	        var r = (c.f % 180) / 45
	        var f = Math.floor(r)
	        switch (f) {
	            case 0:
	                c.degree = r * Math.PI / 4 - Math.PI / 4
	                break;
	            case 1:
	                c.degree = 0;
	                break;
	            case 2:
	                c.degree = 0;
	                break;
	            case 3:
	                c.degree = (r - 3) * Math.PI / 4
	                break;
	        }
	    }

	    function frame() {
	        ctx.clearRect(0, 0, width, width)
	        cubes.forEach(cube => {
	            cube.f++;
	            animateDegree(cube)
	            drawCubeAt(cube)
	        })
	        requestAnimationFrame(frame)
	    }
	    frame()
	}
	init3()





	var canvas = d3.select('.curve')
	    .call(zoom.on('zoom', zoomed))
	    .attr('viewBox', '0 0 ' + width + ' ' + width)

	var curve = canvas.append('g')
	    .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ')')
	initCurve()

	function initCurve() {
	    var angles = d3.range(0, 2 * Math.PI, Math.PI / 200);
	    var x = d3.range(0, 4 * Math.PI, Math.PI / 200);
	    var t = ["cyan", "magenta", "yellow"];
	    var p = curve.selectAll('line')
	        .data(t)
	        .enter()
	        .append('path')
	        .attr("stroke", function(d) { return d; })
	        .style("mix-blend-mode", "darken")
	        .attr('fill', 'transparent')
	        .attr('stroke-width', 10)
	        .datum(function(d, i) {
	            var c = d3.radialLine()
	                .angle(d => d)
	                .radius(a => {
	                    var t = d3.now() / 1000;
	                    return 200 + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32;
	                })
	                .curve(d3.curveLinearClosed)
	            return c
	        })

	    var line = curve.selectAll('axis')
	        .data(t)
	        .enter()
	        .append('path')
	        .attr('transform', 'translate(-500,0)')
	        .attr('fill', 'transparent')
	        .attr('stroke-width', 10)
	        .style("mix-blend-mode", "darken")
	        .attr("stroke", d => {
	            console.log(d)
	            return d
	        })
	        .datum((a, i) => d3.line()
	            .x(d => d * 50)
	            .y(d => {
	                var t = d3.now() / 1000
	                return 200 + Math.cos(d * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(d - t)) / 2, 3) * 32
	            })
	            .curve(d3.curveLinear))

	    d3.timer(t => {
	        p.attr('d', d => d(angles))
	        line.attr('d', d => d(x))
	    })
	}

/***/ })
/******/ ]);