var x, y, center = [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2]
var preM, ccc, s, M

var html = ''
var R = document.documentElement.clientWidth / 2
var points = []
var x, y
for (var i = 0; i < 9; i++) {
    x = ~~(R * (i - 4) / 4)
    for (var j = 0; j < 5; j++) {
        var r = Math.sqrt(R * R - x * x)
        y = ~~(r * (j - 2) / 2)
        var z = Math.sqrt(R * R - x * x - y * y)
        var nz = -z;
        points.push([x + 'px', y + 'px', z + 'px'])
        if (z != nz) {
            points.push([x + 'px', y + 'px', nz + 'px'])
        }
    }
}
for (var i = 0; i < points.length; i++) {
    html += '<div class="dot" style="transform:rotateX(' + (~~(Math.random() * 360)) + 'deg) rotateY(' + (~~(Math.random() * 360)) + 'deg) rotateZ(' + (~~(Math.random() * 360)) + 'deg) translate3d(' + points[i].join(',') + ')"></div>'
}
$('.box').html(html)

$('.border').on('mousemove', function(e) {
    if (ccc) {
        x = e.clientX;
        y = e.clientY;
        // console.log(screenToPoints(x,y))
        var r = pointsToRotate(s, screenToPoints(x, y))
        M = preM ? m4x4m(preM, r) : r
        applyMatrix($('.box'), M)
    }
})
$('.border').on('touchmove', function(e) {
    e.preventDefault()
    e = e.changedTouches[0]
    if (ccc) {
        x = e.clientX;
        y = e.clientY;
        log(x + '-' + y)
            // console.log(screenToPoints(x,y))
        var r = pointsToRotate(s, screenToPoints(x, y))
        M = preM ? m4x4m(preM, r) : r
        applyMatrix($('.box'), M)
    }
})
$('.border').on('mousedown', function(e) {
    x = e.clientX;
    y = e.clientY;
    s = screenToPoints(x, y)
    ccc = true;
})
$('.border').on('touchstart', function(e) {
    e = e.changedTouches[0]
    x = e.clientX;
    y = e.clientY;
    s = screenToPoints(x, y)
    ccc = true;
})
$('.border').on('mouseup', function() {
    preM = M
    ccc = false;
});
$('.border').on('touchend', function() {
    preM = M
    ccc = false;
});
// window.addEventListener('touchmove', function(e) {
//     e.preventDefault()
//     x = e.changedTouches[0].clientX;
//     y = e.changedTouches[0].clientY;
//     // console.log(screenToPoints(x,y))
//     var r = pointsToRotate([0,0,1],screenToPoints(x,y))
//     applyMatrix($('.box'),r)
// })
// function drawBox(d){
//     var dx = d[0];
//     var dy = d[1];
//     applyMatrix($('.box'),m4x4m(rotate3dToMatrix(0,0,1,dx/180),rotate3dToMatrix(0,0,1,dy/180)))
// }
function rotate3dToMatrix(x, y, z, d) {
    var c = Math.cos(d);
    var s = Math.sin(d);
    var matrix = [
        c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0,
        x * y * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s, 0,
        x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, c + z * z * (1 - c), 0,
        0, 0, 0, 1
    ]
    return matrix
}

function m4x4m(m1, m2) {
    var m = []
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            for (var k = 0; k < 4; k++) {
                if (!m[i * 4 + j]) {
                    m[i * 4 + j] = 0;
                }
                m[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j]
            }
        }
    }
    return m;
}

function applyMatrix(ele, m) {
    var pm = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            pm[i * 4 + j] = m[i + j * 4]
        }
    }
    ele.css('transform', 'matrix3d(' + pm.join(',') + ')')
}

function pointsToRotate(p1, p2) {
    var p = p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
    var l1 = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1] + p1[2] * p1[2])
    var l2 = Math.sqrt(p2[0] * p2[0] + p2[1] * p2[1] + p2[2] * p2[2])
    var co = p / l1 / l2
    var degree = Math.acos(co)

    var normal = [
        p1[1] * p2[2] - p2[1] * p1[2],
        p1[2] * p2[0] - p2[2] * p1[0],
        p1[0] * p2[1] - p2[0] * p1[1]
    ]
    normal = normalize(normal)
    return rotate3dToMatrix(normal[0], normal[1], normal[2], degree)
}

function length(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return Math.sqrt(x * x + y * y + z * z)
}

function normalize(v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var ratio = 1 / length(v)
    return [x * ratio, y * ratio, z * ratio]
}

function extractMatrix3D(m4) {
    var m3 = []
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            m3.push(m4[i * 4 + j]);
        }
    }
    return m3;
}

function p3x3m(p, m3) {
    var m = []
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                if (!m[i * 3 + j]) {
                    m[i * 3 + j] = 0;
                }
                m[i * 3 + j] += p[i * 3 + k] * m3[k * 3 + j]
            }
        }
    }
    return m
}

function rotatePoint(p, matrix) {
    if (matrix && matrix.length == 16) {
        var m3 = extractMatrix3D(matrix)
        var newp = p3x3m(p, m3)
        return newp;
    }
    return p
}

function screenToPoints(x, y) {
    var type = 1; //1:min,2:max
    var w = document.documentElement.clientWidth
    var h = document.documentElement.clientHeight
    var max = w > h ? w : h;
    var min = w > h ? h : w;
    var tranlatemin = (max - min) / 2
    var tranlatemax = (max - min) / 2
    var px, py, pz, p
    if (type == 1) {
        if (min == h) {
            px = (x - tranlatemax) / min * 2 - 1
            py = y / min * 2 - 1
        } else {
            py = (y - tranlatemax) / min * 2 - 1
            px = x / min * 2 - 1
        }
    } else {
        if (min == w) {
            px = (x + tranlatemin) / max * 2 - 1
            py = y / max * 2 - 1
        } else {
            py = (y + tranlatemin) / max * 2 - 1
            px = x / max * 2 - 1
        }
    }
    pz = Math.sqrt(1 - px * px - py * py)
    if (isNaN(pz)) {
        p = [0, 0, 1]
    } else {
        p = [px, py, pz]
    }
    p = rotatePoint(p, preM)
    return p
}
