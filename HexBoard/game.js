var Renderer, Scene, Textures = [],
    Sprites = []
var r3 = Math.sqrt(3)
var ow = 750
var oh = ow / r3 / 5 * 17
var ratio = 1 / r3 / 5 * 17
var length = oh / 17
var Ticker = PIXI.ticker.shared
initGameRenderer()
generateMap()

function initGameRenderer() {
    var dh = document.documentElement.clientHeight
    var dw = document.documentElement.clientWidth
    var cw = dh / dw > ratio ? dw : (dh / ratio)
    var ch = dh / dw > ratio ? dw * ratio : dh
    console.log(cw, ch)
    Renderer = new PIXI.autoDetectRenderer({
        width: ow,
        height: oh
    })
    document.body.appendChild(Renderer.view)

    Scene = new PIXI.Container()
    Scene.interactive = true
    Renderer.view.addEventListener('touchend', function(e) {
        Sprites.forEach(v => (v.visible = true))
    }, false)
    Renderer.view.addEventListener('touchstart', function(e) {
        var x = (e.changedTouches[0].pageX  - dw / 2) / cw * ow + ow / 2
        var y = (e.changedTouches[0].pageY - dh / 2) / ch * oh + oh / 2
        var target = Sprites.find(v => (v.containsPoint(new PIXI.Point(x, y))))
        if (target) {
            target.visible = false
        }
    }, false)
    Renderer.view.addEventListener('touchmove', function(e) {
        var x = (e.changedTouches[0].pageX  - dw / 2) / cw * ow + ow / 2
        var y = (e.changedTouches[0].pageY - dh / 2) / ch * oh + oh / 2
        var target = Sprites.find(v => (v.containsPoint(new PIXI.Point(x, y))))
        if (target) {
            target.visible = false
        }
    }, false)
    Ticker.add(v => Renderer.render(Scene))
}

function generateMap() {
    var c1 = { x: ow / 2, y: length * 4 }
    var c2 = { x: ow / 2, y: length * 13 }
    var p1 = { x: ow / 2 - length * r3 / 2, y: length * 8.5 }
    var p2 = { x: ow / 2 + length * r3 / 2, y: length * 8.5 }
    var r11 = generateR1(c1)
    var r12 = generateR2(c1)
    var r21 = generateR1(c2)
    var r22 = generateR2(c2)

    var s1 = placeSprite(c1)
    var s2 = placeSprite(c2)
    var s11 = r11.map(v => placeSprite(v))
    var s12 = r12.map(v => placeSprite(v))
    var s21 = r21.map(v => placeSprite(v))
    var s22 = r22.map(v => placeSprite(v))
    var sp1 = placeSprite(p1)
    var sp2 = placeSprite(p2)
}

function placeSprite(c, t) {
    var sprite = new PIXI.Sprite.fromImage('Hexagon.svg')
    sprite.width = length * 2
    sprite.height = length * r3
    sprite.pivot.x = sprite.width * 2
    sprite.pivot.y = sprite.height * 2
    sprite.x = c.x
    sprite.y = c.y
    sprite.rotation = Math.PI / 6
    sprite.interactive = true
    Scene.addChild(sprite)
    Sprites.push(sprite)
    return sprite
}

function generateR1(c) {
    return [getT(c), getLT(c), getLB(c), getB(c), getRB(c), getRT(c)]
}

function generateR2(c) {
    var t = getT(getT(c))
    var t_ = getLB(t)
    var lt = getLB(t_)
    var lt_ = getB(lt)
    var lb = getB(lt_)
    var _lb = getRB(lb)
    var b = getRB(_lb)
    var _b = getRT(b)
    var rb = getRT(_b)
    var _rb = getT(rb)
    var rt = getT(_rb)
    var rt_ = getLT(rt)
    return [t, t_, lt, lt_, lb, _lb, b, _b, rb, _rb, rt, rt_]
}

function getT(c) {
    return { y: c.y, x: c.x - length * r3 }
}

function getB(c) {
    return { y: c.y, x: c.x + length * r3 }
}

function getLT(c) {
    return { y: c.y + length * 1.5, x: c.x - length * r3 / 2 }
}

function getLB(c) {
    return { y: c.y + length * 1.5, x: c.x + length * r3 / 2 }
}

function getRT(c) {
    return { y: c.y - length * 1.5, x: c.x - length * r3 / 2 }
}

function getRB(c) {
    return { y: c.y - length * 1.5, x: c.x + length * r3 / 2 }
}