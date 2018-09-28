function initFPS(options) {
    var raf = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();
    var caf = (function() {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id)
            };
    })();
    var container = document.createElement('div')
    container.className = 'PSC_FPS'
    container.style.position = 'fixed'
    container.style.left = '10px'
    container.style.top = '10px'
    container.style.padding = '5px'
    container.style.fontSize = '20px'
    document.body.appendChild(container)
    var showFPS = function(fps) {
        container.innerHTML = 'FPS:' + fps
    }
    var fpsdata = []
    var start = Date.now()
    var frame;
    var tick = function() {
        var now = Date.now()
        var timeInterval = now - start;
        if (timeInterval) {
            var fps = 1000 / timeInterval
            fpsdata.push(fps)
        }
        start = now;
        frame = raf(tick)
    }
    var show = setInterval(function() {
        var sum = 0;
        for (var i = 0; i < fpsdata.length; i++) {
            sum += fpsdata[i];
        }
        var fps_average = sum / fpsdata.length;
        fpsdata = []
        showFPS(~~fps_average)
    }, 500)
    tick()

    return {
    	destory:function(){
    		clearInterval(show)
    		caf(frame)
    		container.innerHTML = ''
    		document.body.removeChild(container)
    	}
    }
}
initFPS()
