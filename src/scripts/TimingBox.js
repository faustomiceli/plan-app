;(function(window) {
  'use strict';

  var DefaultOpt = {
    prefixSelector: '.unloadBox',
    prefixCssClass: 'unloadBox__inner',
    resMax: 10,
    resDefaultValue: 1
  };

  function TimingBox(value, options) {
    this.opt = Framework.extend(DefaultOpt, options);
    this.value = value;

    if (value) {
      this._init();
    }
  }

  TimingBox.prototype._init = function() {
    var _this = this;
    _this.container = _this.value.parentNode;
    _this.inputHour = _this.value.querySelector(_this.opt.prefixSelector + '__hour input');
    _this.inputRes = _this.value.querySelector(_this.opt.prefixSelector + '__res input');
    _this.btnContainer = _this.value.querySelector(_this.opt.prefixSelector + '__btn');
    _this.sliderContainer = _this.value.querySelector(_this.opt.prefixSelector + '__slider');
    _this.smallContainer = _this.value.querySelector(_this.opt.prefixSelector + '__small');

    _this._addBtn();
    _this._addSlider();
    _this._setInpuPlaceHolder();
    _this._setInputRes();
    _this._initSmall();
  };

  TimingBox.prototype._initSmall = function() {
    var _this = this;
    if (_this.smallContainer) {
      _this.smallContainer.addEventListener('click', function() {
        var otherInner = _this.container.querySelector(_this.opt.prefixSelector + '__inner:not(' + _this.opt.prefixSelector + '__inner--small)');
        Framework.removeClass(_this.value, _this.opt.prefixCssClass + '--small');
        Framework.addClass(otherInner, _this.opt.prefixCssClass + '--small');
      });
    }
  };

  TimingBox.prototype._setInpuPlaceHolder = function() {
    var _this = this;

    var fnFocus = function() {
      var value = this.value;
      this.setAttribute('placeholder', value);
      this.value = '';
    };

    var fnFocusOut = function() {
      var placeholder = this.getAttribute('placeholder');
      var value = this.value;

      if (!value && value === '') {
        this.value = placeholder;
      }
    };

    _this.inputHour.addEventListener('focus', fnFocus);
    _this.inputHour.addEventListener('focusout', fnFocusOut);
    _this.inputRes.addEventListener('focus', fnFocus);
    _this.inputRes.addEventListener('focusout', fnFocusOut);
  };

  TimingBox.prototype._setInputRes = function() {
    var _this = this;

    _this.inputRes.addEventListener('change', function() {
      var value = this.value;
      if (value > _this.opt.resMax) {
        _this.opt.resMax = value;
        _this._addSlider();
      }
    });
  };

  TimingBox.prototype._addBtn = function() {
    var _this = this;
    var input = _this.inputHour;
    var buttonIncrement = document.createElement('button');
    buttonIncrement.className = 'data-increment';
    buttonIncrement.innerHTML = '+';
    buttonIncrement.tabIndex = -1;
    buttonIncrement.onclick = function() {
      input.value = (parseInt(input.value) + 1) || 1;
    };

    var buttonDecrement = document.createElement('button');
    buttonDecrement.className = 'data-decrement';
    buttonDecrement.innerHTML = '-';
    buttonDecrement.tabIndex = -1;
    buttonDecrement.onclick = function() {
      input.value = ((parseInt(input.value) - 1) > -1) ? (parseInt(input.value) - 1) : input.value;
    };

    _this.btnContainer.appendChild(buttonIncrement);
    _this.btnContainer.appendChild(buttonDecrement);
  };

  TimingBox.prototype._addSlider = function() {
    var _this = this;

    _this.sliderContainer.innerHTML = '';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = _this.opt.resMax;
    slider.step = 1;
    slider.value = _this.inputRes.value || _this.opt.resDefaultValue;
    slider.tabIndex = -1;
    slider.oninput = function() {
      _this._rangeValue(slider.value);
    };

    _this.sliderContainer.appendChild(slider);
  };

  TimingBox.prototype._rangeValue = function(value) {
    var _this = this;
    _this.inputRes.value = value;
  };

  window.TimingBox = TimingBox;

})(window);
