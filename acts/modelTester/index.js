/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;

	var renderer = new THREE.WebGLRenderer({
	    // antialias: true,
	    precision: "highp",
	    alpha: true,
	    preserveDrawingBuffer: false
	})

	renderer.setSize(w, h);
	renderer.setPixelRatio(2)
	document.body.appendChild(renderer.domElement)

	var scene = new THREE.Scene()
	window.scene = scene
	var camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)

	scene.add(camera)
	camera.position.set(0, 0, 0)
	camera.lookAt(new THREE.Vector3(0, 0, -5))

	var lightBase = new THREE.AmbientLight(0xaaaaaa);
	scene.add(lightBase)

	var light2 = new THREE.PointLight(0x444444);
	light2.position.set(0, 0, 0)
	scene.add(light2)

	var loader = new THREE.JSONLoader();
	var mixer
	var animationClips
	loader.load('1.json', function(g, m) {
	    var material = new THREE.MeshToonMaterial({
	        color:0x0291f2
	    })
	    material.skinning = true
	    // material.morphTargets = true
	    var mesh = new THREE.SkinnedMesh(g, material);
	    console.log(g)
	    console.log(mesh)
	    mesh.position.set(0, -3, -15);
	    // mesh.rotateY(90)
	    scene.add(mesh)
	    mixer = new THREE.AnimationMixer(mesh);
	    animationClips = g.animations
	    var action0 = mixer.clipAction(animationClips[0])
	    var action1 = mixer.clipAction(animationClips[1])
	    var action2 = mixer.clipAction(animationClips[2])
	    // action0.setDuration(2).play()
	    // action1.setDuration(2).play().setEffectiveWeight(.5)
	    action2.setDuration(2).play().setEffectiveWeight(1)
	    console.log(action0, action1, action2)
	    render()
	})
	var speed = 1 / 60
	function render() {
	    mixer.update(speed)
	    requestAnimationFrame(render)
	    renderer.render(scene, camera)
	}
	document.addEventListener('touchstart',function(e){
	    speed = 1 / 300
	},false)
	document.addEventListener('touchend',function(e){
	    speed = 1 / 60
	},false)

/***/ })
/******/ ]);