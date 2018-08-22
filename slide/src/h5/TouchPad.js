import Vec2 from './vector.js'
import pageData from './helper.js'

class TouchPad {
    constructor(imgUrl, area) {
        this.spriteImageUrl = imgUrl
        this.area = area || { left: 0, top: 0, width: 0, height: 0 }
        this.position = new Vec2(this.area.left, this.area.top)
    }
    get ontouchmove() {
        let self = this
        return function(e) {
            let x = e.data.global.x
            let y = e.data.global.y
            if (pageData.inArea(x, y, self.area)) {
                this.x = x
                this.y = y
                self.position.x = x
                self.position.y = y
            }
        }
    }
}

class Aim {
    constructor(imgUrl,xTarget, yTarget) {
        this.spriteImageUrl = imgUrl
        this.xt = xTarget
        this.yt = yTarget
        this.position = new Vec2(xTarget.position.x, yTarget.position.y)
    }
    get ontouchmove() {
        let self = this
        return function(e) {
            let x = self.xt.position.x
            let y = self.yt.position.y
            this.x = x;
            this.y = y;
            self.position.x = x;
            self.position.y = y;
        }
    }
}

export default { TouchPad, Aim }