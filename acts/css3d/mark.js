var fixer = require('./keyframes.js')

function addMark(scene, imgURL, position, callback, keyframes, animation) {
    var img = loadImage(imgURL)
    var container = document.createElement('div')
    container.appendChild(img)
    img = container
    img.className = 'css3d-slice css3d-sprite'
    var radius = position[0] / scene.imageSize[0] * 360
    var offset = position[1] - scene.imageSize[1] / 2
    var transformBase = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -radius + 'deg) translate3d(0,' + offset + 'px,' + -scene.r * .9 + 'px)'
    img.style['WebkitTransform'] = transformBase
    img.style.transform = transformBase
    scene.container.appendChild(img)
    img.onload = function() {
    	if(img.loaded)return;
    	img.loaded = true
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        img.src = canvas.toDataURL()
        // img.style.width7 = img.width + 'px'
        // img.style.height = img.height + 'px'
    }
    img.onclick = callback
    if (window.$ && window.$.keyframe) {
        createAnimation(transformBase, keyframes)
        applyAnimation(img, animation)
    }
    return img
}

function createAnimation(base, keyframes) {
    for (var i in keyframes) {
        if (i != 'name') {
            var keyframe = keyframes[i]
            if (keyframe.transform) {
                keyframe.transform = base + ' ' + keyframe.transform
            }
            if (keyframe['-webkit-transform']) {
                keyframe['-webkit-transform'] = base + ' ' + keyframe['-webkit-transform']
            }
        }
    }
    $.keyframe.define(keyframes)
}

function applyAnimation(target, animationConfig) {
    $(target).playKeyframe(animationConfig)
}

function loadImage(url) {
    var img = new Image()
    img.crossOrigin = "Anonymous"
    if (/blob/i.test(url) || /base64/i.test(url)) {
        img.src = url
    } else {
        img.src = ((/\?/.test(url) ? url + '&' : url + '?') + btoa(window.location.origin) + Math.random().toFixed(3) + Date.now()).replace('http:', '')
    }
    return img
}

module.exports = addMark