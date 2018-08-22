class Connection {
    constructor(a, b, direction) {
        this.targetA = a
        this.targetB = b
        this.direction = direction
        this.bidirection = (direction + 2) % 4
    }
    getEnd(x) {
        return x === this.targetA ? this.targetB : x === this.targetB ? this.targetA : undefined
    }
    unlink() {
        this.targetA.unlinkTo(this.direction)
        this.targetB.unlinkTo(this.bidirection)
        this.active = false
    }
    link() {
        this.targetA.linkTo(this.direction, this)
        this.targetB.linkTo(this.bidirection, this)
        this.active = true
    }
}

class Cell {
    constructor(x, y, state) {
        this.position = { x: x || 0, y: y || 0 }
        this.state = state || 0 //0:initial 1:visited
        this.borders = [1, 1, 1, 1] //N E S W
        this.connections = []
        this.belongTo = null
    }
    linkTo(direction, connection) {
        this.connections[direction] = connection
        this.borders[direction] = 1
    }
    unlinkTo(direction) {
        this.connections[direction] = null
        this.borders[direction] = 0
    }
    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
    setCross() {
        var self = this

        this.isCross = true
        if (this.connections[0] && this.connections[2]) {
            this.connections[0].getEnd(this).belongTo.merge(this.connections[2].getEnd(this).belongTo)
        }
        if (this.connections[1] && this.connections[3]) {
            this.connections[1].getEnd(this).belongTo.merge(this.connections[3].getEnd(this).belongTo)
            this.connections[1].getEnd(this).belongTo.merge(this.belongTo)
        }
        this.connections.forEach(v => {
            if (v) {
                v.unlink()
            }
        })
    }
}

class RectMap {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.cells = []
        this.connections = []
        for (var i = 0; i < width; i++) {
            this.cells.push([])
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var n = new Cell(i, j, 0)
                var setM = new Setm()
                setM.add(n)
                this.setCell(n, i, j)
                if (n.position.x > 0) {
                    var c1 = new Connection(n, this.getCell(i - 1, j), 3)
                    c1.link()
                    this.connections.push(c1)
                }
                if (n.position.y > 0) {
                    var c2 = new Connection(n, this.getCell(i, j - 1), 0)
                    c2.link()
                    this.connections.push(c2)
                }
            }
        }
    }
    setCell(c, x, y) {
        this.cells[x][y] = c
        c.setPosition(x, y)
    }
    getCell(x, y) {
        return this.cells[x][y]
    }
}
var count = 0
class Setm {
    constructor() {
        this.eles = []
        this.id = count
        count++
    }
    add(x) {
        if (!this.eles.find(v => v === x)) {
            this.eles.push(x)
            x.belongTo = this
        } else {
            x.belongTo = this
        }
    }
    remove(x) {
        x.belongTo = null
        this.eles = this.eles.filter(v => v !== x)
    }
    merge(set) {
        var self = this
        set.eles.forEach(v => self.add(v))
    }
}

function getSetCount(){
    return count
}

export default { Cell, Connection, RectMap, Setm, getSetCount }