var fixer = require('./keyframes.js')
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
function DeviceOrientationController(target, depth, noInterpolation, scaler) {
    this.target = target;
    this.useQuaternion = !noInterpolation;
    this.scaler = scaler;
    this.alphaOffset = 0;
    this.depth = depth || target.offsetWidth;
    this.m = {
        curMatrix: null,
        preMatrix: null
    }
    this.q = {
        targetQuaternion: null,
        curQuaternion: null,
        preQuaternion: null
    }
}

DeviceOrientationController.prototype = {
    init: function() {
        var self = this;
        if (this.useQuaternion) {
            window.addEventListener('deviceorientation', function(e) {
                e = self.scaler ? self.scaler(e) : e
                self.e = e
                self.q.targetQuaternion = getQuaternionFromEuler((e.beta /*/ 6 + 75*/ ) / 180 * Math.PI, -e.gamma / 180 * Math.PI, (e.alpha + self.alphaOffset) / 180 * Math.PI)
            });
            this.animate()
        } else {
            window.addEventListener('deviceorientation', function(e) {
                e = self.scaler ? self.scaler(e) : e
                self.e = e
                var _matrix = makeRotationFromEuler((e.beta /*/ 6 + 75*/ ) / 180 * Math.PI, -e.gamma / 180 * Math.PI, (e.alpha + self.alphaOffset) / 180 * Math.PI, self.depth * .9)
                self.target.style.transform = self.target.style['WebkitTransform'] = self.m.curMatrix = 'matrix3d(' + _matrix.join(',') + ')'
            });
        }
        this.addTouch()
    },
    addTouch: function() {
        var self = this
        var width = this.target.offsetWidth
        var position
        document.addEventListener('touchstart', handleStart)
        document.addEventListener('touchmove', handleMove)

        function handleStart(e) {
            var touch = e.changedTouches[0]
            position = [touch.pageX, touch.pageY]
        }

        function handleMove(e) {
            var touch = e.changedTouches[0]
            var _position = [touch.pageX, touch.pageY]
            // var offsetD = Math.abs(self.e.gamma) < 45 ? (position[0] - _position[0]) : (position[1] - _position[1]) * -Math.abs(self.e.gamma)/self.e.gamma
            var offsetD = position[0] - _position[0]
            position = _position
            self.alphaOffset -= offsetD / width * 45
            e.preventDefault();
        }
    },
    animate: function() {
        var self = this
        frame()

        function frame() {
            requestAnimationFrame(frame)
            if (!self.q.curQuaternion) {
                self.q.curQuaternion = self.q.targetQuaternion
                return;
            }
            self.q.curQuaternion = slerp(self.q.curQuaternion, self.q.targetQuaternion, 1 / 6)
            var _matrix = makeRotationFromQuaternion(self.q.curQuaternion, self.depth * .9)
            self.target.style.transform = self.target.style['WebkitTransform'] = 'matrix3d(' + _matrix.join(',') + ')'
        }
    }
}

function TouchController(target, depth) {
    this.target = target
    this.alpha = 0;
    this.beta = 90;
    this.depth = depth || 1000;
    this.q = {
        targetQuaternion: null,
        curQuaternion: null,
        preQuaternion: null
    }
}
TouchController.prototype = {
    init: function() {
        this.addTouch()
        this.animate()
    },
    addTouch: function() {
        var self = this
        var width = this.target.offsetWidth
        var height = this.target.offsetHeight
        var position
        document.addEventListener('touchstart', handleStart)
        document.addEventListener('touchmove', handleMove)

        function handleStart(e) {
            var touch = e.changedTouches[0]
            position = [touch.pageX, touch.pageY]
        }

        function handleMove(e) {
            var touch = e.changedTouches[0]
            var _position = [touch.pageX, touch.pageY]
            var offsetX = position[0] - _position[0]
            var offsetY = position[1] - _position[1]
            position = _position
            self.alpha -= offsetX / width * 45
            self.beta -= offsetY / height * 45
            self.beta = self.beta > 179 ? 179 : self.beta < 1 ? 1 : self.beta
            e.preventDefault();
        }
    },
    animate: function() {
        var self = this
        var step = 1;
        frame()

        function frame() {
            requestAnimationFrame(frame)
            self.q.targetQuaternion = getQuaternionFromEuler(self.beta / 180 * Math.PI, 0, self.alpha / 180 * Math.PI)
            if (!self.q.curQuaternion) {
                self.q.curQuaternion = self.q.targetQuaternion
            }
            self.q.curQuaternion = slerp(self.q.curQuaternion, self.q.targetQuaternion, step / 6)
            var _matrix = makeRotationFromQuaternion(self.q.curQuaternion, self.depth * .9)
            self.target.style.transform = self.target.style['WebkitTransform'] = 'matrix3d(' + _matrix.join(',') + ')'
        }
    }
}


