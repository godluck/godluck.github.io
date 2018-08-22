import loader from './lib/zipLoader.js'

function loadMusic(url, filename, cb) {
    loader.initLoad(url, {
        loadOptions: {
            success: function(f) {
                var musicData = f[filename]
                cb && cb(musicData)
            },
            error: function(e) {
                // console.log(e)
            },
            progress: function(p) {
                // console.log(p)
            }
        },
        returnOptions: {
            'jpg': loader.TYPE_URL,
            'png': loader.TYPE_URL,
            'mp3': loader.TYPE_RAW
        },
        mimeOptions: {
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'mp3': 'audio/mpeg'
        }
    })
}

function createPlayer(musicData, cb) {
    var ac = window.AudioContext || window.webkitAudioContext
    var ctx = new ac()
    var gain = ctx.createGain()
    var delay = ctx.createDelay()
    var compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -50

    ctx.decodeAudioData(musicData, function(data) {
        //在音频解析完成之后，创建 BufferSourceNode 作为输入节点
        // var music = ctx.createBufferSource()
        // music.buffer = data
        // music.loop = false
        // music.playbackRate.value = 1

        // music.connect(gain)
        // gain.connect(delay)
        // delay.connect(compressor)
        // compressor.connect(ctx.destination)

        var player = {
            ctx: ctx,
            // music: music,
            volume: gain,
            delay: delay,
            start: function(...args) {
                var music = ctx.createBufferSource()
                music.buffer = data
                music.loop = false
                music.playbackRate.value = 1

                music.connect(gain)
                gain.connect(delay)
                delay.connect(compressor)
                compressor.connect(ctx.destination)
                music.start(...args)
                return music
            }
        }

        cb && cb(player)
    })
}

function initMusic(url, filename, cb) {
    loadMusic(url, filename, function(data) {
        createPlayer(data.buffer, cb)
    })
}

export default { initMusic }