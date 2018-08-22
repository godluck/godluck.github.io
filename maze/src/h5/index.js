import './index.scss'
import { Cell, Connection, RectMap } from './cell.js'
const PIXI = window.PIXI

if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    var width = 30
    var height = 50
    var map = new RectMap(width, height)
    generateMaze(map)
    var renderer = getRenderer()
    renderer.updatingMap(map)
}

function getRenderer() {
    var dw = document.documentElement.clientWidth;
    var dh = document.documentElement.clientHeight;
    var ch = Math.ceil(750 / dw * dh)
    var Renderer = new PIXI.CanvasRenderer({
        width: 750,
        height: ch,
        transparent: true
    })
    $('body').html(Renderer.view)

    var graphic = new PIXI.Graphics()
    var stage = new PIXI.Container()
    stage.addChild(graphic)
    PIXI.ticker.shared.add(() => Renderer.render(stage))

    function renderMap(m) {
        var cellWidth = 720 / m.width
        var cellHeight = 720 / m.width
        graphic.clear()
        graphic.x = cellWidth
        graphic.y = cellWidth
        graphic.lineStyle(3, 0)
        for (var i = 0; i < m.width; i++) {
            for (var j = 0; j < m.height; j++) {
                var c = m.getCell(i, j)
                c.connections.forEach(v => {
                    let x1 = v.targetA.position.x
                    let y1 = v.targetA.position.y
                    let x2 = v.targetB.position.x
                    let y2 = v.targetB.position.y
                    let _x1 = x1 + x2 + y1 - y2
                    let _y1 = -x1 + x2 + y1 + y2
                    let _x2 = x1 + x2 - y1 + y2
                    let _y2 = x1 - x2 + y1 + y2
                    graphic.moveTo(_x1 / 2 * cellWidth, _y1 / 2 * cellHeight)
                    graphic.lineTo(_x2 / 2 * cellWidth, _y2 / 2 * cellHeight)
                })
            }
        }
        graphic.moveTo(0 - cellWidth / 2, 0 - cellHeight / 2)
        graphic.lineTo(m.width * cellWidth - cellWidth / 2, 0 - cellHeight / 2)
        graphic.lineTo(m.width * cellWidth - cellWidth / 2, m.height * cellHeight - cellHeight / 2)
        graphic.lineTo(0 - cellWidth / 2, m.height * cellHeight - cellHeight / 2)
        graphic.lineTo(0 - cellWidth / 2, 0 - cellHeight / 2)
    }

    function updatingMap(m) {
        PIXI.ticker.shared.add(() => renderMap(m))
    }
    return { renderMap, updatingMap }
}

function generateMaze(map) {
    var startCell = map.getCell(Math.floor(Math.random() * map.width), Math.floor(Math.random() * map.height))
    startCell.state = 1
    var stack = [startCell]
    // step()
    setInterval(step, 10)

    function step() {
        var target = getCellFromStack(stack)
        if (!target) return
        var candidates = target.connections.filter(v => v.targetB.state == 0)
        var nextConnection = candidates[Math.floor(Math.random() * candidates.length)]
        if (nextConnection) {
            var nextCell = nextConnection.targetB
            target.unlinkTo(nextCell)
            nextCell.state = 1
            stack.push(nextCell)
            // step()
        } else {
            stack = removeCellFromStack(stack, target)
            // step()
        }
    }
    // var index = 0

    function getCellFromStack(stack) {
        // var target
        // if (stack[index]) {
        //     target = stack[index]
        //     index++
        // } else {
        //     target = stack[0]
        //     index = 0
        // }
        // return target
        return Math.random() > 0.1 ? stack[stack.length - 1] : stack[Math.floor(Math.random() * stack.length)]
    }

    function removeCellFromStack(stack, target) {
        return stack.filter(v => v !== target)
    }
}