var zipLoader = require('../js/zipLoader-rav.js');
zipLoader.initLoad([
    'combine.zip'
], {
    loadOptions: {
        success: function(f) {
            // initPage(f)
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
var w = 600;
var h = 600;
var vs1 = `
    varying vec3 vnormal;
    varying vec2 t_uv;
    uniform vec2 canvas_size;
    void main(){
        t_uv = uv;
        vec2 clipspace = position.xy / canvas_size * 2.0 ;
        gl_Position =  vec4( clipspace,0.0, 1.0 );
    }
`
var fs1 = `
    varying vec3 vnormal;
    varying vec2 t_uv;
    uniform vec2 canvas_size;
    // uniform sampler2D depthMap;
    uniform sampler2D normalMap;
    // uniform sampler2D objectMap;
    float planeDistance(vec3 positionA, vec3 normalA, vec3 positionB, vec3 normalB) {
        vec3 positionDelta = positionB-positionA;
        float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));
        return planeDistanceDelta;
    }
    void main(){
        // float depthCenter = texture2D(depthMap, t_uv).x;
        float px = 1. / canvas_size.x;
        float py = 1. / canvas_size.y;

        // vec3 leftpos = vec3(t_uv.x - px, t_uv.y, 1.0 - texture2D(depthMap, vec2(t_uv.x - px, t_uv.y)).r);
        // vec3 rightpos = vec3(t_uv.x + px, t_uv.y, 1.0 - texture2D(depthMap, vec2(t_uv.x + px, t_uv.y)).r);
        // vec3 uppos = vec3(t_uv.x, t_uv.y - py, 1.0 - texture2D(depthMap, vec2(t_uv.x, t_uv.y - px)).r);
        // vec3 downpos = vec3(t_uv.x, t_uv.y + py, 1.0 - texture2D(depthMap, vec2(t_uv.x, t_uv.y + px)).r);

        vec3 leftnor = texture2D(normalMap, vec2(t_uv.x - px, t_uv.y)).xyz;
        vec3 rightnor = texture2D(normalMap, vec2(t_uv.x + px, t_uv.y)).xyz;
        vec3 upnor = texture2D(normalMap, vec2(t_uv.x, t_uv.y - py)).xyz;
        vec3 downnor = texture2D(normalMap, vec2(t_uv.x, t_uv.y + py)).xyz;
        // vec2 planeDist = vec2(planeDistance(leftpos, leftnor, rightpos, rightnor),
        // planeDistance(uppos, upnor, downpos, downnor));

        // float planeEdge = 2.5 * length(planeDist);

        // planeEdge = 1.0 - 0.5 * smoothstep(0.0, depthCenter, planeEdge);

        float normEdge = max(length(leftnor - rightnor), length(upnor - downnor));

        normEdge = 1.0 - 0.5 * smoothstep(0.0, 0.5, normEdge); 

        // float edge= planeEdge * normEdge;
        float edge= normEdge;

        vec4 object = vec4(1.,1.,1.,1.); //texture2D(objectMap, t_uv);
        gl_FragColor = vec4(vec3(object * edge), 1.0);
    }
`
var Stage = {
    customVertexShader: vs1,
    customFragmentShader: fs1,
    compositeScene: new THREE.Scene(),
    bufferScene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({ antialias: true,preserveDrawingBuffer:true }),
    camera: new THREE.PerspectiveCamera(45, w / h, 1, 10000),

    renderTargetParam: {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false,
    },

    initRender: function() {
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(window.devicePixelRatio)
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
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
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
        loader.load('low-poly-mill.json', function(g, m) {
            // m.forEach(v=>v.skinning=true)
            var mesh = new THREE.Mesh(g, m);
            mesh.position.set(...objectPosition);
            self.bufferScene.add(mesh)
            self.MeshTarget = mesh;
            // self.skeleton = new THREE.SkeletonHelper(mesh);
            // self.skeleton.visible = true;
            // self.bufferScene.add(self.skeleton);
            // self.mixer = new THREE.AnimationMixer(mesh);
            // self.action = self.mixer.clipAction('Armature.001Action');
            // self.action.enabled = true;
            // self.action.setEffectiveTimeScale(1);
            // self.action.setEffectiveWeight(1);
            // self.action.play();
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
        this.renderer.render(scene, camera)
        return this;
    },
    render: function(scene, camera) {
        this.renderer.render(scene, camera)
        return this;
    },
    composite: function(normalMap) {
        /*var compositeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                // objectMap: { type: 't', value: objectMap },
                // depthMap: { type: 't', value: depthMap },
                normalMap: { type: 't', value: normalMap },
                canvas_size: { type: 'v2', value: new THREE.Vector2(w, h) },
            },
            vertexShader: this.customVertexShader,
            fragmentShader: this.customFragmentShader
        })
        var geo = new THREE.PlaneGeometry(w, h);
        var mesh = new THREE.Mesh(geo, compositeMaterial);
        this.compositeScene.add(mesh);*/
        this.render(this.bufferScene, this.camera)
        return this;
    },
    normalMaterial: new THREE.MeshNormalMaterial()
}


function initPage(f) {
    Stage
        .initRender()
        .initCanvas()
        .initRenderTargets()
        .initBufferCamera([2, 0, 0])
        .initBufferLight([2, 2, 2])
        // .initBufferLight([4, 4, 4])
        // .addControl([0,0,0], Stage.camera)
        .loadObject([0, -.6, 0], function() {
            render()
            // console.log(Stage.MeshTarget.skeleton)
        })
}
// var p;
// setTimeout(function(){
//     cancelAnimationFrame(p)
// },10000)

function render() {
    // Stage.mixer.update(1/60)
    // Stage.MeshTarget.rotation.y += 0.01;
    // Stage.MeshTarget.skeleton.bones[0].rotation.x += 0.1;
    // Stage.MeshTarget.skeleton.bones[1].rotation.x -= 0.1;
    // Stage.MeshTarget.skeleton.bones[1].rotation.y -= 0.1;
    // Stage.MeshTarget.rotation.y += 0.15;
    // Stage.MeshTarget.rotation.z += 0.075;
    window.Stage = Stage
    var canvas = Stage.renderer.domElement
    var p = new Image();
    var q = new Image();
    var r = new Image();
        Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.objectMap)
        q.src = canvas.toDataURL()
        Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.depthMap, new THREE.MeshDepthMaterial())
        r.src = canvas.toDataURL()
        Stage.renderMap(Stage.bufferScene, Stage.camera, Stage.renderTarget.normalMap, Stage.normalMaterial)
        p.src = canvas.toDataURL()
        // Stage.composite(Stage.renderTarget.objectMap.texture, Stage.renderTarget.depthMap.texture, Stage.renderTarget.normalMap.texture)
        // Stage.composite(Stage.renderTarget.normalMap.texture)
        // setTimeout(render,1000)
        // render()
    // p = requestAnimationFrame(render)

    // Stage.composite(Stage.compositeScene, Stage.camera)
        document.body.append(p)
        document.body.append(q)
        document.body.append(r)
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

initPage()
