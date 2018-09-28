var loader = require('./loader.js')

var dw = document.documentElement.clientWidth;
var dh = document.documentElement.clientHeight;
var Renderer = new PIXI.CanvasRenderer(dw, dh)
$('.g-main').append(Renderer.view)
var Stage = new PIXI.Container();


var scale = dw / 640;

loader.initLoad([
    'combine.zip'
], {
    loadOptions: {
        success: function(f) {
            // initPage(f)
            var imgs = [
                f['up.png'],
                f['down.png'],
                f['down2.png'],
            ]
            console.log(imgs)
            for (var i = 0; i < imgs.length; i++) {
                PIXI.loader.add('p' + i, imgs[i], { loadType: 2/*Resource.LOAD_TYPE.IMAGE*/ })
            }
            PIXI.loader.load(function() {
                
                init(imgs)
            })
        },
        error: function(e) {
            console.log(e)
        },
        progress: function(p) {
            console.log(p)
        }
    },
    returnOptions: {
        'png': loader.TYPE_URL,
    },
    mimeOptions: {
        'png': 'image/png'
    }
})

function init(imgs) {
    var tTexture = PIXI.loader.resources['p0'].texture
    var uTexture = PIXI.loader.resources['p1'].texture
    var bTexture = PIXI.loader.resources['p2'].texture

    var t = createAnimation(tTexture, 160, 120, 49)
    var u = createAnimation(uTexture, 160, 120, 49)
    var b = createAnimation(bTexture, 160, 120, 49)
    t.scale.x = t.scale.y = u.scale.x = b.scale.x = u.scale.y = b.scale.y = scale * 4
    t.animationSpeed = u.animationSpeed = b.animationSpeed = .2;
    u.y = b.y = u.height
    t.play()
    u.play()
    b.play()
    Stage.addChild(t, b, u)

    u.mask = initMask()
    u.mask.lineWidth = 1;
    u.mask.beginFill(0x00000, 1)
    Renderer.render(Stage)

    Stage.interactive = true;
    var radius = 50 * scale;
    var pLog = { x: 0, y: 0 };
    Stage.on('touchstart', function(e) {
        var position = e.data.global
        console.log(u.mask.containsPoint(new PIXI.Point(position.x, position.y)))
        u.mask.drawCircle(position.x, position.y, radius)
        pLog.x = position.x
        pLog.y = position.y
        Renderer.render(Stage)
    })
    Stage.on('touchmove', function(e) {
        var position = e.data.global
        var path = getRectAtWidth([pLog.x, pLog.y], [position.x, position.y], radius * 2)
        pLog.x = position.x
        pLog.y = position.y
        u.mask.drawPolygon(path)
        u.mask.drawCircle(position.x, position.y, radius)
        Renderer.render(Stage)
    })
    var ticker = PIXI.ticker.shared;
    ticker.add(frame)

    function frame() {
        Renderer.render(Stage)
    }
}


function getRectAtWidth(p1, p2, width) {
    var angleL = (p1[1] - p2[1]) == 0 ? (p1[0] - p2[0]) * Infinity : (p1[0] - p2[0]) / (p1[1] - p2[1])
    var p1s = getPointAt(p1, width / 2, angleL)
    var p2s = getPointAt(p2, width / 2, angleL)
    return (p1[1] - p2[1]) < 0 ? [p2s[0], p1s[0], p1s[1], p2s[1]] : [p2s[1], p1s[1], p1s[0], p2s[0]]
}

function getPointAt(origin, distance, angle) {
    var degree = Math.atan(angle)
    var dx = distance * Math.cos(degree)
    var dy = distance * Math.sin(degree)
    var p1 = new PIXI.Point(origin[0] - dx, origin[1] + dy)
    var p2 = new PIXI.Point(origin[0] + dx, origin[1] - dy)
    return [p1, p2]
}

function initMask() {
    var Mask = new PIXI.Graphics()
    return Mask
}

function createAnimation(texture, fwidth, fheight, num) {
    var baseTexture = texture.baseTexture
    var width = baseTexture.realWidth;
    var height = baseTexture.realHeight;
    var ni = Math.floor(width / fwidth)
    var nj = Math.floor(height / fheight)
    var textures = []
    for (var j = 0; j < nj; j++) {
        for (var i = 0; i < ni; i++) {
            if (j * ni + i >= num) continue
            var t = new PIXI.Texture(baseTexture, new PIXI.Rectangle(fwidth * i, fheight * j, fwidth, fheight));
            textures.push(t)
        }
    }
    var AS = new PIXI.extras.AnimatedSprite(textures);
    return AS
}