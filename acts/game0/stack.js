function initStack(width, height) {
    var stack = {
        data: [],
        width: width,
        height: height,
        activeBlock: null,
        renderData: [],
        pace:30
    }
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            stack.data[i + j * width] = 0;
            stack.renderData[i + j * width] = 0;
        }
    }
    stack.__proto__ = StackMixin;
    return stack
}
var StackMixin = {
    updateData: function(i, j, value) {
        var dataPosition = [i - 1, j - 1];
        this.data[dataPosition[0] + dataPosition[1] * this.width] = value
    },
    removeRow: function(j) {
        for (var i = 0; i < this.width; i++) {
            this.data[i + (j - 1) * this.width] = 0;
        }
        for (var i = 0; i < this.width; i++) {
            for (var k = j - 1; k > -1; k--) {
                this.dropBlock(i, k)
            }
        }
    },
    dropBlock: function(i, j) {
        this.data[i + j * this.width] = this.data[i + (j - 1) * this.width] || 0;
    },
    checkFullRows: function() {
        var rows = []
        for (var i = 0; i < this.height; i++) {
            var rowBase = 1;
            for (var j = 0; j < this.width; j++) {
                rowBase *= this.data[i * this.width + j];
            }
            if (rowBase > 0) {
                rows.push(i + 1)
            }
        }
        return rows;
    },
    addBlocks: function(block) {
        var canPlace = !block.collisionCheck(this)
        if (canPlace) {
            this.activeBlock = block;
            this.update()
        } else {
        	this.activeBlock = block;
        	this.update()
        	this.placeBlocks();
        	this.activeBlock = null;
        	this.end && this.end()
        }
    },
    dropBlocks: function() {
        if (!this.activeBlock) return;
        this.activeBlock.y++;
        var canPlace = !this.activeBlock.collisionCheck(this)
        if (!canPlace) {
        	var ab = this.activeBlock
            this.activeBlock.y--;
            this.placeBlocks()
            this.activeBlock = null;
            this.afterPlace && this.afterPlace(ab)
        }
        this.update()
    },
    placeBlocks: function() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.data[i + j * this.width] = this.renderData[i + j * this.width];
            }
        }
    },
    update: function() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.renderData[i + j * this.width] = this.data[i + j * this.width];
            }
        }
        if (!this.activeBlock) return;
        var is = this.activeBlock.is
        var x = this.activeBlock.x - 1
        var y = this.activeBlock.y - 1
        for (var i = 0; i < is.length; i++) {
            this.renderData[x + is[i][0] + (y + is[i][1]) * this.width] = this.activeBlock.renderType;
        }
    },
    moveBlock: function(di) {
        if (!this.activeBlock) return;
        var x = this.activeBlock.x
        this.activeBlock.x += di;
        this.activeBlock.x = this.activeBlock.x > this.width ? this.width : this.activeBlock.x < 1 ? 1 : this.activeBlock.x;
        if (!!this.activeBlock.collisionCheck(this)) {
            this.activeBlock.x = x
        }
        this.update()
    },
    rotateBlock: function(di) {
        if (!this.activeBlock) return;
        if (di == 1) {
            this.activeBlock.rotateLeft()
        } else if (di == -1) {
            this.activeBlock.rotateRight()
        }
        var collisions = this.activeBlock.collisionCheck(this)
        if (!!collisions) {
            var fixed = false;
            collisions.sort(function(a, b) {
                return a[0] - b[0]
            })
            var clampCo = clampAbs(0,collisions.length)
            for (var i = 0; i < collisions.length; i++) {
                var b = this.activeBlock.is[collisions[i]]
                this.activeBlock.x -= clampCo(b[0])
                if (!this.activeBlock.collisionCheck(this)) {
                    fixed = true;
                    break;
                }
                this.activeBlock.x += clampCo(b[0])
                this.activeBlock.y -= clampCo(b[1])
                if (!this.activeBlock.collisionCheck(this)) {
                    fixed = true;
                    break;
                }
                this.activeBlock.y += clampCo(b[1])
            }
            if (!fixed) {
                if (di == -1) {
                    this.activeBlock.rotateLeft()
                } else if (di == 1) {
                    this.activeBlock.rotateRight()
                }
            }
        }
        this.update()
    }
}
module.exports = {
    initStack: initStack
}
function clampAbs(min, max) {
    return function(i) {
        var isNeg = i + Math.abs(i) != 0 ? 1 : -1
        return Math.abs(i) < min ? min * isNeg : Math.abs(i) > max ? max * isNeg : i
    }
}