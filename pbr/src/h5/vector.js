class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    get length2() {
        return this.x * this.x + this.y * this.y
    }
    static sum(v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y)
    }
    static minus(v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y)
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }
    static scale(v, a) {
        return new Vec2(v.x * a, v.y * a)
    }
    static rotate(v, d) {
        return new Vec2(Math.cos(d) * v.x - Math.sin(d) * v.y, Math.sin(d) * v.x + Math.cos(d) * v.y)
    }
    sumWith(v) {
        this.x += v.x;
        this.y += v.y;
        return this
    }
    normalize() {
        var length = Math.sqrt(this.x * this.x + this.y * this.y)
        this.x = this.x / length
        this.y = this.y / length
        return this
    }
}
export default Vec2