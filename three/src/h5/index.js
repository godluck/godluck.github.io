import './index.scss'
import './lib/GPUComputationRenderer.js'

const dw = document.documentElement.clientWidth;
const dh = document.documentElement.clientHeight;
const dpr = window.devicePixelRatio || 2
const cw = dpr * dw
const ch = dpr * dh
const THREE = window.THREE
const O = new THREE.Vector3(0, 0, 0)
const frames = []
const r3 = Math.sqrt(3)
if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    let renderer = new THREE.WebGLRenderer()

    renderer.setSize(dw, dh)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 1)
    document.body.appendChild(renderer.domElement)

    let scene = new THREE.Scene()
    let camera = addCamera(scene)

    let fragmentShader = getFragmentShader()
    let vertexShader = getVertexShader()
    let material = new THREE.ShaderMaterial({
        uniforms: {
            textureVelocity: { value: null },
            texturePosition: { value: null },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
    })
    addShapes(scene, material)
    addLight(scene)
    render(renderer, scene, camera)
    window.scene = scene


    let fragmentShaderPos = getShaderPos()
    let fragmentShaderVel = getShaderVel()

    let gpuCompute = new window.GPUComputationRenderer(128, 128, renderer);
    let pos0 = gpuCompute.createTexture();
    let vel0 = gpuCompute.createTexture();
    let velVar = gpuCompute.addVariable('textureVelocity', fragmentShaderVel, vel0);
    let posVar = gpuCompute.addVariable('texturePosition', fragmentShaderPos, pos0);
    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);
    velVar.material.uniforms.time = { value: 0.0 };
    let error = gpuCompute.init();
    if (error !== null) {
        console.error(error);
    }
    frames.push(function() {
        gpuCompute.compute()
        material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(posVar).texture;
        material.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velVar).texture;
    })
}


function addCamera(scene) {
    let camera = new THREE.PerspectiveCamera(60, dw / dh, 0.1, 1000)
    camera.position.set(0, 0, 50)
    camera.lookAt(O)
    scene.add(camera)
    return camera
}

function addLight(scene) {
    // let aLight = new THREE.AmbientLight(0xffffff);
    // scene.add(aLight)
}


function addShapes(scene, material) {
    let nums = new THREE.BufferAttribute(new Float32Array(600), 3);
    for (let i = 0; i < nums.count; i++) {
        nums.setXYZ(i, i, i, i)
    }
    let geometry = new THREE.BufferGeometry();
    // geometry.maxInstancedCount = 1000
    // let geometry = new THREE.PlaneBufferGeometry(1,1);
    geometry.addAttribute('position', nums)
    console.log(geometry)
    let plane = new THREE.Points(geometry, material)
    scene.add(plane)
}

function render(renderer, scene, camera) {
    frame()

    function frame() {
        requestAnimationFrame(frame)
        frames.forEach(v => v())
        renderer.render(scene, camera)
    }
}


function getVertexShader() {
    return `
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        varying vec3 vel;
        void main() {
            vec2 uv;
            uv.x = mod(position.x,128.) / 128.;
            uv.y = position.x / 128. / 128.;
            vec3 position3 = texture2D(texturePosition,uv).xyz / 32.;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position3,1.);
            gl_PointSize = 10.;
            vel = texture2D(textureVelocity,uv).xyz;
        }
    `
}

function getFragmentShader() {
    return `
        varying vec3 vel;
        void main() {
            float d = length(gl_PointCoord.xy - 0.5);
            float alpha = 2. / 5. * sqrt(2.)  -  d;
            gl_FragColor = vec4(1.,0.,0.,alpha);
        }
    `
}

function getShaderPos() {
    return `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
            i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
        dot(p2, x2), dot(p3, x3)));
}
// vec2 curlNoise(vec2 p) {
//     float e = 0.0001;
//     float n1, n2, a, b;
//     n1 = snoise(vec2(p.x, p.y + e));
//     n2 = snoise(vec2(p.x, p.y - e));
//     a = (n1 - n2) / (2. * e);
//     n1 = snoise(vec2(p.x + e, p.y));
//     n2 = snoise(vec2(p.x - e, p.y));
//     b = (n1 - n2) / (2. * e);
//     return vec2(a, -b);
// }
vec3 curlNoise(vec3 p) {

    const float e = 0.1;

    float n1 = snoise(vec3(p.x, p.y + e, p.z));
    float n2 = snoise(vec3(p.x, p.y - e, p.z));
    float n3 = snoise(vec3(p.x, p.y, p.z + e));
    float n4 = snoise(vec3(p.x, p.y, p.z - e));
    float n5 = snoise(vec3(p.x + e, p.y, p.z));
    float n6 = snoise(vec3(p.x - e, p.y, p.z));

    float x = n2 - n1 - n4 + n3;
    float y = n4 - n3 - n6 + n5;
    float z = n6 - n5 - n2 + n1;


    const float divisor = 1.0 / (2.0 * e);
    return normalize(vec3(x, y, z) * divisor);
}
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D(texturePosition, uv);
    vec3 position = tmpPos.xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;
    if (length(position) == 0.) {
        position = vec3((uv.x + uv.y) * 300. - 300.,rand(uv) * 300. - 150.,1.);
    }
    if (length(position) > 150.) {
        // position *= -rand(position.xy);
    }
    gl_FragColor = vec4(position + velocity * rand(velocity.xy), 1.);
}
    `
}

function getShaderVel() {
    return `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
            i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
        dot(p2, x2), dot(p3, x3)));
}
vec3 curlNoise( vec3 p ){

  const float e = 0.1;

  float  n1 = snoise(vec3(p.x, p.y + e, p.z));
  float  n2 = snoise(vec3(p.x, p.y - e, p.z));
  float  n3 = snoise(vec3(p.x, p.y, p.z + e));
  float  n4 = snoise(vec3(p.x, p.y, p.z - e));
  float  n5 = snoise(vec3(p.x + e, p.y, p.z));
  float  n6 = snoise(vec3(p.x - e, p.y, p.z));

  float x = n2 - n1 - n4 + n3;
  float y = n4 - n3 - n6 + n5;
  float z = n6 - n5 - n2 + n1;


  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D(texturePosition, uv);
    vec3 position = tmpPos.xyz / 128.;
    vec3 velocity = curlNoise(position);
    gl_FragColor = vec4(velocity, 1.);
}
    `
}