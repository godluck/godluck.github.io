import './index.scss'

const dw = document.documentElement.clientWidth;
const dh = document.documentElement.clientHeight;
const dpr = window.devicePixelRatio || 2
const cw = dpr * dw
const ch = dpr * dh
if (process.env.NODE_ENV !== 'production') {
    require('./index.html')
    setTimeout(init, 300)
} else {
    init()
}

function init() {
    var img = new Image()
    img.src = require('./img/hue.png')
    img.onload = function() {
        initWebGL(img)
    }
}

function initWebGL(img) {
    var canvas = $('.painter')[0]
    canvas.width = cw
    canvas.height = ch
    var webgl = canvas.getContext('webgl')

    var attributes = [{
        name: 'a_position',
        ptype: 'vec3',
        value: [
            0, 0,
            cw, 0,
            0, cw,
            cw, 0,
            cw, cw,
            0, cw
        ],
        size: 2,
        type: webgl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
    }, {
        name: 'a_uv',
        ptype: 'vec2',
        value: [
            0, 0,
            1, 0,
            0, 1,
            1, 0,
            1, 1,
            0, 1
        ],
        size: 2,
        type: webgl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
    }]
    var uniforms = [{
        name: 'u_resolution',
        ptype: 'vec2',
        value: [
            cw, ch
        ]
    }, {
        name: 'u_textureSize',
        ptype: 'vec2',
        value: [
            img.width, img.height
        ]
    }, {
        name: 'u_texture',
        ptype: 'sampler2D',
        value: img,
        methodName: 'texImage2D'
    }, {
        name: 'u_hValue',
        ptype: 'float',
        value: 0
    }]
    var vs = createShader(webgl, webgl.VERTEX_SHADER, buildVertexShader(attributes, uniforms))
    var fs = createShader(webgl, webgl.FRAGMENT_SHADER, buildFragmentShader())
    var program = createProgram(webgl, vs, fs)

    attachAttributes(webgl, program, attributes)
    setUpViewport(webgl, cw, ch)
    clear(webgl)
    activateProgram(webgl, program)
    activateAttributes(webgl, attributes)
    attachUniforms(webgl, program, uniforms)
    // var textures = []
    // var frameBuffers = []
    // var t1 = buildTextures(webgl)
    // textures.push(t1)
    // webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, img.width, img.height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);
    // var f1 = webgl.createFramebuffer()
    // frameBuffers.push(f1)
    // webgl.bindFramebuffer(webgl.FRAMEBUFFER, f1)
    // webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, t1, 0)

    // var t2 = buildTextures(webgl)
    // webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, img.width, img.height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);
    // var f2 = webgl.createFramebuffer()
    // frameBuffers.push(f2)
    // webgl.bindFramebuffer(webgl.FRAMEBUFFER, f2)
    // webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, t2, 0)
    var max = 100
    var f = 0
    frame()

    function frame() {
        requestAnimationFrame(frame)
        f++
        uniforms[3].value = (f % max) / max
        webgl.uniform1f(uniforms[3].position, uniforms[3].value)
        drawTriangles(webgl, 0, attributes[0].value.length / attributes[0].size)
    }
}

function createShader(webgl, type, source) {
    var shader = webgl.createShader(type)
    webgl.shaderSource(shader, source)
    webgl.compileShader(shader)
    var success = webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log('shader' + '\n' + webgl.getShaderInfoLog(shader))
    webgl.deleteShader(shader)
}

function createProgram(webgl, vs, fs) {
    var program = webgl.createProgram()
    webgl.attachShader(program, vs)
    webgl.attachShader(program, fs)
    webgl.linkProgram(program)
    var success = webgl.getProgramParameter(program, webgl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log('program' + '\n' + webgl.getProgramInfoLog(program))
    webgl.deleteProgram(program)
}

function buildVertexShader(as, us) {
    return `
        attribute vec4 a_position;
        attribute vec2 a_uv;
        uniform vec2 u_resolution;
        varying vec3 v_color;
        varying vec2 v_uv;
        void main(){
            gl_Position = vec4(vec2(a_position.xy / u_resolution * 2. - 1.) * vec2(1.,-1.), 0, 1);
            v_color = gl_Position.xyz * 0.5 + 0.5;
            v_uv = a_uv;
        }
    `
}

function buildFragmentShader() {
    return `
        precision highp float;

        vec3 rgb2hsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        vec3 hsv2rgb(vec3 c){
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        uniform sampler2D u_texture;
        uniform vec2 u_textureSize;
        uniform float u_hValue;
        varying vec3 v_color;
        varying vec2 v_uv;
        void main(){
            vec2 p = 1. / u_textureSize;
            vec4 color = texture2D(u_texture,v_uv);
            vec3 hsv = rgb2hsv(color.xyz);
            if(hsv.x > u_hValue){
                hsv.x = u_hValue;
            }
            vec3 color2 = hsv2rgb(hsv);
            gl_FragColor = vec4(color2,color.w);
            // gl_FragColor = (texture2D(u_texture,v_uv) + texture2D(u_texture,v_uv + p * 2.) +texture2D(u_texture,v_uv - p * 2.) +texture2D(u_texture,v_uv + p * vec2(2.,-2.)) +texture2D(u_texture,v_uv + p * vec2(-2.,2.))) / 5.;
            //vec4(v_color,1);
        }
    `
}

function activateProgram(webgl, pro) {
    webgl.useProgram(pro)
}

function attachAttributes(webgl, program, attributes) {
    attributes.forEach(v => {
        var attributeLocation = webgl.getAttribLocation(program, v.name)
        v.position = attributeLocation
        var buffer = webgl.createBuffer()
        v.buffer = buffer
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(v.value), webgl.STATIC_DRAW)
    })
}

function activateAttributes(webgl, attributes) {
    attributes.forEach(v => {
        webgl.enableVertexAttribArray(v.position)
        webgl.bindBuffer(webgl.ARRAY_BUFFER, v.buffer)
        webgl.vertexAttribPointer(v.position, v.size, v.type, v.normalize, v.stride, v.offset)
    })
}

function attachUniforms(webgl, program, uniforms) {
    uniforms.forEach(v => {
        var uniformLocation = v.position || webgl.getUniformLocation(program, v.name)
        v.position = uniformLocation
        switch (v.ptype) {
            case 'float':
                webgl.uniform1f(uniformLocation, v.value)
                break;
            case 'vec2':
                webgl.uniform2fv(uniformLocation, v.value)
                break;
            case 'sampler2D':
                var texture = webgl.createTexture();
                webgl.bindTexture(webgl.TEXTURE_2D, texture);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, v.value)
                break;
        }
    })
}

function setUpViewport(webgl, width, height) {
    webgl.viewport(0, 0, width, height)
}

function clear(webgl) {
    webgl.clearColor(0, 0, 0, 0)
    webgl.clear(webgl.COLOR_BUFFER_BIT)
}

function drawTriangles(webgl, offset, iteration) {
    var primitiveType = webgl.TRIANGLES
    webgl.drawArrays(primitiveType, offset, iteration)
}

function buildTextures(webgl) {
    var texture = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D, texture);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    return texture;
}

function setFramebuffer(webgl, framebuffer, width, height) {
    // make this the framebuffer we are rendering to.
    // webgl.bindFramebuffer(webgl.FRAMEBUFFER, framebuffer);

    // Tell the shader the resolution of the framebuffer.
    // webgl.uniform2f(resolutionLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    // webgl.viewport(0, 0, width, height);
}