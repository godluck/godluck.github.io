class Connection {
    constructor(a, b) {
        this.targetA = a
        this.targetB = b
    }
    getEnd(x) {
        return x === this.targetA ? this.targetB : x === this.targetB ? this.targetA : undefined
    }
}

class Cell {
    constructor(x, y, state) {
        this.position = { x: x || 0, y: y || 0 }
        this.state = state || 0 //0:initial 1:visited
        this.connections = []
    }
    linkTo(b, noLinkBack) {
        let self = this
        if (self.connections.find(v => v.getEnd(self) === b)) {
            if (!noLinkBack) b.linkTo(self, true)
        } else {
            self.connections.push(new Connection(self, b))
            if (!noLinkBack) b.linkTo(self, true)
        }
    }
    unlinkTo(b, LinkBack) {
        let self = this
        self.connections = self.connections.filter(v => v.getEnd(self) !== b)
        if (!LinkBack) b.connections = b.connections.filter(v => v.getEnd(b) !== self)
    }
    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
}

class RectMap {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.cells = []
        for (var i = 0; i < width; i++) {
            this.cells.push([])
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var n = new Cell(i, j, 0)
                this.setCell(n, i, j)
                if (n.position.x > 0) n.linkTo(this.getCell(i - 1, j))
                if (n.position.y > 0) n.linkTo(this.getCell(i, j - 1))
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


export default { Cell, Connection, RectMap }