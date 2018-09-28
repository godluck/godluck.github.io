var PSC_Drop_Candy = null;
$(function() {
    var candies = [{
        weight: 30,
        option: {
            speed: 30,
            images: ['', ''],
            value: 5,

        }
    }, {
        weight: 70,
        option: {
            speed: 10,
            images: ['', ''],
            value: 1,

        }
    }];
    var weights = [],
        imageBuffer = [],
        totalWeight = 0,
        hide = false;

    function init() {
        for (var i = 0; i < candies.length; i++) {
            totalWeight += candies[i].weight;
            weights.push(candies[i].weight)
            var _imgs = candies[i].option.images;
            var _imgArray = [];
            for (var j = 0; j < _imgs.length; j++) {
                var _img = new Image();
                _img.src = _imgs[j];
                _imgArray.push(_img);
            }
            imageBuffer.push(_imgArray);
        }
    }

    function getRandomX() {
        var ww = $(window)
            .width();
        return ~~(ww * 0.15 + ww * 0.7 * Math.random());
    }

    function createCandy() {
        var random = Math.round(Math.random() * totalWeight);
        console.log(totalWeight, random)
        var randomIndex = 0;
        for (var i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random < 0) {
                randomIndex = i;
                break;
            }
        }
        var candy = candies[randomIndex];
        var candyDOM = $('<div class="u-candy"><div class="u-candy-image"></div><div class="u-candy-value">+<span class="u-candy-amount"></span></div></div>');
        if (hide) {
            candyDOM.hide();
        }
        candyDOM.css('left', getRandomX());
        candyDOM.find('.u-candy-image').html(imageBuffer[randomIndex][0]);
        candyDOM.find('.u-candy-amount').html(candy.option.value);
        $('body').append(candyDOM);
        candyDOM.velocity({
            top: $(window).height() + candyDOM.height()
        }, {
            duration: 50000 / candy.option.speed,
            queue: false,
            easing: [.5, 0, 1, .25],
            complete: function() {
                $(this).remove();
            }
        });
        candyDOM.on('click', function() {
            var $this = $(this)
            $this
                .velocity('stop')
                .velocity({ opacity: 0 }, {
                    duration: 300,
                    queue: false,
                    easing: 'linear',
                    delay: 1000,
                    complete: function() {
                        $this.remove();
                    }
                })
            $this
                .find('.u-candy-value')
                .show()
                .velocity({ top: '-=50px' }, {
                    duration: 500,
                    queue: false,
                    easing: 'ease-out'
                })
        })
    }

    function hideCandy() {
        hide = true;
        $('.u-candy').hide()
    }
    function showCandy() {
        hide = false;
        $('.u-candy').show()
    }
    init();
    PSC_Drop_Candy = {
        createCandy: createCandy,
        hideCandy: hideCandy,
        showCandy:showCandy
    }
});
// cubic-bezier(0.310, 0.440, 0.445, 1.650)
