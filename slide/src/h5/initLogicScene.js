import pageData from './helper.js'
import initGame from './GameLogic.js'

const PIXI = window.PIXI
let G
let frameBuffer = []

function initLogicScene() {
    G = {}
    let renderer = PIXI.autoDetectRenderer({
        width: pageData.dw,
        height: pageData.dh,
        resolution: pageData.dpr,
        backgroundColor: 0xffffff
    })
    document.body.appendChild(renderer.view)
    window.addEventListener('resize', function() {
        renderer.resize(pageData.dw, pageData.dh)
    })
    G.renderer = renderer

    let game = initGame()

    initScene(G, game)
    renderScene(G)
    PIXI.ticker.shared.add(function() {
        frameBuffer.forEach(v => v())
    })
}

function initScene(G, game) {
    let scene = new PIXI.Container()
    G.scene = scene
    var resources = {}
    game.renderElements.forEach(v => {
        var sprite = new PIXI.Container()
        v.sprite = sprite
        sprite.position.x = v.position.x
        sprite.position.y = v.position.y
        sprite.interactive = true
        sprite.on('touchstart',v.ontouchstart)
        sprite.on('touchmove',v.ontouchmove)
        var img = v.spriteImageUrl
        var p = resources[img] ? resources[img].push(sprite) : (resources[img] = [sprite])
        scene.addChild(sprite)
    })
    Object.keys(resources).forEach(img => {
        PIXI.loader.add({
            url: img,
            onComplete: v => {
                resources[img].forEach(sprite => {
                    var image = new PIXI.Sprite(PIXI.loader.resources[img].texture)
                    image.position.x = -image.width / 2
                    image.position.y = -image.height / 2
                    sprite.addChild(image)
                })
            },
            crossOrigin: true
        })
    })
    PIXI.loader.load(v => {
        console.log(resources)
    })
}

function renderScene(G) {
    frameBuffer.push(frame)

    function frame() {
        G.renderer.render(G.scene)
    }
}
export default initLogicScene