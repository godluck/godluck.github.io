function wrapNumber(target, length) {
    var offset = Math.floor(Math.log(target) / Math.log(10)) + 1
    if (target == 0) offset = 1;
    var prepender = ''
    for (var i = offset; i < length; i++) {
        prepender += 0
    }
    return prepender + target
}

function startCountDown(t, step, end) {
    if (t <= 0) {
        end && end()
        return;
    }
    var startTime = Date.now()
    var left = Math.floor(t / 1000)
    step && step(left)
    var endRun = false;
    var ticker = setInterval(function() {
        var cur = Date.now()
        var left = Math.floor((t - cur + startTime) / 1000)
        if (left >= 0) {
            step && step(left)
        } else {
            step && step(0)
        }
        if (cur - startTime > t) {
            if (endRun) return;
            endRun = true;
            end && end()
            clearInterval(ticker)
        }
    }, 1000)
}
function _getJson(url, data, callback, error, timeout) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: data,
        async: true,
        cache: false,
        jsonp: 'callback',
        timeout: timeout || 3000,
        success: function(data) {
            if (data && data.code) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            } else {
                error && error()
            }
        },
        error: function(xhr, textStatus) {
            error && error(xhr, textStatus);
        }
    });
}
function getPosition(target, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (target < arr[i]) {
            return i;
        }
    }
    return i;
}
function getExtend(str) {
    var nv, v, n, attrs = str.split('|');
    var data = {};
    for (var i = 0; i < attrs.length; i++) {
        if (!attrs[i]) continue;
        nv = attrs[i].split('&');
        n = null;
        v = null;
        for (var j in nv) {
            if (/name/.test(nv[j])) {
                n = nv[j].substr(5);
            }
            if (/value/.test(nv[j])) {
                v = nv[j].substr(6);
            }
        }
        data[n] = v;
    }
    return data;
}