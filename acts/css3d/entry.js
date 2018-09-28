var css3d = require('./css3d.js')
var scene1 = new css3d.Scene('./fullbg.png', [5500, 1345], 50, './top.png', './btm.png')
css3d.target.appendChild(scene1.container)

// var scene2 = new css3d.Scene('./layer.png', [900, 200], 50)
// css3d.target.appendChild(scene2.container)

var controller = new css3d.Controller.DeviceOrientationController(css3d.target)
// var controller = new css3d.Controller.TouchController(css3d.target)
controller.init()

scene1.addMark('./btn.png', [0,100], function(){
	alert('你点到我了！')
}, {
	name:'float',
	from:{
		'transform':'translate3d(0,.3rem,0)',
		'-webkit-transform':'translate3d(0,.3rem,0)',
	},
	to:{
		'transform':'translate3d(0,-.3rem,0)',
		'-webkit-transform':'translate3d(0,-.3rem,0)',
	}
}, 'float 2s ease-in-out infinite alternate')