module.exports = {
    DeviceOrientationController: DeviceOrientationController,
    TouchController: TouchController
}























function getQuaternion(matrix) {
    var q = {}
    var te = matrix,
        m11 = te[0],
        m12 = te[4],
        m13 = te[8],
        m21 = te[1],
        m22 = te[5],
        m23 = te[9],
        m31 = te[2],
        m32 = te[6],
        m33 = te[10],
        trace = m11 + m22 + m33,
        s;
    if (trace > 0) {
        s = 0.5 / Math.sqrt(trace + 1.0);
        q._w = 0.25 / s;
        q._x = (m32 - m23) * s;
        q._y = (m13 - m31) * s;
        q._z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
        q._w = (m32 - m23) / s;
        q._x = 0.25 * s;
        q._y = (m12 + m21) / s;
        q._z = (m13 + m31) / s;
    } else if (m22 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
        q._w = (m13 - m31) / s;
        q._x = (m12 + m21) / s;
        q._y = 0.25 * s;
        q._z = (m23 + m32) / s;
    } else {
        s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
        q._w = (m21 - m12) / s;
        q._x = (m13 + m31) / s;
        q._y = (m23 + m32) / s;
        q._z = 0.25 * s;

    }
    return q;
}

function slerp(qa, qb, t) {
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    if (t === 0) return qa;
    if (t === 1) return qb;
    var x = qa._x,
        y = qa._y,
        z = qa._z,
        w = qa._w;
    var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
    if (cosHalfTheta < 0) {
        qa._w = -qb._w;
        qa._x = -qb._x;
        qa._y = -qb._y;
        qa._z = -qb._z;
        cosHalfTheta = -cosHalfTheta;
    } else {
        qa = qb;
    }
    if (cosHalfTheta >= 1.0) {
        qa._w = w;
        qa._x = x;
        qa._y = y;
        qa._z = z;
        return qa;
    }
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
        qa._w = 0.5 * (w + qa._w);
        qa._x = 0.5 * (x + qa._x);
        qa._y = 0.5 * (y + qa._y);
        qa._z = 0.5 * (z + qa._z);
        return qa;
    }
    var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
        ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    qa._w = (w * ratioA + qa._w * ratioB);
    qa._x = (x * ratioA + qa._x * ratioB);
    qa._y = (y * ratioA + qa._y * ratioB);
    qa._z = (z * ratioA + qa._z * ratioB);
    return qa;
}

function getQuaternionFromEuler(x, y, z) {
    // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
    //	content/SpinCalc.m
    var q = {}
    var cos = Math.cos;
    var sin = Math.sin;
    var c1 = cos(x / 2);
    var c2 = cos(y / 2);
    var c3 = cos(z / 2);
    var s1 = sin(x / 2);
    var s2 = sin(y / 2);
    var s3 = sin(z / 2);
    q._x = s1 * c2 * c3 + c1 * s2 * s3;
    q._y = c1 * s2 * c3 - s1 * c2 * s3;
    q._z = c1 * c2 * s3 - s1 * s2 * c3;
    q._w = c1 * c2 * c3 + s1 * s2 * s3;
    return q;
}

function makeRotationFromEuler(x, y, z, depth) {
    var te = [];
    var a = Math.cos(x),
        b = Math.sin(x);
    var c = Math.cos(y),
        d = Math.sin(y);
    var e = Math.cos(z),
        f = Math.sin(z);
    var ce = c * e,
        cf = c * f,
        de = d * e,
        df = d * f;
    te[0] = ce + df * b;
    te[4] = de * b - cf;
    te[8] = a * d;
    te[1] = a * f;
    te[5] = a * e;
    te[9] = -b;
    te[2] = cf * b - de;
    te[6] = df + ce * b;
    te[10] = a * c;
    // last column
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    // bottom row
    te[12] = 0;
    te[13] = 0;
    te[14] = depth; // translateZ
    te[15] = 1;
    return te;
}

function makeRotationFromQuaternion(q, depth) {
    var te = [];
    var x = q._x,
        y = q._y,
        z = q._z,
        w = q._w;
    var x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    var xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    var yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    var wx = w * x2,
        wy = w * y2,
        wz = w * z2;
    te[0] = 1 - (yy + zz);
    te[4] = xy - wz;
    te[8] = xz + wy;
    te[1] = xy + wz;
    te[5] = 1 - (xx + zz);
    te[9] = yz - wx;
    te[2] = xz - wy;
    te[6] = yz + wx;
    te[10] = 1 - (xx + yy);
    // last column
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    // bottom row
    te[12] = 0;
    te[13] = 0;
    te[14] = depth; //translateZ
    te[15] = 1;
    return te;
}