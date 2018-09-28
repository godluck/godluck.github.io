var zipLoader = require('../js/zipLoader-rav.js');
zipLoader.initLoad([
    'combine.zip'
], {
    loadOptions: {
        success: function(f) {
            initPage(f)
        },
        error: function(e) {
            console.log(e)
        },
        progress: function(p) {
            console.log(p)
        }
    },
    returnOptions: {
        'json': zipLoader.TYPE_TEXT,
    },
    mimeOptions: {
        'json': 'application/json'
    }
})

function initPage(files) {
    var vertexShader = `
    	varying float size;
    	attribute vec3 positionT;
    	attribute float offset;
    	uniform float progress;
		void main(){
			float cp = min(max(progress - offset,0.) / .7, 1.);
			vec3 midPosition = mix(position,positionT,cp);
			vec4 po = projectionMatrix * modelViewMatrix * vec4(midPosition,1.);
			size = 1. / distance(midPosition.xyz,cameraPosition);
			gl_Position = po;
			gl_PointSize = 8.;
		}
	`
    var fragmentShader = `
    	varying float size;
		void main(){
			vec2 coord = gl_PointCoord * 2. - 1.;
			float dis = dot(coord,coord);
			if(dis > min(1.,2. * size)){
				discard;
			}else{
				gl_FragColor = vec4(1.,1.,1.,1.);
			}
		}
	`
        //场景
    var scene = new THREE.Scene();
    //渲染器
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    //设置大小为全屏
    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    //启动阴影
    //创建视角摄像机，张角45度，宽高比与画布宽高比相同，视角距离从1到1000
    var camera = new THREE.PerspectiveCamera(45, document.documentElement.clientWidth / document.documentElement.clientHeight, 1, 10000);
    //设置摄像机位置
    camera.position.set(2, 4, 4);
    camera.lookAt(new THREE.Vector3(0, 0, 0))
        //添加画布到页面
    $(renderer.domElement).css('background', 'black')
    document.body.appendChild(renderer.domElement);
    //设置画布背景色
    // renderer.setClearColor(0x000000);
    scene.add(camera);
    var loader = new THREE.JSONLoader();

    var obj1_json = JSON.parse(files['cpmovie4.json']).vertices;
    var obj2_json = JSON.parse(files['cpkv3.json']).vertices;
    var vertices = fixVertices(obj1_json, obj2_json);
    var obj1_ab = Float32Array.from(vertices.v1)
    var obj2_ab = Float32Array.from(vertices.v2);
    var offsets = Float32Array.from(vertices.offsets);
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(obj1_ab, 3))
    geometry.addAttribute('positionT', new THREE.BufferAttribute(obj2_ab, 3))
    geometry.addAttribute('offset', new THREE.BufferAttribute(offsets, 1))
        // load a resource
    var planeMe = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            progress: { type: 'f', value: '.5' }
        }
    })

    var object = new THREE.Points(geometry, planeMe);
    object.position.set(4, 0, 0)
    scene.add(object);

    var axisHelper = new THREE.AxisHelper(500);
    scene.add(axisHelper)
    var OrbitControl = THREE.loadOrbit(THREE);
    var control = new OrbitControl(camera)

    var frames = 180;
    var frameCount = 0;

    function render() {
        frameCount++;
        var progress = Math.floor(frameCount / frames) % 2 == 0 ? (frameCount % frames) / frames : (frames - (frameCount % frames)) / frames
        planeMe.uniforms.progress.value = progress;
        planeMe.needsUpdate = true;
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    render()

}

function fixVertices(arr1, arr2) {
    if (arr1.length == arr2.length) return;
    var longest = arr1.length > arr2.length ? arr1 : arr2;
    var shortest = arr1.length < arr2.length ? arr1 : arr2;
    var loopTime = Math.floor(longest.length / shortest.length)
    var loopTail = longest.length - shortest.length * loopTime;
    for (var i = 0; i < loopTime - 1; i++) {
        shortest = shortest.concat(shortest)
    }
    shortest = shortest.concat(shortest.slice(0, loopTail))
    var offsets = []
    for (var i = 0; i < longest.length / 3; i++) {
        offsets.push(Math.random() * .3)
    }
    if (longest == arr1) {
        return {
            v1: arr1,
            v2: shortest,
            offsets:offsets
        }
    } else {
        return {
            v1: shortest,
            v2: arr2,
            offsets:offsets
        }
    }
}
