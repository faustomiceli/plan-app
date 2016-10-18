/**
 * TODO:
 * - add content url
 * - static content
 */
;(function(window) {
  'use strict';

  var DefaultOpt = {
    modelId: undefined,
    classModal: 'ffmodal',
    openClass: 'ffmodal--open',
    type: 'right',
    animationTiming: 333
  };

  function Modal(options) {
    this.opt = Framework.extend(DefaultOpt, options);
    this.isOpen = false;
    this._init();
  };

  Modal.prototype._init = function() {
    var _this = this;
    if (_this.opt.modalId) {
      _this.obj = _this._parseEl();
    } else {
      _this.obj = _this._createEl();
      document.body.appendChild(_this.obj);
    }
    _this._setEvents();
  };

  Modal.prototype._getContent = function() {
    var _this = this;

    var content = document.querySelector(_this.opt.content).innerHTML;
    return content;
  };

  Modal.prototype._setEvents = function() {
    var _this = this;

    _this.buttonClose.addEventListener('click', function() {
      _this.close();
    });

    document.addEventListener('click', function(e) {
      if (e.target == document.body) {
        _this.close();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.keyCode == 27) {
        _this.close();
      }
    });
  };

  Modal.prototype._parseEl = function() {
    var _this = this;
    var opt = _this.opt;

    _this.el = document.querySelector('#' + opt.modalId);
    _this.buttonClose = _this.el.querySelector('.' + _this.opt.classModal + '__closeBtn');
    _this.content = _this.el.querySelector('.' + _this.opt.classModal + '__content');

    return _this.el;
  };

  Modal.prototype._createEl = function() {
    var _this = this;

    _this.el = document.createElement('div');
    _this.el.className = _this.opt.classModal + ' ' + _this.opt.classModal + '--' + _this.opt.type;

    _this.buttonClose = document.createElement('button');
    _this.buttonClose.className = _this.opt.classModal + '__closeBtn';
    _this.el.appendChild(_this.buttonClose);

    _this.content = document.createElement('div');
    _this.content.className = _this.opt.classModal + '__content';
    _this.el.appendChild(_this.content);

    return _this.el;
  };

  Modal.prototype.open = function() {
    var _this = this;

    Framework.addClass(_this.el, _this.opt.openClass);
    Framework.addClass(document.documentElement, 'modal-open');

    _this.isOpen = true;
  };

  Modal.prototype.close = function() {
    var _this = this;

    Framework.removeClass(_this.el, _this.opt.openClass);
    Framework.removeClass(document.documentElement, 'modal-open');

    _this.isOpen = false;
  };

  window.Modal = Modal;

})(window);
