var P = require('pixi.js')
var images = [
    'bomb.png',
    'blocks.png',
    'flame.png',
]

function load(cb) {
    for (var i = 0; i < images.length; i++) {
        P.loader.add(images[i])
    }
    P.loader.load(function(){
    	cb && cb(images)
    })
}

module.exports = {
	load:load
}