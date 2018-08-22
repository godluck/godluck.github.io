import './index.scss'
import VConsole from './lib/vconsole.min.js'
import initLogicScene from './initLogicScene.js'

const PIXI = window.PIXI
const c = new VConsole()
const dw = document.documentElement.clientWidth;
const dh = document.documentElement.clientHeight;
const dpr = window.devicePixelRatio || 2
const cw = dpr * dw
const ch = dpr * dh
if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    initLogicScene()    
}
