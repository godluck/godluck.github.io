import './index.scss'
import Vec2 from './vector.js'
import Bezier from './bezier.js'

const r2 = Math.sqrt(2)

if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    var PIXI = window.PIXI
    var dw = document.documentElement.clientWidth;
    var dh = document.documentElement.clientHeight;
    var ch = Math.ceil(640 / dw * dh)
    var Renderer = new PIXI.CanvasRenderer({
        width: 640,
        height: ch,
        transparent: true
    })
    $('body').html(Renderer.view)

    var graphic = new PIXI.Graphics()
    graphic.lineStyle(4, 0)
    var actionList = [{
        move: 'm',
        point: new Vec2(0, 0)
    }]
    drawArc(graphic, actionList, 0)

    var stage = new PIXI.Container()
    stage.addChild(graphic)
    $(Renderer.view).on('touchstart', function(e) {
        var x = e.changedTouches[0].pageX / dw * 640
        var y = e.changedTouches[0].pageY / dh * ch
        actionList.push({
            move: 'b',
            point: new Vec2(x, y)
        })
        drawArc(graphic, actionList, actionList.length - 1)
        $('body').append('<div class="mark" style="top:' + e.changedTouches[0].pageY + 'px;left:' + e.changedTouches[0].pageX + 'px"></div>')
    })
    // $(Renderer.view).on('touchmove', function(e) {
    //     var x = e.changedTouches[0].pageX / dw * 640
    //     var y = e.changedTouches[0].pageY / dh * ch
    //     actionList.push({
    //         move: 'l',
    //         point: new Vec2(x, y)
    //     })
    //     drawArc(graphic, actionList, actionList.length - 1)
    //     // $('body').append('<div class="mark" style="top:' + e.changedTouches[0].pageY + 'px;left:' + e.changedTouches[0].pageX + 'px"></div>')
    // })

    PIXI.ticker.shared.add(() => Renderer.render(stage))
}

function drawArc(g, actionList, i) {
    if (!i) {
        i = 0;
    }
    var action = actionList[i]
    var actionPre = actionList[i - 1]
    g.lineStyle(4, 0, 0.1)
    switch (action.move) {
        case 'm':
            g.moveTo(action.point.x, action.point.y)
            break;
        case 'l':
            g.lineTo(action.point.x, action.point.y)
            break;
        case 'a':
            var d = Vec2.scale(Vec2.minus(action.point, actionPre.point), 1 / 2)
            var v = Vec2.rotate(d, Math.PI / 2)
            action.direction = action.direction == undefined ? Math.random() > 0.5 : action.direction
            var cp1 = Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(Vec2.scale(v, action.direction ? -1 : 1))
            action.cp1 = cp1
            g.arcTo(cp1.x, cp1.y, action.point.x, action.point.y, d.length)
            g.lineTo(action.point.x, action.point.y)
            break;
        case 'b':
            var d = Vec2.scale(Vec2.minus(action.point, actionPre.point), 1 / 4)
            var v = Vec2.rotate(d, Math.PI / 2)
            var direction = action.direction == undefined ? Math.random() > 0.5 : action.direction
            action.direction = direction
            var cp1 = actionPre.cp2 ? Vec2.scale(actionPre.point, 2).sumWith(Vec2.scale(actionPre.cp2, -1)) : Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(Vec2.scale(v, direction ? -1 : 1))
            var cp2 = Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(d).sumWith(d).sumWith(Vec2.scale(v, direction ? -1 : 1))
            action.cp1 = cp1
            action.cp2 = cp2
            // g.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, action.point.x, action.point.y)
            // g.moveTo(actionPre.point.x, actionPre.point.y)
            var b = new Bezier(actionPre.point, cp1, cp2, action.point)
            b.lt = b.getLUT(30)
            animateLineSegs(g, b.lt)
            break;
    }
    i++
    if (actionList[i]) {
        drawArc(g, actionList, i)
    }
}

function animateLineSegs(g, l, i) {
    if (!i) i = 0

    var _i = i % l.length
    var _t = Math.floor(i / l.length)

    if (_t % 2 == 0) {
        g.lineStyle(4, 94161, 0.4)
    } else {
        g.lineStyle(4, 0xffffff, 1)
    }
    if (_i == 0) {
        g.moveTo(l[_i].x, l[_i].y)
    } else {
        g.moveTo(l[_i - 1].x, l[_i - 1].y)
        g.lineTo(l[_i].x, l[_i].y)
    }
    requestAnimationFrame(() => {
        animateLineSegs(g, l, i + 1)
    })
}