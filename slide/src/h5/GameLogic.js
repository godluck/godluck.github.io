import { TouchPad, Aim } from './TouchPad.js'
import pageData from './helper.js'


function initGame() {
    let G = {}
    let padRight = new TouchPad(require('./img/close.png'), {
        left: pageData.dw / 4,
        top: pageData.dh * 3 / 4,
        width: pageData.dw / 4 * 3,
        height: pageData.dh / 4
    })
    let padBtm = new TouchPad(require('./img/close.png'), {
        left: 0,
        top: 0,
        width: pageData.dw / 4,
        height: pageData.dh / 4 * 3
    })
    let aim = new Aim(require('./img/close.png'), padRight, padBtm)
    // G.padRight = padRight
    // G.padBtm = padBtm
    G.renderElements = [padRight, padBtm, aim]
    return G
}

export default initGame