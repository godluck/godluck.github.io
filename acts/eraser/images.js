var images = [
    'up.png',
    'down.png',
    'down2.png'
]

function load(cb) {
    for (var i = 0; i < images.length; i++) {
        PIXI.loader.add(images[i])
    }
    PIXI.loader.load(function(){
    	cb && cb(images)
    })
}

module.exports = {
	load:load
}