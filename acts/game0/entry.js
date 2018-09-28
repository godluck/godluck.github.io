var P = require('pixi.js')
require('./fps.js')
var Images = require('./images.js')
var Stack = require('./stack.js')
var StackRender = require('./stackRender.js')
var Block = require('./block.js')

var dw = document.documentElement.clientWidth;
var dh = document.documentElement.clientHeight;

var Renderer = new P.CanvasRenderer(10 * 42, 15 * 42)
// var Renderer = P.autoDetectRenderer(10 * 42, 15 * 42)
$('.g-main').append(Renderer.view)

var Stage = new P.Container()
Images.load(function(imgNames) {
    var tBomb = P.loader.resources[imgNames[1]].texture
    var tFlame = createAnimation(P.loader.resources[imgNames[2]].texture, 41, 129, 35)
    var stack = Stack.initStack(10, 15);
    var stackRender = StackRender.initStackRender(42, 42, tBomb, stack);
    var stackRenderResult = stackRender.render()
    var stackContainer = stackRenderResult.container
    var stackBg = stackRenderResult.background
    Stage.addChild(stackBg)
    Stage.addChild(tFlame)
    Stage.addChild(stackContainer)
    tFlame.animationSpeed = 0.5
    // tFlame.tint = 0xff0000;
    tFlame.play()
    var block = Block.initBlock('L1', 0, 5, 1)
    stack.addBlocks(block)
    var ss = (createParticleBg(copySpriteSegment(tBomb,80,0,40,40), 10 * 42, 15 * 42, Stage))
    stackRender.render()
    bindKeys(stack)
    var si = requestAnimationFrame(step);
    stack.afterPlace = function(preab) {
        // Stage.addChild(createParticles(tBomb, preab))
        var result = stack.checkFullRows()
        if (result.length) {
            for (var i = 0; i < result.length; i++) {
                stack.removeRow(result[i])
            }
        }
        var block = Block.initBlock(Block.types[Math.floor(Math.random() * Block.types.length)], 0, 5, 1)
        stack.addBlocks(block)
    }
    stack.end = function() {
        clearInterval(si)
    }
    var steps = 0;
    var ticker = P.ticker.shared;
    ticker.add(step)
    Stage.interactive = true;
    Stage.on('pointerdown', function(e) {
        var position = e.data.global
        Stage.addChild(createBurst(copySpriteSegment(tBomb,120,0,40,40), position.x, position.y))
    })

    function step() {
        steps++
        if (steps % stack.pace == 0) {
            stack.dropBlocks()
            stackRender.render()
        }
        // for (var i = 0; i < ss.length; i++) {
        // ss[i].x += i / 10;
        // ss[i].x %= 420;
        // }
        Renderer.render(Stage)
    }

    function bindKeys(stack) {
        $(window).on('keydown', function(e) {
            switch (e.keyCode) {
                case 87:
                case 38:
                    stack.rotateBlock(1);
                    break;
                case 83:
                case 40:
                    stack.pace = 3;
                    break;
                case 65:
                case 37:
                    stack.moveBlock(-1);
                    break;
                case 68:
                case 39:
                    stack.moveBlock(1);
                    break;
            }
            stackRender.render()
        })
        $(window).on('keyup', function(e) {
            switch (e.keyCode) {
                case 83:
                case 40:
                    stack.pace = 30;
                    break;
            }
            stackRender.render()
        })
    }
})

function addParticle(container, texture, x, y, offset) {
    var sprite = new P.extras.TilingSprite(texture, 40, 40)
    sprite.x = x;
    sprite.y = y;
    sprite.tilePosition.x = offset || 0;
    sprite.pivot.x = sprite.width / 2
    sprite.pivot.y = sprite.height / 2
    var sigleTimeline = new TimelineLite()
    sigleTimeline.add(TweenLite.to(sprite, 1, {
        rotation: 720 / 180 * Math.PI,
        y: '-=70',
    }), 0)
    sigleTimeline.add(TweenLite.to(sprite.scale, 1, {
        x: 0,
        y: 0,
    }), 0)
    container.addChild(sprite)
    return sigleTimeline
}

