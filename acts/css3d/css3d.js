var Scene = require('./scene.js')
var Controller = require('./controller.js')

function initBase() {
    var css = '\
			* {margin:0;padding:0;box-sizing:border-box;}\
			html,body {width:100%;height:100%;background:#fcfcfc;font-size:initial;margin:0 auto;overflow:hidden;}\
			img {border:none;}\
			.css3d-stage {width:100%;height:100%;position:relative;-webkit-perspective:1000;perspective:1000;-webkit-perspective-origin:50% 50%;perspective-origin:50% 50%;}\
			.css3d-scene,.css3d-box {position:absolute;top:0;left:0;width:100%;height:100%;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;}\
			.css3d-slice {position:absolute;top:50%;left:50%;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:50% 50% 0;transform-origin:50% 50% 0;}\
			.css3d-scene,.css3d-slice{pointer-events:none;} .css3d-sprite{pointer-events:initial;width:0;height:0;} .css3d-sprite img{position:absolute;transform:translate(-50%,-50%)}\
	   	',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    var target = document.querySelector('.css3d-stage')
    if (!target) {
        target = document.createElement('div')
        target.className = 'css3d-stage'
        document.body.appendChild(target)
    }
    var box = document.createElement('div')
    box.className = 'css3d-box'
    target.appendChild(box)
    return box
}

module.exports = {
    Scene: Scene,
    Controller: Controller,
    target: initBase()
}