import './index.scss'
import { Cell, Connection, RectMap, Setm, getSetCount } from './cell.js'
import { rgbToHsv, rgbToHsl, hsvToRgb, hslToRgb } from './rgb2hsv.js'
import VConsole from './lib/vconsole.min.js'

const PIXI = window.PIXI
const c = new VConsole()
if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    var width = 20
    var height = 20
    var map = new RectMap(width, height)
    placeCross(map)
    generateMaze(map)
    var renderer = getRenderer()
    renderer.updatingMap(map)
}

function getRenderer() {
    var dw = document.documentElement.clientWidth;
    var dh = document.documentElement.clientHeight;
    var dpr = window.devicePixelRatio
    var cw = dpr * dw
    var ch = dpr * dh
    var canvas = $('.painter')[0]
    canvas.width = cw
    canvas.height = ch
    var ctx = canvas.getContext('2d')

    function renderMap(m) {
        var cellWidth = cw / (m.width + 1)
        var cellHeight = cw / (m.width + 1)
        ctx.clearRect(0, 0, cw, ch)
        ctx.lineWidth = 3
        ctx.strokeStyle = 'black'
        ctx.font = '15px sans-serif'
        ctx.beginPath()
        for (var i = 0; i < m.width; i++) {
            for (var j = 0; j < m.height; j++) {
                var c = m.getCell(i, j)
                c.borders.forEach((v, i) => {
                    if (v != 1) {
                        renderPassageCellAt(ctx, c.position.x, c.position.y, i, cellWidth, cellHeight, c)
                    }
                })
                renderCellAt(ctx, c.position.x, c.position.y, cellWidth, cellHeight, c.belongTo.id)
            }
        }
        for (var i = 0; i < m.width; i++) {
            for (var j = 0; j < m.height; j++) {
                var c = m.getCell(i, j)
                c.borders.forEach((v, i) => {
                    if (v == 1) {
                        renderBorderAt(ctx, c.position.x, c.position.y, i, cellWidth, cellHeight)
                    } else {
                        renderPassageAt(ctx, c.position.x, c.position.y, i, cellWidth, cellHeight)
                    }
                })
                if (c.isCross) {
                    renderBorderAt(ctx, c.position.x, c.position.y, 0, cellWidth, cellHeight)
                    renderBorderAt(ctx, c.position.x, c.position.y, 2, cellWidth, cellHeight)
                }
            }
        }
        ctx.stroke()
    }

    function renderPassageCellAt(graphic, x, y, direction, width, height, target) {
        var dy = height * 0.7 / 2
        var dx = width * 0.7 / 2
        var _dx = width * 0.6 / 2
        var _dy = height * 0.6 / 2
        var cx = x * width + width
        var cy = y * height + height
        ctx.fillStyle = '#fff'//getColor(target.belongTo.id, getSetCount())
        if (target.isCross && direction == 0) return;
        if (target.isCross && direction == 2) return;
        switch (direction) {
            case 0:
                graphic.fillRect(cx - dx, cy - dy - _dy, dx * 2, _dy * 2)
                break;
            case 1:
                graphic.fillRect(cx + dx, cy - dy, _dx * 2, dy * 2)
                break;
            case 2:
                graphic.fillRect(cx - dx, cy + dy, dx * 2, _dy * 2)
                break;
            case 3:
                graphic.fillRect(cx - dx, cy - dy, _dx * 2, dy * 2)
                break;
        }
    }

    function renderCellAt(graphic, x, y, width, height, id) {
        var dy = height * 0.7 / 2
        var dx = width * 0.7 / 2
        var cx = x * width + width
        var cy = y * height + height
        ctx.fillStyle = '#fff'//getColor(id, getSetCount())
        graphic.fillRect(cx - dx, cy - dy, dx * 2, dy * 2)
        ctx.fillStyle = '#000'
        // graphic.fillText(id, cx - dx, cy + dy - 3)
    }

    function renderBorderAt(graphic, x, y, direction, width, height) {
        var dy = height * 0.7 / 2
        var dx = width * 0.7 / 2
        var cx = x * width + width
        var cy = y * height + height
        switch (direction) {
            case 0:
                graphic.moveTo(cx - dx, cy - dy)
                graphic.lineTo(cx + dx, cy - dy)
                break;
            case 1:
                graphic.moveTo(cx + dx, cy - dy)
                graphic.lineTo(cx + dx, cy + dy)
                break;
            case 2:
                graphic.moveTo(cx + dx, cy + dy)
                graphic.lineTo(cx - dx, cy + dy)
                break;
            case 3:
                graphic.moveTo(cx - dx, cy + dy)
                graphic.lineTo(cx - dx, cy - dy)
                break;
        }
    }

    function renderPassageAt(graphic, x, y, direction, width, height) {
        var dy = height * 0.7 / 2
        var dx = width * 0.7 / 2
        var cx = x * width + width
        var cy = y * height + height
        switch (direction) {
            case 0:
                graphic.moveTo(cx - dx, cy - dy)
                graphic.lineTo(cx - dx, cy - 2 * dy)
                break;
            case 1:
                graphic.moveTo(cx + dx, cy - dy)
                graphic.lineTo(cx + 2 * dx, cy - dy)
                break;
            case 2:
                graphic.moveTo(cx + dx, cy + dy)
                graphic.lineTo(cx + dx, cy + 2 * dy)
                break;
            case 3:
                graphic.moveTo(cx - dx, cy + dy)
                graphic.lineTo(cx - 2 * dx, cy + dy)
                break;
        }
    }

    function updatingMap(m) {
        requestAnimationFrame(render)

        function render() {
            renderMap(m)
            requestAnimationFrame(render)
        }
    }
    return { renderMap, updatingMap }
}

