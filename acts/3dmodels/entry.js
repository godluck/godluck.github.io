var zipLoader = require('../js/zipLoader-rav.js');
zipLoader.initLoad([
    'c.zip'
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
        'json': zipLoader.TYPE_URL,
    },
    mimeOptions: {
        'json': 'application/json'
    }
})
var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

var Stage = {
    // customVertexShader: vs1,
    // customFragmentShader: fs1,
    compositeScene: new THREE.Scene(),
    bufferScene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
        // antialias: true,
        precision: "highp",
        alpha: true,
        preserveDrawingBuffer: false
    }),
    camera: new THREE.PerspectiveCamera(45, w / h, 1, 10000),

    renderTargetParam: {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false,
    },

    initRender: function() {
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(2)
        return this;
    },
    initRenderTargets: function() {
        // var depthMap = new THREE.WebGLRenderTarget(w, h, this.renderTargetParam)
        var normalMap = new THREE.WebGLRenderTarget(w, h, this.renderTargetParam)
        // var objectMap = new THREE.WebGLRenderTarget(w, h, this.renderTargetParam)
        this.renderTarget = {
            // depthMap: depthMap,
            normalMap: normalMap,
            // objectMap: objectMap
        }
        return this;
    },
    initBufferCamera: function(cameraPosition) {
        this.camera.position.set(...cameraPosition);
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        this.bufferScene.add(this.camera);
        return this;
    },
    initBufferLight: function(lightPosition) {
        var lightBase = new THREE.AmbientLight(0xcccccc);
        var light = new THREE.PointLight(0x111111);
        light.position.set(...lightPosition)
        this.bufferScene.add(lightBase)
        this.bufferScene.add(light)
        return this;
    },
    initCanvas: function() {
        document.body.appendChild(this.renderer.domElement)
        return this;
    },
    loadObject: function(objectPosition, cb) {
        var self = this;
        var loader = this.loader = new THREE.JSONLoader();
        loader.load(this.f['bigfinal2.json'], function(g, m) {
            var texture = new THREE.TextureLoader().load(self.f['big-RGBA.png']);
            var lightmap = new THREE.TextureLoader().load(self.f['mainlm5.jpg']);
            var m = new THREE.MeshToonMaterial({
                map: texture,
                lightMap: lightmap,
                lightMapIntensity: 1
            });
            m.specular.r = .025,
                m.specular.g = .025,
                m.specular.b = .0125,
                m.shininess = 50;
            var mesh = new THREE.Mesh(g, m);
            mesh.position.set(...objectPosition);
            self.bufferScene.add(mesh)
            self.MeshTarget = mesh;
            cb && cb(mesh)
        })
        return this;
    },
    addControl: function(controlCenter, camera) {
        var OrbitControl = THREE.loadOrbit(THREE);
        var control = new OrbitControl(camera)
        control.target.x = controlCenter[0];
        control.target.y = controlCenter[1];
        control.target.z = controlCenter[2];
        return this;
    },
    renderMap: function(scene, camera, target, material) {
        scene.overrideMaterial = material || null;
        this.renderer.setClearColor(0xffffff);
        // this.renderer.clearTarget(target, true, true);
        this.renderer.render(scene, camera, target)
        return this;
    },
    render: function(scene, camera) {
        this.renderer.render(scene, camera)
        return this;
    },
    composite: function(normalMap) {
        // var compositeMaterial = new THREE.MeshBasicMaterial()
        // var geo = new THREE.PlaneGeometry(w, h);
        // var mesh = new THREE.Mesh(geo, compositeMaterial);
        // this.compositeScene.add(mesh);
        this.render(this.bufferScene, this.camera)
        return this;
    },
    normalMaterial: new THREE.MeshNormalMaterial(),
    f: function(f) {
        this.f = f;
        return this;
    }
}


function initPage(f) {
    Stage
        .f(f)
        .initRender()
        .initCanvas()
        .initRenderTargets()
        .initBufferCamera([5,5,5])
        .initBufferLight([2, 2, 2])
        // .initBufferLight([4, 4, 4])
        .addControl([0, 0, 0], Stage.camera)
        .loadObject([0, 0, 0], function() {
            render()
            // console.log(Stage.MeshTarget.skeleton)
        })
}
// var p;
// setTimeout(function(){
//     cancelAnimationFrame(p)
// },10000)

function render() {
    // Stage.MeshTarget.rotation.y += 0.01;
    // Stage.MeshTarget.skeleton.bones[0].rotation.x += 0.1;
    // Stage.MeshTarget.skeleton.bones[1].rotation.x -= 0.1;
    // Stage.MeshTarget.skeleton.bones[1].rotation.y -= 0.1;
    // Stage.MeshTarget.rotation.y += 0.15;
    // Stage.MeshTarget.rotation.z += 0.075;
    window.Stage = Stage
    // Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.objectMap)
    // Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.depthMap, new THREE.MeshDepthMaterial())
    // Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.normalMap, Stage.normalMaterial)
    // Stage.composite(Stage.renderTarget.objectMap.texture, Stage.renderTarget.depthMap.texture, Stage.renderTarget.normalMap.texture)
    // Stage.composite(Stage.renderTarget.normalMap.texture)
    // setTimeout(render,1000)
    // render()
    p = requestAnimationFrame(render)

    Stage.composite(Stage.compositeScene, Stage.camera)

}

function initFPS(options) {
    var raf = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();
    var caf = (function() {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id)
            };
    })();
    var container = document.createElement('div')
    container.className = 'PSC_FPS'
    container.style.position = 'fixed'
    container.style.left = '10px'
    container.style.top = '10px'
    container.style.padding = '5px'
    container.style.fontSize = '20px'
    document.body.appendChild(container)
    var showFPS = function(fps) {
        container.innerHTML = 'FPS:' + fps
    }
    var fpsdata = []
    var start = Date.now()
    var frame;
    var tick = function() {
        var now = Date.now()
        var timeInterval = now - start;
        if (timeInterval) {
            var fps = 1000 / timeInterval
            fpsdata.push(fps)
        }
        start = now;
        frame = raf(tick)
    }
    var show = setInterval(function() {
        var sum = 0;
        for (var i = 0; i < fpsdata.length; i++) {
            sum += fpsdata[i];
        }
        var fps_average = sum / fpsdata.length;
        fpsdata = []
        showFPS(~~fps_average)
    }, 500)
    tick()

    return {
        destory: function() {
            clearInterval(show)
            caf(frame)
            container.innerHTML = ''
            document.body.removeChild(container)
        }
    }
}
initFPS()