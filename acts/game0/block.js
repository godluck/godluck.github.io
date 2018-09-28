var types = ['T', 'L1', 'I', 'Z1', 'O', 'L2', 'Z2']
var btypes = {
    'T': {
        types: 4,
        blocks: [
            [
                [-1, 0],
                [0, 0],
                [0, 1],
                [1, 0],
            ],
            [
                [-1, 0],
                [0, 0],
                [0, 1],
                [0, -1],
            ],
            [
                [-1, 0],
                [0, 0],
                [0, -1],
                [1, 0],
            ],
            [
                [0, -1],
                [0, 0],
                [0, 1],
                [1, 0],
            ],
        ]
    },
    'L1': {
        types: 4,
        blocks: [
            [
                [-1, 0],
                [1, -1],
                [0, 0],
                [1, 0],
            ],
            [
                [0, 1],
                [0, -1],
                [0, 0],
                [-1, -1],
            ],
            [
                [-1, 0],
                [-1, 1],
                [0, 0],
                [1, 0],
            ],
            [
                [0, 1],
                [0, -1],
                [0, 0],
                [1, 1],
            ],
        ]
    },
    'I': {
        types: 2,
        blocks: [
            [
                [0, -1],
                [0, 1],
                [0, 0],
                [0, 2],
            ],
            [
                [-1, 0],
                [0, 0],
                [1, 0],
                [2, 0],
            ]
        ]
    },
    'Z1': {
        types: 2,
        blocks: [
            [
                [-1, 0],
                [0, 0],
                [0, -1],
                [1, -1],
            ],
            [
                [1, 0],
                [0, 0],
                [0, -1],
                [1, 1],
            ]
        ]
    },
    'O': {
        types: 1,
        blocks: [
            [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
            ]
        ]
    },
    'L2': {
        types: 4,
        blocks: [
            [
                [-1, 0],
                [1, 1],
                [0, 0],
                [1, 0],
            ],
            [
                [0, 1],
                [0, -1],
                [0, 0],
                [1, -1],
            ],
            [
                [-1, 0],
                [-1, -1],
                [0, 0],
                [1, 0],
            ],
            [
                [0, 1],
                [0, -1],
                [0, 0],
                [-1, 1],
            ],
        ]
    },
    'Z2': {
        types: 2,
        blocks: [
            [
                [1, 0],
                [0, 0],
                [0, -1],
                [-1, -1],
            ],
            [
                [-1, 0],
                [0, 0],
                [0, -1],
                [-1, 1],
            ]
        ]
    },
}

function initBlock(type, direction, i, j) {
    var block = {
        direction: direction,
        x: i,
        y: j,
        type: type,
        renderType: types.indexOf(type) + 1
    }
    block.__proto__ = blockMixin;
    block.types = block.getTypes(type);
    block.is = block.getBlock(type, direction);
    block.iss = block.getBlocks(type);
    return block;
}

var blockMixin = {
    collisionCheck: function(stack) {
        var is = this.is
        var x = this.x - 1
        var y = this.y - 1
        var i_s = []
        for (var i = 0; i < is.length; i++) {
            var xi = x + is[i][0]
            var yi = y + is[i][1]
            if (xi < 0 || xi > stack.width - 1 || yi > stack.height - 1) {
                i_s.push(i)
                continue;
            }
            var value = stack.data[xi + yi * stack.width]
            if (value == undefined && y + is[i][1] >= 0 || value > 0) {
                i_s.push(i)
            }
        }
        return i_s.length ? i_s : false;
    },
    rotateLeft: function() {
        this.direction++;
        this.is = this.iss[this.direction % this.types]
    },
    rotateRight: function() {
        this.direction--;
        this.direction = this.direction < 0 ? this.direction + this.types : this.direction;
        this.is = this.iss[this.direction % this.types]
    },
    getBlock: function(type, direction) {
        return this.getBlocks(type)[direction % this.types]
    },
    getBlocks: function(type) {
        return btypes[type].blocks
    },
    getTypes: function(type) {
        return btypes[type].types
    },
}

module.exports = {
    types: types,
    initBlock: initBlock
}