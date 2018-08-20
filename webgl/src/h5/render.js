import { rgbToHsv, rgbToHsl, hsvToRgb, hslToRgb } from './rgb2hsv.js'

function getRenderer() {
    var PIXI = window.PIXI
    const dw = document.documentElement.clientWidth;
    const dh = document.documentElement.clientHeight;
    const dpr = window.devicePixelRatio || 2
    const cw = dpr * dw
    const ch = dpr * dh
    const canvas = $('.painter')[0]
    canvas.width = cw
    canvas.height = ch
    var Renderer = new PIXI.autoDetectRenderer({
        transparent: true,
        canvas: canvas
    })
    var Scene = new PIXI.Container()
    PIXI.ticker.shared.add(function() {
        Renderer.render(Scene)
    })
    window.S = Scene
    var colorStops = 500
    var colorStop = 0
    var strokeColor = getColor(colorStops, colorStop)
    var bgColor = strokeColor.map(v => 255 - v)
    var alpha = 0.5
    var minLineWidth = 0
    var maxLineWidth = 30
    var totalStep = 30

    function renderMapLines(m) {
        var cx = m.center.x
        var cy = m.center.y
        var rs = m.radiusArray
        var g = new PIXI.Graphics()
        Scene.addChild(g)
        g.lineStyle(2, color2hex(strokeColor), 1)
        g.cacheAsBitmap = true
        g.beginFill(0, 1)
        rs.forEach(r => {
            g.drawCircle(cx, cy, r)
        })
        return g
    }

    return {
        Renderer,
        Scene,
        PIXI,
        renderMapLines,
    }
}

function slerp(s, e, r) {
    return e * r + s * (1 - r)
}

function color2str(rgb, alpha) {
    return 'rgba(' + rgb.join(',') + ',' + alpha + ')'
}

function color2hex(rgb) {
    return rgb[0] * Math.pow(16, 4) + rgb[1] * Math.pow(16, 2) + rgb[2]
}

function getColor(total, index) {
    var ratio = (index / total) % 1
    var rgb = hsvToRgb(ratio, 1, 1).map(v => Math.round(v))
    return rgb
}

export default { getRenderer }