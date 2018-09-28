var P = require('pixi.js')

function initStackRender(width, height, texture, stack) {
    var c = new P.Container();
    var bg = new P.Graphics();
    bg.beginFill(0xdddddd);
    bg.drawRect(0, 0, width * stack.width, height * stack.height);
    for (var i = 0; i < stack.height; i++) {
        for (var j = 0; j < stack.width; j++) {
            sprite = new P.extras.TilingSprite(texture, 40, 40)
            sprite.x = width * j;
            sprite.y = height * i;
            var value = stack.renderData[j + i * stack.width];
            switch (value) {
                case 0:
                    sprite.renderable = false;
                    break;
                default:
                    sprite.tilePosition.x = 40 * (value - 1)
                    sprite.renderable = true;
                    break;
            }
            c.addChild(sprite);
        }
    }
    return {
        render: function() {
            for (var i = 0; i < stack.width; i++) {
                for (var j = 0; j < stack.height; j++) {
                    var sprite = c.getChildAt(i + j * stack.width)
                    var value = stack.renderData[i + j * stack.width]
                    switch (value) {
                        case 0:
                            sprite.renderable = false;
                            break;
                        default:
                            sprite.tilePosition.x = 40 * (value - 1)
                            sprite.renderable = true;
                            break;
                    }
                }
            }
            return {
                container: c,
                background: bg
            };
        }
    }
}
module.exports = {
    initStackRender: initStackRender
}