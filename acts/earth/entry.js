var loader = require('./zipLoader.js')
var Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    })()
};

function init() {
    if (!Detector.webgl) {
        $('.e-shadow').attr('src', 'https://yanxuan.nosdn.127.net/15114231984044087.png').show()
        return false;
    }
    loader.initLoad(['https://yanxuan.nosdn.127.net/15114221035346VHBR1MTP.flv'], {
        loadOptions: {
            success: function(f) {
                var i = "three.min.js"
                var script = $(document.createElement('script'))
                $('body').append(script)
                script[0].onload = function() {
                    initEarth(f, $('.e-earth')[0])
                }
                script.attr('src', f[i])
            },
            error: function(e) {
                // console.log(e)
            },
            progress: function(p) {
                // console.log(p)
            }
        },
        returnOptions: {
            'json': loader.TYPE_URL,
            'js': loader.TYPE_URL
        },
        mimeOptions: {
            'json': 'application/json',
            'js': 'application/javascript'
        }
    })
    return true
}
var paused = false;
var c2 = 0;

function initEarth(f, c) {
    var THREE = window.THREE
    var texturePath = f['1.jpg']
    $('.e-shadow').attr('src', f['shadow3.png']).show()
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: c
    });
    // renderer.setSize(1024, 1024);
    var camera = new THREE.PerspectiveCamera(45, 1, 1, 2000);
    renderer.setClearColor(0xffffff, 0);
    // renderer.setPixelRatio(2)
    camera.position.set(300, 0, 0)
    camera.lookAt(new THREE.Vector3())
    scene.add(camera);

    var light = new THREE.AmbientLight(0x555555);
    scene.add(light)


    var pointLight = new THREE.PointLight(0xffffff, 1, 0, 1000);
    pointLight.position.set(0, 300, 300)
    scene.add(pointLight)

    var pointLight = new THREE.PointLight(0xaaaaaa, 1.5, 0, 1000);
    pointLight.position.set(300, 300, 200)
    scene.add(pointLight)

    var tloader = new THREE.TextureLoader()
    tloader.load(texturePath, initSphere)
    var sphere, g, s = [],
        t = [];

    function initSphere(t) {
        var material = new THREE.MeshLambertMaterial({
            map: t,
            morphNormals: true,
            morphTargets: true,
        })
        var geo = new THREE.SphereGeometry(100, 80, 80)
        sphere = new THREE.Mesh(geo, material)
        scene.add(sphere)
        sphere.rotateZ(-Math.PI / 5)
        // var material = new THREE.ShaderMaterial({
        //     uniforms: {},
        //     vertexShader: document.getElementById('vertexShader').textContent,
        //     fragmentShader: document.getElementById('fragmentShader').textContent,
        //     side: THREE.BackSide,
        //     blending: THREE.AdditiveBlending,
        //     transparent: true
        // })
        // var geo = new THREE.SphereGeometry(115, 25, 25)
        // var _sphere = new THREE.Mesh(geo, material)
        // _sphere.position.set(0, 5, 5)
        // scene.add(_sphere)
        // var ua = navigator.userAgent
        // if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        // initUserAction()
        // renderer.render(scene, camera)
        // } else {
        frame()
        // }
        initSprits()
    }



    function initSprits() {
        g = new THREE.Group()
        var positions = [
            [1000, 233],
            [1055, 242],
            [1100, 247],
            [1122, 290],
            [1599, 424],
            [1637, 442],
            [1813, 305],
            [1921, 507],
        ]
        for (var i = 1; i < 9; i++) {
            var texturePath = f['label-' + i + '.png']
            var material = new THREE.SpriteMaterial({
                map: tloader.load(texturePath),
                depthTest: false
            })
            var sprite = new THREE.Sprite(material)
            sprite.scale.set(106 / 5 * 2 * .7, 250 / 5 * 2 * .7, 1)
            var p = getPosition3d(positions[i - 1], 100, [2048, 1024])
            sprite.jd = p.j
            // console.log(sprite.jd)
            // console.log((sprite.jd - Math.PI / 4 + Math.PI * 4) % (Math.PI * 2), (sprite.jd + Math.PI / 4 + Math.PI * 4) % (Math.PI * 2))
            sprite.position.set(p[0], p[1], p[2])
            g.add(sprite)
            s.push(sprite)
        }
        for (var i = 1; i < 9; i++) {
            var texturePath = f['tag-' + i + '.png']
            var material = new THREE.SpriteMaterial({
                map: tloader.load(texturePath),
                depthTest: false
            })
            var sprite = new THREE.Sprite(material)
            sprite.scale.set(100 / 5 * 2, 80 / 5 * 2, 1)
            var p = getPosition3d(positions[i - 1], 100, [2048, 1024])
            sprite.jd = p.j
            // console.log(sprite.jd)
            // console.log((sprite.jd - Math.PI / 4 + Math.PI * 4) % (Math.PI * 2), (sprite.jd + Math.PI / 4 + Math.PI * 4) % (Math.PI * 2))
            sprite.position.set(p[0], p[1], p[2])
            g.add(sprite)
            t.push(sprite)
        }
        g.rotateZ(-Math.PI / 5)
        scene.add(g)
    }

    var framec = 0;
    var degree = 0;
    var speed = Math.PI / 180 / 5 * 3

    function frame() {
        requestAnimationFrame(frame)
        c2++
        if (paused) return;
        framec++
        degree += speed / 2
        degree %= Math.PI * 4
        if (framec % 2 != 0) return

        if (sphere) {
            sphere.rotateY(-speed)
        }
        if (g) {
            g.rotateY(-speed)
        }
        s.forEach((v, i) => {
            animateSprite(v, near(v.jd, Math.PI / 4, degree, i))
        })
        t.forEach((v, i) => {
            animateTag(v, near(v.jd, Math.PI / 4, degree, i))
        })
        renderer.render(scene, camera)
    }

    function initUserAction() {
        var width = $(c).width()
        var position
        $(c).on({
            touchstart: handleStart,
            touchmove: handleMove,
            touchend: handleEnd,
            touchcancel: handleEnd,
        })

        function handleStart(e) {
            var touch = e.changedTouches[0]
            position = [touch.pageX, touch.pageY]
        }

        function handleMove(e) {
            var touch = e.changedTouches[0]
            var _position = [touch.pageX, touch.pageY]
            var offsetX = position[0] - _position[0]
            position = _position
            degree += offsetX / width * Math.PI / 3 + Math.PI * 4
            degree %= Math.PI * 4
            if (sphere) {
                sphere.rotateY(-offsetX / width * Math.PI / 3)
            }
            if (g) {
                g.rotateY(-offsetX / width * Math.PI / 3)
            }
            s.forEach((v, i) => {
                animateSprite(v, near(v.jd, Math.PI / 4, degree, i))
            })
            t.forEach((v, i) => {
                animateTag(v, near(v.jd, Math.PI / 4, degree, i))
            })
            renderer.render(scene, camera)
        }

        function handleEnd(e) {

        }
    }
}

