var _protocal = '';
if ((/^https/ig).test(window.location.protocol)) {
    _protocal = 'https://';
} else {
    var _href = window.location.href;
    //            window.location.href = _href.replace(/^http/i, 'https');
    _protocal = 'http://';
}
var log = {
    init: function(_activity, _type) {
        var _this = this;
        _this.act = _activity;
        _this.tp = _type;
        _this.sendLog({
            key: '活动落地页总'
        });
        _this.listen();
    },
    listen: function() {
        var _this = this;
        $('body').on('click', '.J_log', function() {
            var _name = $(this).attr('data-log');
            _this.sendLog({
                key: _name
            });
        });
    },
    sendLog: function(_data) {
        var _this = this;
        var _params = [];
        for (var _p in _data) {
            if (_data.hasOwnProperty(_p)) {
                _params.push('' + _p + '=' + _data[_p]);
            }
        }
        _params.push('rid=' + new Date().getTime());
        _params.push('activity=' + _this.act);
        _params.push('type=' + _this.tp);
        var _url = _protocal + 'stat.mail.163.com/activity/a.js?' + _params.join('&');
        _url = encodeURI(_url);
        _this.addScript(_url);
    },
    addScript: function(_src) {
        var _this = this;
        var _script = document.createElement('script');
        _script.async = 'async';
        _script.src = _src;
        document.getElementsByTagName('head')[0].appendChild(_script);
    }
};
log.init(window.actName, 'h5'); //初始化，需要填入activity和type
