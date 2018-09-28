var water = buildWater(20, 20)
var tempWater = new Array(20 * 20)
var v = ('a').repeat(20*20-1).split('a').map(v=>0)
var c = 1
var _t = 1 / 10

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
setInterval(function(){
    var s= Math.floor(Math.random() * 12)
    var t
    switch(s%4){
        case 0:
        t = 0;
        break;
        case 1:
        t = 19;
        break;
        case 2:
        t = 19 * 20 + 19;
        break;
        case 3:
        t = 19 * 20
        break;
    }
    water[t] = 5
},1000)
function moveWater(column, row) {
    for (var i = 0; i < column; i++) {
        for (var j = 0; j < row; j++) {
            var t1 = water[(i - 1) * row + j],
                t2 = water[(i + 1) * row + j],
                t3 = water[i * row + j + 1],
                t4 = water[i * row + j - 1];
            if (!(i > 0 && i < column - 1 && j > 0 && j < row - 1)) {
                if (i < 1) { t1 = water[i * row + j] }
                if (i > column - 2) { t2 = water[i * row + j] }
                if (j > row - 2) { t3 = water[i * row + j] }
                if (j < 1) { t4 = water[i * row + j] }
            }
            var f = c * c * (t1 + t2 + t3 + t4 - water[i * row + j] * 4) / 1 / 1
            var _f = -.3 * v[i * row + j]
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