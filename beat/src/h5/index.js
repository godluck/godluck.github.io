import './index.scss'
import { Cell, Connection, RectMap, Setm, getSetCount } from './cell.js'
import { rgbToHsv, rgbToHsl, hsvToRgb, hslToRgb } from './rgb2hsv.js'
import VConsole from './lib/vconsole.min.js'
import Vec2 from './vector.js'
import player from './audio.js'

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
    var hitLog = [0, 178.5, 357, 535.5, 714, 892.5, 1071, 1249.5, 1428, 1606.5, 1785, 1963.5, 2142, 2320.5, 2499, 2677.5, 2856, 3034.5, 3213, 3391.5, 3570, 3748.5, 3927, 4105.5, 4284, 4462.5, 4641, 4819.5, 4998, 5176.5, 5355, 5533.5, 5712, 5890.5, 6069, 6247.5, 6426, 6604.5, 6783, 6961.5, 7140, 7318.5, 7497, 7675.5, 7854, 8032.5, 8211, 8389.5, 8568, 8746.5]
    window.h = hitLog
    player.initMusic(require('./img/music.zip'), 'music.mp3', function(player) {
        $('.btn').show().on('click', function(e) {
            var music = player.start(0, 10, 30)
            $('.btn').hide()
            if (hitLog.length) {
                $('body').off('touchstart')
                replayLog(hitLog)
            } else {
                recordHit(hitLog)
                $('body').on('touchstart', e => {
                    recordHit(hitLog)
                })
            }
            music.onended = function() {
                $('.btn').show()
            }
        })
    })
}

function recordHit(arr) {
    var time = Date.now()
    arr.push(time)
}

function replayLog(arr) {
    var start = arr[0]
    var standardLength = dh / 2
    var dom = arr.map(v => {
        return `<div class="line" style="top:${(start - v) / 1000 * standardLength}px"></div>`
    }).join('')
    var target = $('.lines')
    target.html(dom)
    var startTime = Date.now()
    requestAnimationFrame(frame)

    $('body').on('touchstart', e => {
        checkHit(arr, startTime)
    })

    function frame() {
        requestAnimationFrame(frame)
        var now = Date.now()
        var duration = now - startTime
        var offset = duration / 1000 * standardLength + standardLength
        target.css('transform', 'translate(0,' + offset + 'px)')
    }
}

function checkHit(arr, startTime) {
    var start = arr[0]
    var duration = Date.now() - startTime
    var target = $('.line')
    arr.forEach((v, i) => {
        if (Math.abs(v - start - duration) < 100) {
            target.eq(i).hide()
        }
    })
}