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

	function getRandoms(n) {
	    if (!n) return [0]
	    var arr = new Array(n)
	    var i = Math.floor(Math.random() * n)
	    i = n - 1
	    for (; i < n + 1; i++) {
	        arr[i] = (true)
	    }
	    var temp
	    for (var i = arr.length - 1; i > 0; i--) {
	        var ri = Math.floor(Math.random() * i)
	        temp = arr[i]
	        arr[i] = arr[ri]
	        arr[ri] = temp
	    }
	    return arr.map((v, i) => v ? i : -1).filter(v => v > -1)
	}

	function init() {
	    var nodeCount = 10
	    canvas.selectAll('*').remove();
	    var p = getPoints()
	    var f = d3.forceSimulation(p)
	    f.stop()
	    var _l = getLinks()
	    var l = d3.forceLink(_l)
	    l.distance(100)
	    var c = d3.forceCenter(0, 0)
	    var g = d3.forceManyBody()
	    g.strength(-300)
	    f.force('link', l)
	        .force('charge', g)
	        .force('center', c)
	    f.restart()
	    f.on('tick', v => {
	        drawLinks()
	        drawNodes()
	    })
	    f.on('end', v => split(p))
	    var links = canvas.append('g').selectAll('line')
	        .data(_l)
	        .enter()
	        .append('line')
	        .attr('fill', 'transparent')
	        .attr('stroke', v => d3.rgb(0, 0, Math.floor(Math.random() * 256)).toString())
	        .attr('x1', d => d.source.x)
	        .attr('y1', d => d.source.y)
	        .attr('x2', d => d.target.x)
	        .attr('y2', d => d.target.y)
	        .attr('stroke-width', 5)
	    var nodes = canvas.append('g').selectAll('circle')
	        .data(p)
	        .enter()
	        .append('circle')
	        .attr('cx', d => d.x)
	        .attr('cy', d => d.y)
	        .attr('r', 10)
	        .attr('stroke', 'transparent')
	        .attr('fill', v => d3.rgb(255, Math.floor(Math.random() * 256), 0).toString())




	    function drawNodes() {
	        nodes.attr('cx', d => d.x)
	            .attr('cy', d => d.y)
	    }

	    function drawLinks() {
	        links.attr('x1', d => d.source.x)
	            .attr('y1', d => d.source.y)
	            .attr('x2', d => d.target.x)
	            .attr('y2', d => d.target.y)
	    }

	    function getPoints() {
	        var points = []
	        for (var i = 0; i < nodeCount; i++) {
	            points.push({
	                x: Math.random() * width,
	                y: Math.random() * height
	            })
	        }
	        return points
	    }



	    function getLinks() {
	        var links = []
	        for (var i = 1; i < nodeCount; i++) {
	            var sources = getRandoms(i)
	            for (var j = 0; j < sources.length; j++) {
	                links.push({
	                    source: sources[j],
	                    target: i,
	                })
	            }
	        }
	        return links
	    }
	}
	// init()

	function init2() {
	    var nodeCount = 10
	    var distance = 90
	    canvas.selectAll('*').remove();
	    var p = getPoints()
	    var f = d3.forceSimulation(p)
	    f.stop()
	    var _l = getLinks()
	    var l = d3.forceLink(_l)
	    l.distance(100)
	    var c = d3.forceCenter(0, 0)
	    var g = d3.forceManyBody()
	    g.strength(-10)
	    f.force('link', l)
	        .force('charge', g)
	        .force('center', c)
	    f.restart()
	    f.on('tick', v => {
	        drawLinks()
	        drawNodes()
	    })
	    f.on('end', v => split(p))
	    var links = canvas.append('g').selectAll('line')
	        .data(_l)
	        .enter()
	        .append('line')
	        .attr('fill', 'transparent')
	        .attr('stroke', v => d3.rgb(0, 0, Math.floor(Math.random() * 256)).toString())
	        .attr('x1', d => d.source.x)
	        .attr('y1', d => d.source.y)
	        .attr('x2', d => d.target.x)
	        .attr('y2', d => d.target.y)
	        .attr('stroke-width', 5)
	    var nodes = canvas.append('g').selectAll('circle')
	        .data(p)
	        .enter()
	        .append('circle')
	        .attr('cx', d => d.x)
	        .attr('cy', d => d.y)
	        .attr('r', 10)
	        .attr('stroke', 'transparent')
	        .attr('fill', v => d3.rgb(255, Math.floor(Math.random() * 256), 0).toString())




	    function drawNodes() {
	        nodes.attr('cx', d => d.x)
	            .attr('cy', d => d.y)
	    }

	    function drawLinks() {
	        links.attr('x1', d => d.source.x)
	            .attr('y1', d => d.source.y)
	            .attr('x2', d => d.target.x)
	            .attr('y2', d => d.target.y)
	    }

	    function getPoints() {
	        var points = []
	        for (var i = 0; i < nodeCount; i++) {
	            for (var j = 0; j < nodeCount; j++) {
	                points.push({
	                    x: i * distance,
	                    y: j * distance
	                })
	            }
	        }
	        return points
	    }

	    function getLinks() {
	        var links = []
	        for (var i = 0; i < nodeCount; i++) {
	            for (var j = 0; j < nodeCount - 1; j++) {
	                links.push({
	                    target: i * nodeCount + j,
	                    source: i * nodeCount + j + 1
	                })
	                links.push({
	                    target: j * nodeCount + i,
	                    source: (j + 1) * nodeCount + i
	                })
	            }
	        }
	        return links
	    }
	}

	function split(p) {
	    var data = p.map(v => [v.x, v.y])
	    var smap = d3.voronoi()
	    smap.extent([
	        [-500, -500],
	        [500, 500]
	    ])
	    var map = smap(data)
	    console.log(p)
	    console.log(map)
	    var edges = map.edges
	    console.log(JSON.stringify(edges))
	    canvas.append('g').selectAll('line')
	        .data(edges)
	        .enter()
	        .append('line')
	        .attr('x1', d => d ? d[0][0] : 0)
	        .attr('y1', d => d ? d[0][1] : 0)
	        .attr('x2', d => d ? d[1][0] : 0)
	        .attr('y2', d => d ? d[1][1] : 0)
	        .attr('stroke', '#f00')
	        .attr('fill', 'transparent')
	    var mposition = {
	        x: 0,
	        y: 0
	    }
	    var mark = canvas.append('g').append('circle')
	        .datum(mposition)
	        .attr('r', 50)
	        .attr('cx', d => d.x)
	        .attr('cy', d => d.y)
	        .attr('stroke', '#0f0')
	        .attr('fill', 'transparent')
	    d3.select('.g-main').on('touchmove', e => {
	        e = d3.event
	        var position = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
	        var canvasPosition = position.map(v => v / document.documentElement.clientWidth * 1000 - 500)
	        var point = map.find(canvasPosition[0],canvasPosition[1])
	        console.log(point)
	        mposition.x = point[0]
	        mposition.y = point[1]
	        mark.attr('cx', d => d.x)
	            .attr('cy', d => d.y)
	    })
	}
	init()

/***/ })
/******/ ]);