function createParticles(texture, activeBlock) {
    var pc = new P.Container()
    var pt = new TimelineLite({
        onComplete: function() {
            pc.destroy({ children: true })
        }
    })
    for (var i = 0; i < activeBlock.is.length; i++) {
        var x = (activeBlock.is[i][0] + activeBlock.x - 1) * 42 + 21
        var y = (activeBlock.is[i][1] + activeBlock.y - 1) * 42 + 21
        pt.add(addParticle(pc, texture, x, y, 40 * i), 0)
    }

    return pc
}

function onPointerOver() {
    if (this.ani && this.ani.isActive()) return;
    if (this.ani) this.ani.restart()
    var ani = TweenLite.to(this.scale, 1, {
        x: 2,
        y: 2,
        onComplete: function() {
            ani.reverse()
        }
    })
    this.ani = ani;
}

function addParticleBg(container, texture, x, y, offset, sw) {
    var sprite = new P.Sprite(texture)
    sprite.x = x;
    sprite.y = y;
    // sprite.tilePosition.x = offset || 0;
    sprite.pivot.x = sprite.width / 2
    sprite.pivot.y = sprite.height / 2
    sprite.interactive = true;
    sprite.on('touchstart', onPointerOver)
    var sigleTimeline = new TimelineLite()
    sigleTimeline.add(TweenLite.to(sprite, 5, {
        rotation: 720 / 180 * Math.PI,
        x: '+=' + (sw - 42),
        ease: Strong.easeInOut
    }), y / 500)
    container.addChild(sprite)
    return sigleTimeline
}

function createParticleBg(texture, width, height, stage) {
    var pc = new P.Container()
    var ss = new TimelineLite({
        onComplete: function() {
            ss.reverse()
        },
        onReverseComplete: function() {
            ss.restart()
        }
    })
    for (var i = 0; i < height / 7; i++) {
        ss.add(addParticleBg(pc, texture, 21, i * 7, 40 * (i % 7), width), 0);
    }
    stage.addChild(pc);
    return ss
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
            var t = new P.Texture(baseTexture, new P.Rectangle(fwidth * i, fheight * j, fwidth, fheight));
            textures.push(t)
        }
    }
    var AS = new P.extras.AnimatedSprite(textures);
    return AS
}

function createBurst(texture, x, y) {
    var burstContainer = new P.particles.ParticleContainer();
    var burstNum = Math.random() * 5 + 5;
    var tl = new TimelineLite({
        onComplete: function() {
            burstContainer.destroy({
                children: true
            })
        }
    })
    for (var i = 0; i < burstNum; i++) {
        var sprite = new P.Sprite(texture);
        sprite.scale.x = sprite.scale.y = 0.2 + Math.random() * .8;
        sprite.alpha = 0;
        sprite.x = sprite.y = 0;
        sprite.anchor.x = sprite.anchor.y = 0.5;
        var angle = Math.PI *2* Math.random()
        var distance = Math.random() * 50 + 30;
        var rotation = 4 * Math.random() * Math.PI
        var xs = (Math.cos(angle) > 0 ? '+' : '-') + '=' + Math.abs(Math.cos(angle) * distance)
        var ys = (Math.sin(angle) > 0 ? '+' : '-') + '=' + Math.abs(Math.sin(angle) * distance)
        var tls = new TimelineLite()
        tls.add(TweenLite.to(sprite, 1, {
            alpha: 1,
            rotation: rotation * .8,
            x: xs,
            y: ys,
            ease:Power2.easeOut
        }), 0).add(TweenLite.to(sprite, 1, {
            alpha: 0,
            rotation: rotation,
            x: xs,
            y: ys,
            ease:Power2.easeIn
        }))
        tl.add(tls,0)
        burstContainer.addChild(sprite)
    }
    burstContainer.x = x;
    burstContainer.y = y;
    return burstContainer
}
function copySpriteSegment(texture,x,y,width,height){
    var bt = texture.baseTexture;
    return new P.Texture(bt,new P.Rectangle(x,y,width,height))
}