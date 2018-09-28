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

	var vertexShader = `
		varying vec2 t_uv;
		uniform vec2 canvas_size;
		void main(){
			t_uv = uv;
			vec2 clipspace = position.xy / canvas_size * 2.0 ;
			// gl_Position =  vec4( clipspace,0.0, 1.0 );
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
		}
	`
	var fragmentShader = `
		varying vec2 t_uv;
		uniform sampler2D u_texture;
		uniform vec2 u_texture_size;
		uniform sampler2D dither_array;
		float Epsilon = 1e-10;
		uniform vec3 palette[32];
		vec3 HUEtoRGB(float H){
			float R = abs(H * 6.0 - 3.0) - 1.0;
			float G = 2.0 - abs(H * 6.0 - 2.0);
			float B = 2.0 - abs(H * 6.0 - 4.0);
			return saturate(vec3(R,G,B));
		}
		vec3 HSLtoRGB(vec3 HSL){
			vec3 RGB = HUEtoRGB(HSL.x);
			float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
			return (RGB - 0.5) * C + HSL.z;
		}
		vec3 RGBtoHCV(vec3 RGB){
			vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
			vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
			float C = Q.x - min(Q.w, Q.y);
			float H = abs((Q.w - Q.y) / (6.0 * C + Epsilon) + Q.z);
			return vec3(H, C, Q.x);
		}
		vec3 RGBtoHSL(vec3 RGB){
			vec3 HCV = RGBtoHCV(RGB);
			float L = HCV.z - HCV.y * 0.5;
			float S = HCV.y / (1.0 - abs(L * 2.0 - 1.0) + Epsilon);
			return vec3(HCV.x, S, L);
		}
		float hueDistance(vec3 HSL1, vec3 HSL2){
			float distanceH = abs(HSL1.x - HSL2.x);
			float distanceS = abs(HSL1.y - HSL2.y);
			float distanceL = abs(HSL1.z - HSL2.z);
			return max(min(distanceH, 1.0 - distanceH),min(distanceS, 1.0 - distanceS));
		}
		mat4 getClosest(vec3 RGB){
			vec3 HSL = RGBtoHSL(RGB);
			vec3 min = palette[0];
			vec3 min2 = palette[0];
			vec3 temp;
			for(int i = 0; i < 32; ++i){
				temp = palette[i];
				float distance = hueDistance(RGBtoHSL(temp),HSL);
				if(distance < hueDistance(RGBtoHSL(min),HSL)){
					min2 = min;
					min = temp;
				}else{
					if(distance < hueDistance(RGBtoHSL(min2),HSL)){
						min2 = temp;
					}
				}
			}
			mat4 result;
			result[0] = vec4(min,1.0);
			result[1] = vec4(min2,1.0);
			return result;
		}
		void main(){
			float px = 1.0 / u_texture_size.x;
			float py = 1.0 / u_texture_size.y;
			vec2 px_position = vec2(t_uv.x / px,t_uv.y / py);
			vec2 matrix_position = vec2(mod(px_position.x,4.0),mod(px_position.y,4.0));
			float limit = texture2D(dither_array,matrix_position).a;
			vec4 cur_color = texture2D(u_texture,t_uv);
			mat4 closest = getClosest(cur_color.rgb);
			float gray_scale = hueDistance(RGBtoHSL(cur_color.rgb),RGBtoHSL(closest[0].rgb)) / hueDistance(RGBtoHSL(closest[0].rgb),RGBtoHSL(closest[1].rgb));
			if(gray_scale < limit){
				gl_FragColor = closest[0];
			}else{
				gl_FragColor = closest[1];
			}
			// gl_FragColor = cur_color;
		}
	`
	    //场景
	var scene = new THREE.Scene();
	//渲染器
	var renderer = new THREE.WebGLRenderer({ alpha: false });
	//设置大小为全屏
	renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	//启动阴影
	//创建视角摄像机，张角45度，宽高比与画布宽高比相同，视角距离从1到1000
	var camera = new THREE.PerspectiveCamera(45, document.documentElement.clientWidth / document.documentElement.clientHeight, 1, 1000);
	//设置摄像机位置
	camera.position.set(0, 0, 700);
	camera.lookAt(new THREE.Vector3(0, 0, 0))
	    //添加画布到页面
	document.body.appendChild(renderer.domElement);
	//设置画布背景色
	renderer.setClearColor(0x000000);
	scene.add(camera);
	var ditherArray = [
	    0, 32, 8, 40, 2, 34, 10, 42,
	    48, 16, 56, 24, 50, 18, 58, 26,
	    12, 44, 4, 36, 14, 46, 6, 38,
	    60, 28, 52, 20, 62, 30, 54, 22,
	    3, 35, 11, 43, 1, 33, 9, 41,
	    51, 19, 59, 27, 49, 17, 57, 25,
	    15, 47, 7, 39, 13, 45, 5, 37,
	    63, 31, 55, 23, 61, 29, 53, 21
	]
	for (var i = 0; i < ditherArray.length; i++) {
	    ditherArray[i] = Math.round(ditherArray[i] / 64 * 255);
	}
	var uint8view = Uint8Array.from(ditherArray);
	var dataTexture = new THREE.DataTexture(uint8view, 8, 8, THREE.AlphaFormat, THREE.UnsignedByteType)
	dataTexture.magFilter = THREE.NearestFilter
	dataTexture.needsUpdate = true;

	var palette = [

	]
	for(var i = 0; i < 32; i++){
		palette.push([Math.random(),Math.random(),Math.random()])
	}
	var planeGeo = new THREE.PlaneBufferGeometry(512, 256)
	var planeMe = new THREE.ShaderMaterial({
	    uniforms: {
	        u_texture: { type: "t", value: new THREE.TextureLoader().load("gg4.png") },
	        u_texture_size: { type: "v2", value: new THREE.Vector2(512, 256) },
	        dither_array: { type: "t", value: dataTexture },
	        canvas_size: { type: 'v2', value: new THREE.Vector2(document.documentElement.clientWidth, document.documentElement.clientHeight) },
	        palette: { type: 'v3v', value: palette.map((v) => new THREE.Vector3(...v)) },
	    },
	    vertexShader: vertexShader,
	    fragmentShader: fragmentShader
	})
	var imagePlane = new THREE.Mesh(planeGeo, planeMe)
	imagePlane.position.set(0, 0, 0)
	scene.add(imagePlane)

	var axisHelper = new THREE.AxisHelper(500);

	scene.add(axisHelper)

	function render() {
	    renderer.render(scene, camera)
	    requestAnimationFrame(render)
	}
	render()


/***/ })
/******/ ]);