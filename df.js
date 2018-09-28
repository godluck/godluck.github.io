import Vec2 from './vector.js'

function squre(x) {
    return Math.pow(x, 2)
}

// function Circle(radius) {
//     return function(x, y) {
//         return Math.sqrt(squre(x) + squre(y)) - radius
//     }
// }

function Rectangle(width, height) {
    return function(x, y) {
        var dx = Math.abs(x) - width / 2
        var dy = Math.abs(y) - height / 2
        return Math.min(Math.max(dx, dy), 0) + Math.sqrt(squre(dx > 0 ? dx : 0) + squre(dy > 0 ? dy : 0))
    }
}

// function Pie(radian) {
//     return function(x, y) {
//         var c = Math.cos(radian / 2)
//         var s = Math.sin(radian / 2)
//         return Math.abs(x) * c + y * s
//     }
// }

// function TrangleE(radius) {
//     return function(x, y) {
//         return Math.max(Math.abs(x) * 0.866025 + y / 2, -y) - radius / 2
//     }
// }

// function TrangleN(width, height) {
//     return function(x, y) {
//         var n = new Vec2(height, width / 2).normalize()
//         return Math.max(Math.abs(x) * n.x + y * n.y - height * n.y, -y)
//     }
// }

// function Torus(radius, radian, width) {
//     width /= 2
//     radius -= width
//     var p = Pie(radian)
//     var c = Circle(radius)
//     return substraction(p, function(x, y) {
//         return Math.abs(c(x, y)) - width
//     })
// }

// function RoundedBox(width, height, radius) {
//     var w = width - radius
//     var h = height - radius
//     return function(x, y) {
//         var dx = Math.abs(x) - w
//         var dy = Math.abs(y) - h
//         return Math.min(Math.max(dx, dy), 0) + Math.sqrt(squre(dx > 0 ? dx : 0) + squre(dy > 0 ? dy : 0)) - radius
//     }
// }


function translate(dx, dy, o) {
    return function(x, y) {
        return o(x - dx, y - dy)
    }
}

// function rotate(r, o) {
//     return function(x, y) {
//         var _x = x * Math.cos(r) - y * Math.sin(r)
//         var _y = x * Math.sin(r) + y * Math.cos(r)
//         return o(_x, _y)
//     }
// }

function union(o1, o2) {
    return function(x, y) {
        return Math.min(o1(x, y), o2(x, y))
    }
}

// function substraction(o1, o2) {
//     return function(x, y) {
//         return Math.max(-o1(x, y), o2(x, y))
//     }
// }

// function intersection(o1, o2) {
//     return function(x, y) {
//         return Math.max(o1(x, y), o2(x, y))
//     }
// }

// function smoothUnion(o1, o2, k) {
//     return function(x, y) {
//         var v1 = o1(x, y)
//         var v2 = o2(x, y)
//         var h = 0.5 + 0.5 * (v2 - v1) / k
//         h = h > 1 ? 1 : h < 0 ? 0 : h
//         return v1 * h + v2 * (1 - h) - k * h * (1 - h)
//     }
// }

export default {
    // Circle,
    Rectangle,
    // Pie,
    // TrangleE,
    // TrangleN,
    // RoundedBox,
    // Torus,
    translate,
    // rotate,
    squre,
    union,
    // substraction,
    // intersection,
    // smoothUnion,
}