function generateMaze(map) {
    var connections = map.connections
    var unvisited = map.connections.map(v => v)
    var visited = []
    step()
    // $('canvas').on('click', step)

    function step() {
        var target = getRandom(unvisited)
        var canRemove = false
        if (!target) {
            console.log('end')
            return;
        }
        if (target.active && target.targetA.belongTo !== target.targetB.belongTo) {
            target.targetA.belongTo.merge(target.targetB.belongTo)
            target.unlink()
            canRemove = true
        }
        unvisited = removeFrom(unvisited, target)
        visited.push(target)

        if (!canRemove) {
            step()
            return
        }

        // step()
        requestAnimationFrame(step)
        // setTimeout(step, 300)
    }
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function removeFrom(arr, ele) {
    return arr.filter(v => v !== ele)
}

function placeCross(m) {
    // var c = m.getCell(5, 5)
    // c.setCross()
    for (var i = 0; i < m.width; i++) {
        for (var j = 0; j < m.height; j++) {
            var c = m.getCell(i, j)
            if (i > 0 && j > 0 && i < m.width - 1 && j < m.height - 1) {
                var c0 = m.getCell(i, j - 1)
                var c1 = m.getCell(i + 1, j)
                var c2 = m.getCell(i, j + 1)
                var c3 = m.getCell(i - 1, j)
                if (c1.isCross || c2.isCross || c3.isCross || c0.isCross) {
                    continue
                }
                Math.random() < 0.3 && c.setCross()
            }
        }
    }
}

function getColor(stop, total) {
    var ratio = (stop / total) % 1
    var rgb = hsvToRgb(ratio, 1, 1).map(v => Math.round(v))
    return 'rgb(' + rgb.join(',') + ')'
}

function mazeWalker(m, i, j) {
    var cur = { x: i || 0, y: j || 0 }
    var records = []
    var stack = []

    // function step() {
    //     var c = m.getCell(cur.x, cur.y)
    //     if (c.isCross) {
    //         c.connections.forEach((v, i) => {
    //             if(i == )
    //             if (!v) {
    //                 stack.push({ from: c, to: i })
    //             }
    //         })
    //     } else {
    //         c.connections.forEach((v, i) => {
    //             if (!v) {
    //                 stack.push({ from: c, to: i })
    //             }
    //         })
    //     }
    // }
}