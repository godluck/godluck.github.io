function initBgmController(src, options) {
    //init audio
    var audio = document.createElement('audio')
    audio.src = src;
    //init options
    var option = options || {}
    var autoPlay = option.autoPlay || false;
    var controller = option.target
    var onPlay = option.onPlay || function() {
        controller.addClass ? controller.addClass('active') : controller.className += ' active'
    }
    var onPause = option.onPause || function() {
        controller.removeClass ? controller.removeClass('active') : (controller.className = controller.className.replace(/\bactive\b/, ''))
    };
    //init events
    var playing = false;
    audio.addEventListener('playing', function() {
        playing = true;
        onPlay()
    })
    audio.addEventListener('pause', function() {
        playing = false;
        onPause()
    });
    //handle options
    if (autoPlay) {
        audio.play()
        document.addEventListener('touchstart', function(e) {
            if (!started) {
                audio.play()
            }
        })
        document.addEventListener('WeiXinJSBridgeReady', function(e) {
            if (!started) {
                audio.play()
            }
        })
    }
    if (controller) {
        controller.on ? controller.on('click', function() {
            switcher()
        }) : controller.addEventListener('click', function() {
            switcher()
        })
    }

    function switcher() {
    	if(playing){
    		audio.pause()
    	}else{
    		audio.play()
    	}
    }
    return {
    	target:audio,
    	switcher:switcher,
    	play:function(){
    		audio.play()
    	},
    	pause:function(){
    		audio.pause()
    	}
    }
}
