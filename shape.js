import df from './df.js'
import Vec2 from './vector.js'

// function Circle(x, y, radius) {
//     var shape = df.translate(x, y, df.Circle(radius))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'circle',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         radius
//     }
// }

function Rectangle(x, y, width, height) {
    var shape = df.translate(x, y, df.Rectangle(width, height))
    var x = x || 0;
    var y = y || 0;
    return {
        type:'rectangle',
        x,
        y,
        shape,
        width,
        height
    }
}

// function Pie(x, y, radian, rotateDegree) {
//     var shape = df.translate(x, y, df.rotate(rotateDegree, df.Pie(radian)))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = rotateDegree || 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'pie',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         radian
//     }
// }

// function TrangleE(x, y, radius, rotateDegree) {
//     var shape = df.translate(x, y, df.rotate(rotateDegree, df.TrangleE(radius)))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = rotateDegree || 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'trangleE',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         radius
//     }
// }

// function TrangleN(x, y, width, height, rotateDegree) {
//     var shape = df.translate(x, y, df.rotate(rotateDegree, df.TrangleN(width, height)))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = rotateDegree || 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'trangleN',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         width,
//         height
//     }
// }

// function Torus(x, y, radius, radian, width, rotateDegree) {
//     var shape = df.translate(x, y, df.rotate(rotateDegree, df.Torus(radius, radian, width)))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = rotateDegree || 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'torus',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         radius,
//         width,
//         radian
//     }
// }

// function RoundedBox(x, y, width, height, radius, rotateDegree) {
//     var shape = df.translate(x, y, df.rotate(rotateDegree, df.RoundedBox(width, height, radius)))
//     var x = x || 0;
//     var y = y || 0;
//     var rotate = rotateDegree || 0;
//     var scaleX = 1;
//     var scaleY = 1;
//     return {
//         type:'rbox',
//         x,
//         y,
//         rotate,
//         scaleX,
//         scaleY,
//         shape,
//         height,
//         width,
//         radius
//     }
// }
export default {
    // Circle,
    Rectangle,
    // Pie,
    // TrangleE,
    // TrangleN,
    // Torus,
    // RoundedBox,
}