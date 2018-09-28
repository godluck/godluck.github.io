var canvas = $('.p')[0]
var ctx = canvas.getContext('2d')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientWidth

var pos = []
var center = [canvas.width / 2, canvas.height / 2]
var framec = 0;
var initLocation = [10, 10, 10, 10, 10, 10]

var viewDegree = 90
var depth = document.documentElement.clientWidth / 2;
var steps = 100;
var bgs = [];
var maxBG = depth / Math.tan(viewDegree / 2 / 180 * Math.PI) * 2
var field = 10
var speed = 10
for (var i = steps + 1; i > 1; i--) {
    var _depth = depth / steps * i;
    var _bgSize = _depth / Math.tan(viewDegree / 2 / 180 * Math.PI) * 2
    bgs.push(Math.round(_bgSize))
}

function getDistanceAtLayer(i, d) {
    var _bgSize = bgs[i]
    return d / _bgSize * maxBG
}

function renderOnce() {
    var bgps = []
    for (var i = 0; i < steps; i++) {
        var d = getDistanceAtLayer(i, field)
        var p = generatePolygon(center, [d, d, d, d, d, d])
        bgps.push(p)
    }
    renderPolygons(ctx, bgps, '#ccc')
    var data = canvas.toDataURL()
    canvas.style.backgroundImage = 'url(' + data + ')'

    for (var i = 0; i < steps; i += speed) {
        var d = getDistanceAtLayer(i, field)
        var p = generatePolygon(center, [d, d, d, d, d, d])
        pos.push(p)
    }
}

function move() {
    // framec++
    pos.forEach((p, i) => {
        var d = getDistanceAtLayer(i * speed + framec % speed, field)
        // console.log(d)
        movePolygon(p, [d, d, d, d, d, d], center)
    })
}

function drawPolygon(ctx, ps) {
    ctx.moveTo(ps[0].x, ps[0].y)
    for (var i = 1; i < ps.length; i++) {
        ctx.lineTo(ps[i].x, ps[i].y)
    }
    ctx.closePath()
}

function generatePolygon(center, ls) {
    var angles = Math.PI * 2 / ls.length
    var initialAngle = -Math.PI
    var p = ls.map((v, i) => ({
        x: Math.sin(initialAngle + angles * i) * v + center[0],
        y: Math.cos(initialAngle + angles * i) * v + center[1]
    }))
    p.c = 0;
    return p
}

function movePolygon(ps, ls, center) {
    var angles = Math.PI * 2 / ps.length
    var initialAngle = -Math.PI
    ps.forEach((v, i) => {
        v.x = center[0] + ls[i] * Math.sin(initialAngle + angles * i);
        v.y = center[1] + ls[i] * Math.cos(initialAngle + angles * i)
    })
}

function modifyPolygon(ps, ls) {
    var angles = Math.PI * 2 / ps.length
    var initialAngle = -Math.PI
    ps.forEach((v, i) => {
        v.x = v.x + ls[i] * Math.sin(initialAngle + angles * i);
        v.y = v.y + ls[i] * Math.cos(initialAngle + angles * i)
    })
}

function renderPolygons(ctx, ps, color) {
    ctx.strokeStyle = color || '#000'
    ctx.beginPath()
    ps.forEach(v => drawPolygon(ctx, v))
    ctx.stroke()
}

function frame() {
    move()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    renderPolygons(ctx, pos, '#f00')
    requestAnimationFrame(frame)
}


function init() {
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.fillStyle = 'transparent'
    renderOnce()
    frame()
    // pos.push(generatePolygon(center, initLocation))
    // pos.push(generatePolygon(center, initLocation))
    // pos.forEach((v, i) => {
    //     modifyPolygon(v, AnimationSteps[i])
    // })
    // renderPolygons(ctx, pos)
    $(document).on('keydown',function(){
    	framec++
    })
}

init()