var fixer = require('./keyframes.js')
var addMark = require('./mark.js')
function Scene(img, imageSize, verticalSliceCount, imgTop, imgBtm) {
    var self = this
    this.img = loadImage(img)
    this.img.onload = function() {
        self.img.loaded = true;
    }
    this.imgBtm = imgBtm ? loadImage(imgBtm) : null
    this.imgTop = imgTop ? loadImage(imgTop) : null
    this.imageSize = imageSize
    this.verticalSliceCount = verticalSliceCount

    this.radiusScale = .99 //避免PC中图片间白线
    this.r = Math.abs(imageSize[0] / verticalSliceCount / 2 / Math.tan(360 / verticalSliceCount / 2 / 180 * Math.PI)) * this.radiusScale
    this.container = document.createElement('div')
    this.container.className = 'css3d-scene'
    this.init()
}

Scene.prototype = {
    init: function() {
        var self = this
        if (this.img.loaded) {
            var canvas = document.createElement('canvas')
            canvas.width = this.imageSize[0] / this.verticalSliceCount;
            canvas.height = this.imageSize[1];
            var ctx = canvas.getContext('2d')
            var imgs = []
            for (var i = 0; i < this.imageSize[0]; i += canvas.width) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(this.img, -i, 0)
                var t = new Image()
                t.src = canvas.toDataURL()
                t.className = 'css3d-slice css3d-slice-' + (i / canvas.width)
                imgs.push(t)
            }
            imgs.forEach(function(v, i){
                self.container.appendChild(v)
                v.style['WebkitTransform'] = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -360 / self.verticalSliceCount * i + 'deg) translate3d(0,0,' + (-self.r) + 'px)'
                v.style.transform = 'translate3d(-50%,-50%,0) rotateX(-90deg) rotateY(' + -360 / self.verticalSliceCount * i + 'deg) translate3d(0,0,' + (-self.r) + 'px)'
            })

            if (this.imgTop) {
                this.imgTop.width = this.r * 2
                this.imgTop.height = this.r * 2
                this.imgTop.className = 'css3d-slice'
                this.imgTop.style['WebkitTransform'] = 'translate3d(-50%,-50%,' + this.imageSize[1] / 2 + 'px) rotateX(180deg)'
                this.imgTop.style.transform = 'translate3d(-50%,-50%,' + this.imageSize[1] / 2 + 'px) rotateX(180deg)'
                this.container.appendChild(this.imgTop)
            }
            if (this.imgBtm) {
                this.imgBtm.width = this.r * 2
                this.imgBtm.height = this.r * 2
                this.imgBtm.className = 'css3d-slice'
                this.imgBtm.style['WebkitTransform'] = 'translate3d(-50%,-50%,' + -this.imageSize[1] / 2 + 'px)'
                this.imgBtm.style.transform = 'translate3d(-50%,-50%,' + -this.imageSize[1] / 2 + 'px)'
                this.container.appendChild(this.imgBtm)
            }
        } else {
            this.img.onload = function() {
                self.img.loaded = true;
                self.init()
            }
        }
    },
    addMark:function(imgURL, position, callback, keyframes, animation){
    	addMark(this, imgURL, position, callback, keyframes, animation)
    }
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

module.exports = Scene