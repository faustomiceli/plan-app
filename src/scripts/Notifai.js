;(function(window) {
  'use strict';

  var DefaultOpt = {
    title: null,
    text: '',
    duration: 5000,
    type: 'notify',
    classPrefix: 'notifai',
    showSuffix: 'show',
    hideSuffix: 'hide',
    transitionTime: 300,
    destroyAfterHide: true,
    onHide: null,
  };

  function Notifai(options) {
    var _this = this;
    _this.opt = Framework.extend(DefaultOpt, options);
    _this.obj = _this.create();

    setTimeout(function () {
      _this.show();
    }, 50);
  }

  Notifai.prototype.create = function () {
    var _this = this;
    var el = document.createElement('div');
    el.classList.add(_this.opt.classPrefix, _this.opt.classPrefix + '--' + _this.opt.type);
    el.innerHTML = '<span>' + _this.opt.text + '</span>';

    if (_this.opt.title) {
      var title = document.createElement('h2');
      title.innerHTML = _this.opt.title;
      el.appendChild(title);
    }

    var close = document.createElement('button');
    el.appendChild(close);

    el.addEventListener('click', function () {
      _this.hide();
    });

    document.body.appendChild(el);
    return el;
  };

  Notifai.prototype.show = function () {
    var _this = this;
    Framework.addClass(_this.obj, _this.opt.classPrefix + '--' + _this.opt.showSuffix);

    setTimeout(function () {
      if (_this.opt.duration > 0) {
        setTimeout(function () {
          _this.hide();
        }, _this.opt.duration);
      }
    }, _this.opt.transitionTime);
  };

  Notifai.prototype.hide = function () {
    var _this = this;
    Framework.removeClass(_this.obj, _this.opt.classPrefix + '--' + _this.opt.showSuffix);
    Framework.addClass(_this.obj, _this.opt.classPrefix + '--' + _this.opt.hideSuffix);

    if (typeof _this.opt.onHide === 'function') {
      _this.opt.onHide();
    }

    if (_this.opt.destroyAfterHide) {
      setTimeout(function () {
        _this.obj.remove();
        _this = null;
      }, _this.opt.transitionTime);
    }
  };

  window.Notifai = Notifai;

})(window);
