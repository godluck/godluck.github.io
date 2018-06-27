import './index.scss'
import Vec2 from './vector.js'
import Bezier from './bezier.js'

const r2 = Math.sqrt(2)
let G = {}
const PIXI = window.PIXI

if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
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
    var stage = new PIXI.Container()
    stage.addChild(graphic)
    PIXI.ticker.shared.add(() => Renderer.render(stage))

    G.renderInfo = {
        width: 640,
        height: ch,
        renderer: Renderer,
        stage: stage,
        graphic: graphic,
        document: {
            width: dw,
            height: dh
        }
    }


    var actionList = [{
        move: 'm',
        point: new Vec2(0, 0)
    }]

    G.actionList = actionList
    G.arcList = []
    animateArcs()
    createUX()
}

function createUX() {
    var dw = G.renderInfo.document.width
    var dh = G.renderInfo.document.height
    var ch = G.renderInfo.height
    $(G.renderInfo.renderer.view).on('touchstart', function(e) {
        var x = e.changedTouches[0].pageX / dw * 640
        var y = e.changedTouches[0].pageY / dh * ch
        G.actionList.push({
            move: 'b',
            point: new Vec2(x, y)
        })
        G.arcList.push(buildArc(G.actionList.length - 1))
        console.log(G)
    })
}

function buildArc(i) {
    if (!i) {
        i = 0;
    }
    var action = G.actionList[i]
    var actionPre = G.actionList[i - 1]
    switch (action.move) {
        // case 'm':
        //     return {
        //         type: 'point',
        //         point: action.point
        //     }
        case 'l':
            var data = {
                type: 'line',
                point1: actionPre.point,
                point2: action.point,
            }
            data.segs = createSeg(data)
            return data
            // case 'a':
            //     var d = Vec2.scale(Vec2.minus(action.point, actionPre.point), 1 / 2)
            //     var v = Vec2.rotate(d, Math.PI / 2)
            //     action.direction = action.direction == undefined ? Math.random() > 0.5 : action.direction
            //     var cp1 = Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(Vec2.scale(v, action.direction ? -1 : 1))
            //     action.cp1 = cp1

            //     G.arcList.push({
            //         type: 'arc',
            //         point1: actionPre.point,
            //         point2: action.point,
            //         cPoint1: cp1
            //     })
            //     break;
        case 'b':
            var d = Vec2.scale(Vec2.minus(action.point, actionPre.point), 1 / 4)
            var v = Vec2.rotate(d, Math.PI / 2)
            var direction = action.direction == undefined ? Math.random() > 0.5 : action.direction
            action.direction = direction
            var cp1 = actionPre.cp2 ? Vec2.scale(actionPre.point, 2).sumWith(Vec2.scale(actionPre.cp2, -1)) : Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(Vec2.scale(v, direction ? -1 : 1))
            var cp2 = Vec2.scale(actionPre.point, 1).sumWith(d).sumWith(d).sumWith(d).sumWith(Vec2.scale(v, direction ? -1 : 1))
            action.cp1 = cp1
            action.cp2 = cp2

            var data = {
                type: 'bezier',
                point1: actionPre.point,
                point2: action.point,
                cPoint1: cp1,
                cPoint2: cp2,
                time: 1000
            }
            data.segs = createSeg(data)
            return data
    }
}

function animateArcs() {
    var arcs = G.arcList
    var startTime = Date.now()
    var defaultDuration = 500
    var lastTime = 0
    var usedTime = 0
    var currentIndex = 0
    var preTime = Date.now()
    var lengthLog = []
    var maxRenderLength = 100
    var renderStep = 2
    var renderGap = 8
    var paused = false
    var pauseTime = Date.now()
    PIXI.ticker.shared.add(function re() {
        if (paused) return;
        G.renderInfo.graphic.clear()
        G.renderInfo.graphic.lineStyle(4, 0x0000ff)

        var renderTime = Date.now()
        lastTime = renderTime - startTime
        var arc = arcs[currentIndex]
        if (!arc) {
            if (!lengthLog.length) {
                startTime = Date.now()
                lastTime = 0
                usedTime = 0
                currentIndex = 0
                lengthLog = []
            } else {
                lengthLog.shift()
                lengthLog.forEach((v, i) => (i % (renderGap + renderStep)) < renderStep ? drawSeg(v) : null)
            }
            return
        }
        var duration = arc.time || defaultDuration

        if (lastTime - usedTime > duration) {
            //draw last
            var t1 = (preTime - startTime - usedTime) / duration
            var t2 = 1
            var _l = arcs[currentIndex].segs.split(t1, t2)
            lengthLog.push(_l)
            usedTime += duration
            preTime = usedTime + startTime

            currentIndex = currentIndex + 1
            re()
            return;
        } else {
            var t1 = (preTime - startTime - usedTime) / duration
            var t2 = (lastTime - usedTime) / duration
            var _l = arcs[currentIndex].segs.split(t1, t2)
            lengthLog.push(_l)
        }
        while (lengthLog.length > maxRenderLength) {
            lengthLog.shift()
        }
        lengthLog.forEach((v, i) => ((lengthLog.length - 1 - i) % (renderGap + renderStep)) < renderStep ? drawSeg(v) : null)
        preTime = renderTime
    })
    window.pause = () => {
        paused = true
        pauseTime = Date.now()
    }
    window.resume = () => {
        paused = false
        var last = Date.now() - pauseTime
        startTime += last
        preTime += last
    }
}

function drawSeg(_l) {
    if (_l.points.length == 2) {
        G.renderInfo.graphic.moveTo(_l.points[0].x, _l.points[0].y)
        G.renderInfo.graphic.lineTo(_l.points[1].x, _l.points[1].y)
    } else if (_l.points.length == 4) {
        G.renderInfo.graphic.moveTo(_l.points[0].x, _l.points[0].y)
        G.renderInfo.graphic.bezierCurveTo(_l.points[1].x, _l.points[1].y, _l.points[2].x, _l.points[2].y, _l.points[3].x, _l.points[3].y)
    }
}

function createSeg(d, count) {
    switch (d.type) {
        case 'line':
            return {
                get: function(i) {
                    return Vec2.scale(d.point2, i).sumWith(Vec2.scale(d.point1, 1 - i))
                },
                split: function(t1, t2) {
                    return {
                        points: [
                            Vec2.scale(d.point2, t1).sumWith(Vec2.scale(d.point1, 1 - t1)),
                            Vec2.scale(d.point2, t2).sumWith(Vec2.scale(d.point1, 1 - t2))
                        ]
                    }
                }
            }
        case 'bezier':
            return (function() {
                var bezier = new Bezier(d.point1, d.cPoint1, d.cPoint2, d.point2)
                return bezier
            })()
    }
}
window.bezier = new Bezier({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 })