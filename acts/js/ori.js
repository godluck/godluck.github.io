/*!
 * PSC_lazyload v1.0.0
 * Licensed under MIT ()
 * Developer xl
 */

;
(function() {
  var o = {
    init: function(color) {
      var self = this;
      self.clr = color || '#a65a2a';
      self.pic = '';
      self.txt = '';
      self.str = '';
      self.ele = '';
      self.callback = null;
      self.view();
      self.update();
    },
    view: function() {
      var self = this;
      var w, i, c, s;
      var t = self.prefix;
      w = 'display:none;position: absolute;top: 0;left: 0;z-index: 9999;overflow: hidden;width: 100%;height: 100%;background: #fff;';
      c = 'position: absolute;top: 50%;left: 50%; width: 300px; height: 150px;margin: -75px 0 0 -150px;color: rgb(255, 255, 255);text-align: center;';
      i = 'position: relative;display: block;width: 72px;height: 110px;margin: 0 auto 10px;background-color: ' + self.clr + ';background-image: url(data:image/png;base64,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);background-repeat: no-repeat;background-size: 100% 100%;' + t + 'transform: rotate(-90deg);' + t + 'animation: phone 1.5s ease-in infinite;';
      s = '@' + t + 'keyframes phone {0% {' + t + 'transform: rotate(-90deg);}25% {' + t + 'transform: rotate(-90deg);}50% {' + t + 'transform: rotate(0deg);}75% {' + t + 'transform: rotate(0deg);}100% {' + t + 'transform: rotate(-90deg);}}';
      var _pic = document.createElement('i');
      _pic.style.cssText = i;
      self.pic = _pic;
      var _txt = document.createElement('p');
      _txt.style.cssText = 'text-align:center;font-size:16px;color:' + self.clr;
      _txt.innerHTML = '为了更好的体验，请使用竖屏浏览';
      self.txt = _txt;
      self.str = document.createElement('div');
      self.str.style.cssText = c;
      self.str.appendChild(self.pic);
      self.str.appendChild(self.txt);
      self.styleAdd.add(s);
      self.ele = document.createElement('div');
      self.ele.style.cssText = w;
      self.ele.appendChild(self.str);
      document.body.appendChild(self.ele);
      self.listen();
    },
    listen: function() {
      var self = this;
      window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
        self.ort(self.ele);
      }, false);
      self.ort(self.ele);
    },
    prefix: function() {
      var self = this;
      var _test = document.createElement('div');
      _test.style.cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
      if (_test.style.webkitTransition) {
        return '-webkit-'
      } else if (_test.style.mozTransition) {
        return '-moz-'
      } else if (_test.style.oTransition) {
        return '-o-'
      } else if (_test.style.msTransition) {
        return '-ms-'
      } else {
        return '';
      }
    }(),
    styleAdd: function() {
      function t(t) {
        var n = e,
            r = t.split('\r\n');
        var i = !! n.cssRules ? n.cssRules.length : 0;
        for (var s = 0; s < r.length; ++s) {
          n.insertRule(r[s], i++)
        }
        return i
      }
      var e = function() {
        var e = document.getElementsByTagName('head')[0];
        var t = document.createElement('style');
        t.type = 'text/css';
        e.appendChild(t);
        return document.styleSheets[document.styleSheets.length - 1]
      }();
      return {
        add: t
      }
    }(),
    ort: function($el) {
      var self = this;
      if (window.orientation == 0 || window.orientation == 180) {
        $el.style.display = 'none';
        return false;
      } else if (window.orientation == 90 || window.orientation == -90) {
        $el.style.display = 'block';
        isTiping = true;
        return false;
      }
    },
    update: function(color) {
      var self = this;
      self.pic.style.backgroundColor = color;
      self.txt.style.color = color;
    },
    callback: function(func) {
      var self = this;
      if (func && typeof func === 'function') {
        self.callback = func;
      } else {
        alert('callback illegal');
      }
    }
  }
  window.oritent = o;
})(this);
window.oritent.init();