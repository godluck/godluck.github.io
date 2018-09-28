var vertexShader = `
    varying vec2 t_uv;
    uniform vec2 canvas_size;
    void main(){
        t_uv = uv;
        vec2 clipspace = position.xy / canvas_size * 2.0 ;
        gl_Position =  vec4( clipspace,0.0, 1.0 );
        // gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`
var fragmentShader = `
    varying vec2 t_uv;
    uniform vec2 u_texture_size;
    uniform vec3 CameraPosition;
    uniform vec3 LightPosition;
    uniform mat4 rotation;
    float Epsilon = 0.06;
    float eEpsilon = 0.06;
    vec3 ViewPlanePosition = vec3(0.,0.,5.);
    // vec3 CameraPosition = vec3(0.,0.,6.);
    // vec3 LightPosition = vec3(-1.,-3.,3.);
    float ViewPlaneSize = 5.;
    const int MAX_MARCH_STEP = 20;
    float MAX_DEPTH_TEST = 100.;
    vec3 opTx( vec3 p){
        vec3 q = (rotation*vec4(p,1.)).xyz;
        return q;
    }
    float opU( float d1, float d2 ){
        return min(d1,d2);
    }
    float SDF_Sphere(vec3 p){
        p = opTx(p);
        vec2 t = vec2(2.,.3);
        vec2 q = vec2(length(p.xz)-t.x,p.y);
        float t1 = length(q)-t.y;

        float t2 = length(p)- 1.;

        t = vec2(3.,.3);
        q = vec2(length(p.xz)-t.x,p.y);
        float t3 = length(q)-t.y;

        return opU(opU(t1,t2),t3);
    }
    vec3 SDF_getSphereNormal(vec3 p){
        return normalize(vec3(
            SDF_Sphere(vec3(p.x + eEpsilon,p.yz)) - SDF_Sphere(vec3(p.x - eEpsilon,p.yz)),
            SDF_Sphere(vec3(p.x,p.y + eEpsilon,p.z)) - SDF_Sphere(vec3(p.x,p.y - eEpsilon,p.z)),
            SDF_Sphere(vec3(p.xy,p.z + eEpsilon)) - SDF_Sphere(vec3(p.xy,p.z - eEpsilon))
        ));
    }
    void main(){
        vec3 ViewPointPosition = vec3(t_uv * ViewPlaneSize - vec2(2.5,2.5), 0)+ViewPlanePosition;
        vec3 ViewRayDirection = normalize(ViewPointPosition - CameraPosition);
        bool hitSphere = false;
        float depth = 0.;
        vec3 hitPoint = ViewPointPosition;
        for(int i = 0;i<MAX_MARCH_STEP;i++){
            float dist = SDF_Sphere(ViewPointPosition + depth * ViewRayDirection);
            if(dist <= Epsilon){
                hitSphere = true;
                hitPoint = ViewPointPosition + depth * ViewRayDirection;
                break;
            }
            depth += dist;
            if(depth > MAX_DEPTH_TEST){
                break;
            }
        }
        if(hitSphere){
            vec3 normal = SDF_getSphereNormal(hitPoint);
            float lighting = dot(normal , normalize(LightPosition - hitPoint));
            gl_FragColor = vec4(vec3(1.,1.,1.)*lighting * .5 + vec3(.5,.5,.5),1.);
        }else{
            gl_FragColor = vec4(0.1,0.1,0.1,1.);
        }
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
camera.position.set(0, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0))
//添加画布到页面
document.body.appendChild(renderer.domElement);
//设置画布背景色
renderer.setClearColor(0x000000);
scene.add(camera);

var planeGeo = new THREE.PlaneBufferGeometry(512, 512)
var planeMe = new THREE.ShaderMaterial({
    uniforms: {
        // u_texture: { type: "t", value: new THREE.TextureLoader().load("gg4.png") },
        u_texture_size: { type: "v2", value: new THREE.Vector2(512, 256) },
        // dither_array: { type: "t", value: dataTexture },
        canvas_size: { type: 'v2', value: new THREE.Vector2(document.documentElement.clientWidth, document.documentElement.clientHeight) },
        CameraPosition: { type: 'v3', value: new THREE.Vector3(0, 0, 6) },
        LightPosition: { type: 'v3', value: new THREE.Vector3(-1., -3., 3.) },
        rotation: { type: 'm4', value: new THREE.Matrix4().getInverse(new THREE.Matrix4().makeRotationX(Math.PI / 2)) }
        // palette: { type: 'v3v', value: palette.map((v) => new THREE.Vector3(...v)) },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
})
window.planeMe = planeMe;
var imagePlane = new THREE.Mesh(planeGeo, planeMe)
imagePlane.position.set(0, 0, 0)
scene.add(imagePlane)

var axisHelper = new THREE.AxisHelper(500);

scene.add(axisHelper)
var frame = 0;

function render() {
    frame++;
    renderer.render(scene, camera)
    requestAnimationFrame(render)
    planeMe.uniforms.rotation.value = new THREE.Matrix4().getInverse(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI * (frame%240)/240*2,Math.PI * (frame%240)/240*2,Math.PI * (frame%240)/240*2,'YXZ')))
}
render()


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
    container.style.color = '#fff'
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