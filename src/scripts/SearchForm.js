;(function(window) {
  'use strict';

  var opt = {
    searchOpenClass: 'open',
    animationTiming: 333
  };

  function SearchForm(el) {
    if (typeof el == 'string') {
      this.el = document.querySelector(el);
    } else if (typeof el == 'object') {
      this.el = el;
    } else {
      throw 'Parametro non valido';
    }

    this.searchIcon = this.el.querySelector('i');
    this.searchForm = this.el.querySelector('form');
    this.searchInput = this.el.querySelector('input');
    this.isOpen = false;
    this._initEvents();
  };

  SearchForm.prototype._initEvents = function() {
    var _this = this;

    var btnFn = function(ev) {
      ev.stopPropagation();

      if (!_this.isOpen) {
        _this._open();
      }
    };

    var iconFn = function(ev) {
      if (_this.isOpen) {
        ev.stopPropagation();

        if (_this.searchInput.value.length > 0) {
          _this.searchForm.submit();
        } else {
          _this._close();
        }
      }
    };

    var keyFn = function(ev) {
      var keyCode = ev.keyCode || ev.which;
      if (keyCode === 27 && _this.isOpen) {
        _this._close();
      } else if (ev.ctrlKey && keyCode === 70 && !_this.isOpen) {
        _this._open();
      }
    };

    var documentFn = function(ev) {
      _this._close();
    };

    _this.el.addEventListener('click', btnFn);
    _this.searchIcon.addEventListener('click', iconFn);
    document.addEventListener('click', documentFn);
    document.addEventListener('keydown', keyFn);
  };

  SearchForm.prototype._open = function() {
    var _this = this;

    Framework.addClass(_this.el, opt.searchOpenClass);
    setInterval(function() {
      _this.searchInput.focus();
    }, opt.animationTiming);
    _this.isOpen = true;
  };

  SearchForm.prototype._close = function() {
    var _this = this;

    Framework.removeClass(_this.el, opt.searchOpenClass);
    _this.isOpen = false;
  };

  window.SearchForm = SearchForm;

})(window);
