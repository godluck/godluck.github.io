var dwidth = document.documentElement.clientWidth
var dheight = document.documentElement.clientHeight
var width = 1000
var height = 1000
var basicRadius = 10;
var zoom = d3.zoom()
var canvas = d3.select('.canvas')
    .call(zoom.on('zoom',zoomed))
    .attr('viewBox', '0,0,' + width + ',' + height + '')
    .style('width', dwidth)
    .style('height', dwidth)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .append('g')

function zoomed(){
    var tr = (d3.zoomTransform(this))
    canvas.attr("transform", "scale(" + tr.k + ")");
}

function gear(d) {
    var teech = d.teech;
    var R = basicRadius * teech / 3
    var fraction = Math.PI / teech
    var step = fraction * 2
    var s = ''
    var initDegree = d.initDegree - fraction / 2
    for (var i = 0; i < teech; i++) {
        var offset = initDegree + i * step
        var c_p1 = {
            x: Math.cos(offset) * R,
            y: -Math.sin(offset) * R
        }
        var c_p2 = {
            x: Math.cos(offset + fraction) * R,
            y: -Math.sin(offset + fraction) * R
        }
        var s_p = {
            x: Math.cos(offset + fraction / 2 * 3) * (R + basicRadius),
            y: -Math.sin(offset + fraction / 2 * 3) * (R + basicRadius),
        }
        var s_p1 = {
            x: Math.cos(offset + fraction / 2 * 3 - fraction / 3) * (R + basicRadius / 4 * 3),
            y: -Math.sin(offset + fraction / 2 * 3 - fraction / 3) * (R + basicRadius / 4 * 3),
        }
        var s_p2 = {
            x: Math.cos(offset + fraction / 2 * 3 + fraction / 3) * (R + basicRadius / 4 * 3),
            y: -Math.sin(offset + fraction / 2 * 3 + fraction / 3) * (R + basicRadius / 4 * 3),
        }
        s += 'L' + c_p1.x + ' ' + c_p1.y
        s += 'L' + c_p2.x + ' ' + c_p2.y
        s += 'L' + s_p1.x + ' ' + s_p1.y
        s += 'L' + s_p.x + ' ' + s_p.y
        s += 'L' + s_p2.x + ' ' + s_p2.y
    }
    s += 'z'
    return s.replace('L', 'M')
}

function generateGearData(t, d, x, y, c) {
    var g = { initDegree: d || 0, teech: t || 3, x: x || 0, y: y || 0, c: !!c }
    var r = basicRadius * t / 3;
    g.bondingRect = {
        t: basicRadius + y - r + height / 2,
        b: basicRadius + y + r + height / 2,
        l: basicRadius + x - r + width / 2,
        r: basicRadius + x + r + width / 2
    }
    return g
}

function attachGear(gear1, gear2, direction) {
    var offset = (direction || 0) % gear1.teech;
    var degree = Math.PI * 2 / gear1.teech * (offset + 0.5) + gear1.initDegree
    gear2.initDegree = degree + Math.PI

    var distance = basicRadius * gear1.teech / 3 + basicRadius * gear2.teech / 3 + basicRadius
    gear2.x = gear1.x + distance * Math.cos(degree)
    gear2.y = gear1.y - distance * Math.sin(degree)
    gear2.c = !gear1.c
    var r = basicRadius * gear2.teech / 3;
    gear2.bondingRect = {
        t: basicRadius + gear2.y - r + height / 2,
        b: basicRadius + gear2.y + r + height / 2,
        l: basicRadius + gear2.x - r + width / 2,
        r: basicRadius + gear2.x + r + width / 2
    }
}

function addGear(data, fcolor, scolor) {
    var hit = hitTest(data)
    if (hit) {
        registerGear(data)
    } else {
        return false;
    }
    var rdmColor = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
    canvas.append('g')
        .datum(data)
        .attr('transform', v => 'translate(' + v.x + ',' + v.y + ')')
        .append('path')
        .attr('d', gear)
        .attr('fill', fcolor || rdmColor)
        .attr('stroke', scolor || fcolor || rdmColor)
        // .attr('class', d => d.c ? 'clockwise' : 'anticlockwise')
        .style('animation', d => (d.c ? 'clockr' : 'aclockr') + ' ' + (.3 * d.teech) + 's linear infinite')
    return true;
}
var areaSetting = {
    width: width / 10,
    height: height / 10,
    wc: 10,
    hc: 10
}
var areas = []

function registerGear(g) {
    var aRect = {
        t: Math.floor(g.bondingRect.t / areaSetting.height),
        b: Math.floor(g.bondingRect.b / areaSetting.height),
        l: Math.floor(g.bondingRect.l / areaSetting.width),
        r: Math.floor(g.bondingRect.r / areaSetting.width)
    }
    for (var i = aRect.t; i < aRect.b + 1; i++) {
        for (var j = aRect.l; j < aRect.r + 1; j++) {
            var index = (i * areaSetting.wc + j)
            if (!areas[index]) {
                areas[index] = [g]
            } else {
                areas[index].push(g)
            }
        }
    }
}

function hitTest(g) {
    var e = 1e-5
    var aRect = {
        t: Math.floor(g.bondingRect.t / areaSetting.height),
        b: Math.floor(g.bondingRect.b / areaSetting.height),
        l: Math.floor(g.bondingRect.l / areaSetting.width),
        r: Math.floor(g.bondingRect.r / areaSetting.width)
    }
    var areaList = []
    for (var i = aRect.t; i < aRect.b + 1; i++) {
        for (var j = aRect.l; j < aRect.r + 1; j++) {
            areaList.push(i * areaSetting.wc + j)
        }
    }
    var _gs = new Set()
    for (var i = 0; i < areaList.length; i++) {
        var gs = areas[areaList[i]]
        if (!gs) continue;
        for (var j = 0; j < gs.length; j++) {
            _gs.add(gs[j])
        }
    }
    for (var _g of _gs.values()) {
        var d = Math.sqrt(Math.pow((_g.x - g.x), 2) + Math.pow((_g.y - g.y), 2))
        if (d + e < (_g.teech + g.teech) * basicRadius / 3 + basicRadius) {
            return false
        }
        if ((_g.c == g.c) && (d + e < (_g.teech + g.teech) * basicRadius / 3 + 2 * basicRadius)) {
            console.log(1)
            return false;
        }
    }
    return true;
}

function test() {
    var g = generateGearData(100, 0, 0, 0)
    addGear(g, 'transparent', '#f00')
    for (var i = 0; i < 100; i++) {
        var gn = generateGearData(10)
        attachGear(g, gn, i)
        addGear(gn)
        // g = gn
    }
}

function test2() {
    var gs = []
    var g = generateGearData(10, 0, 0, 0)
    addGear(g, 'transparent', '#000')
    gs.push(g)
    for (var i = 0; i < 100; i++) {
        var gr = generateGearData(Math.floor(Math.random() * 30) + 6)
        attachGear(gs[Math.floor(Math.random() * gs.length)], gr, Math.floor(Math.random() * gr.teech))
        if (addGear(gr)) {
            gs.push(gr)
        } else {
            i--
        }
    }
}

test2()