function animateSprite(s, q) {
    if (!q) {
        s.visible = false;
        return;
    }
    q = q > 1 ? 1 : q < 0 ? 0 : q
    var progress = 32 * (1 / 16 - Math.pow((q - 0.5), 4))
    progress = progress > 1 ? 1 : progress
    s.scale.set(106 / 5 * 2 * .7 * progress, 250 / 5 * 2 * .7 * progress, 1)
    s.material.opacity = progress
    s.visible = true;
}

function animateTag(s, q) {
    if (!q) {
        s.visible = false;
        return;
    }
    q = q > 1 ? 1 : q < 0 ? 0 : q
    var progress = 32 * (1 / 16 - Math.pow((q - 0.5), 4))
    progress = progress > 1 ? 1 : progress
    s.material.opacity = progress
    s.visible = true;
}

function near(dc, d, t, index) {
    // t = t % (Math.PI * 2)
    var min = (dc - d + Math.PI * 8) % (Math.PI * 4) + (index % 2) * Math.PI * 2
    var max = (dc + d + Math.PI * 8) % (Math.PI * 4) + (index % 2) * Math.PI * 2
    if (min > max) {
        if (t > min) {
            return (t - min) / d / 2
        } else if (t < max) {
            return (Math.PI * 4 - min + t) / d / 2
        }
    } else {
        return (t - min) / d / 2
    }
    return 0
}

function getPosition3d(p, r, size) {
    var jd = Math.PI * 2 * (p[0] / size[0] - 0.5)
    var wd = Math.PI * (p[1] / size[1] - 0.5)
    var p1 = [r * Math.cos(jd), -r * Math.sin(jd)]
    var p2 = [p1[0] * Math.cos(wd), -r * Math.sin(wd), p1[1] * Math.cos(wd)]
    p2.j = jd
    p2.w = wd
    return p2
}

window.earth = module.exports = {
    init: init,
    pause: function() {
        paused = true
    },
    start: function() {
        paused = false;
    }
}
init()
earth.pause()
var t = []
window.onAppState = function(e) {
    t.push(e)
    $('.l-1').html(JSON.stringify(t))

    switch (e) {
        case 0:
            earth.start()
            break;
        case 1:
            earth.pause()
            break;
    }
}
// setTimeout(function(){
//     window.onerror = function(msg, url, line, col) {
//         alert(msg + '-' + line + '_' + col)
//     }
//     alert('ready')
// },2000)