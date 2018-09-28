var loader = require('./zipLoader.js')

var col = 50
var row = 50

var water = buildWater(col, row)
var tempWater = new Array(col * row)
var v = ('a').repeat(col * row - 1).split('a').map(v => 0)
var c = 1
var _t = 1 / 2

function buildWater(width, height) {
    var column = width || 20;
    var row = height || 20;
    var ps = []
    for (var i = 0; i < column; i++) {
        for (var j = 0; j < row; j++) {
            ps.push(1)
        }
    }
    return ps
}
// setInterval(function() {
//     var random = Math.floor(Math.random() * (water.length - 10)) + 5
//     for (var i = -4; i < 5; i++) {
//         water[random + i] = 10
//     }
// }, 500)

function moveWater(column, row) {
    for (var i = 0; i < column; i++) {
        for (var j = 0; j < row; j++) {
            var t1 = water[(i - 1) * row + j],
                t2 = water[(i + 1) * row + j],
                t3 = water[i * row + j + 1],
                t4 = water[i * row + j - 1];
            if (!(i > 0 && i < column - 1 && j > 0 && j < row - 1)) {
                if (i < 1) { t1 = water[i * row + j] / water[i * row + j] }
                if (i > column - 2) { t2 = water[i * row + j] / water[i * row + j] }
                if (j > row - 2) { t3 = water[i * row + j] / water[i * row + j] }
                if (j < 1) { t4 = water[i * row + j] / water[i * row + j] }
            }
            var f = c * c * (t1 + t2 + t3 + t4 - water[i * row + j] * 4) / 1 / 1
            var _f = -.1 * v[i * row + j]
            f += _f
            v[i * row + j] = v[i * row + j] ? v[i * row + j] + f * _t : f * _t
            tempWater[i * row + j] = v[i * row + j] * _t + water[i * row + j]
            if (v[i * row + j] != v[i * row + j]) {
                console.log(i, j)
                console.log(water[i * row + j])
                console.log(t1, t2, t3, t4)
            }
        }
    }
    var temp = water
    water = tempWater
    tempWater = temp
}

function init() {
    loader.initLoad(['./tinified.zip'], {
        loadOptions: {
            success: function(f) {
                var i = "three.min.js"
                var script = $(document.createElement('script'))
                $('body').append(script)
                script[0].onload = function() {
                    initEarth(f)
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

function initEarth(f, c) {
    var THREE = window.THREE
    var scene = new THREE.Scene();


    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: document.getElementById('c')
    });
    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = true;
    // renderer.setPixelRatio(2)


    var camera = new THREE.PerspectiveCamera(45, 1, 1, 2000);
    camera.position.set(0, -60, 150)
    camera.lookAt(new THREE.Vector3())
    scene.add(camera);
    // var OrbitControl = THREE.loadOrbit(THREE);
    // var control = new OrbitControl(camera)


    var light = new THREE.AmbientLight(0x444444);
    scene.add(light)


    var pointLight = new THREE.PointLight(0xaaaaaa, 1, 0, 1000);
    pointLight.position.set(0, 60, 20)
    scene.add(pointLight)


    pointLight.castShadow = true
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 1500;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;


    var material = new THREE.MeshStandardMaterial({
        color: 0x68d0fe,
        morphNormals: true,
        morphTargets: true,
        side: THREE.DoubleSide,
        opacity: .5,
        transparent:true,
        reflectivity:.5,
        refractionRatio:.5
    })

    var geo = new THREE.PlaneGeometry(100, 100, col - 1, row - 1)

    plane = new THREE.Mesh(geo, material)
    plane.receiveShadow = true;
    plane.castShadow = true;


    var geometry = (plane.geometry)
    var vertices = geometry.vertices
    scene.add(plane)


    var material = new THREE.MeshStandardMaterial({
        color: 0x68d0fe,
        morphNormals: true,
        morphTargets: true,
        // side: THREE.DoubleSide
    })
    var geo = new THREE.BoxGeometry(20, 20,20)
    var sphere = new THREE.Mesh(geo, material)
    sphere.receiveShadow = true;
    // sphere.castShadow = true;
    sphere.position.z = -5
    sphere.rotateZ(Math.PI / 4)
    scene.add(sphere)


    frame()
    var f = 0;
    initWater()

    function frame() {
        f++
        requestAnimationFrame(frame)
        if (f % 2 == 0) return;
        moveWater(col, row)
        vertices.forEach((v, i) => {
            v.z = water[i]
        })
        geometry.verticesNeedUpdate = true;
        // geometry.elementsNeedUpdate = true;
        // geometry.morphTargetsNeedUpdate = true;
        // geometry.uvsNeedUpdate = true;
        // geometry.normalsNeedUpdate = true;
        // geometry.colorsNeedUpdate = true;
        // geometry.tangentsNeedUpdate = true;
        renderer.render(scene, camera)
    }

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2()

    function onEnd(e) {
        var e = e.changedTouches ? e.changedTouches[0] : e
        var x = e.pageX / document.documentElement.clientWidth * 2 - 1;
        var y = -(e.pageY / document.documentElement.clientWidth * 2 - 1);
        mouse.x = x;
        mouse.y = y;
        // alert(x+'-'+y)
        raycaster.setFromCamera(mouse, camera);
        var hits = raycaster.intersectObjects(scene.children);
        for (var i = 0; i < hits.length; i++) {
            var hit = hits[i]
            /*
                distance – distance between the origin of the ray and the intersection
                point – point of intersection, in world coordinates
                face – intersected face
                faceIndex – index of the intersected face
                indices – indices of vertices comprising the intersected face
                object – the intersected object
                uv - U,V coordinates at point of intersection
            */
            if(hit.object != plane)return;
            var face = hit.face
            var indices = [face.a, face.b, face.c]
            indices.forEach(c => v[c] = -10)
            console.log(hit)
        }
        e.preventDefault()
    }
    document.getElementById('c').addEventListener('click', onEnd)
    document.getElementById('c').addEventListener('mousemove', onEnd)
    document.getElementById('c').addEventListener('touchmove', onEnd)
}

function initWater() {
    // water = water.map((v, i) => 36 - dCenter(col, row, i))
    // console.log(Math.max.apply(Math,water))
}

function dCenter(col, row, index) {
    var centerX = Math.floor(col / 2)
    var centerY = Math.floor(row / 2)
    var x = Math.floor(index / row)
    var y = index % row
    return Math.sqrt(Math.pow(centerY - y, 2) + Math.pow(centerX - x, 2))
}
init()