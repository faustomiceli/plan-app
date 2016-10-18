;(function(window) {
  'use strict';

  var DefaultOpt = {
    dayLength: 25,
    rowHeight: 40,
    showProjClass: 'show-proj-',
    hideOutClass: 'hide-out',
    editProject: false,
    projButtonsSortable: true,
    scrollOptions: {
      mouseWheel: true,
      scrollbars: true,
      scrollX: true,
      scrollY: false,
    },
    proj: [],
    onEdit: function() {
      console.log('Edit');
    }
  };

  function Gantt(container, options) {
    this.gantt = document.getElementById(container);
    this.ganttLeft = document.getElementById('wrapper-left');
    this.ganttRight = document.getElementById('wrapper-right');
    this.ganttScroll = this.ganttRight.querySelector('.gantt__scroll');
    this.init(options);
  }

  Gantt.prototype.init = function(options) {
    var _this = this;
    _this._updateOpt(options);
    _this._initProjectButtons();
    _this._initToggleButton();
    _this._initScroll();
  };

  Gantt.prototype.update = function(options) {
    var _this = this;
    _this._updateOpt(options);
  };

  Gantt.prototype._updateOpt = function(options) {
    var _this = this;
    this.opt = Framework.extend(_this.opt || DefaultOpt, options);
  };

  Gantt.prototype._initScroll = function () {
    var _this = this;
    setTimeout(function() {
      _this.scroll = new IScroll(_this.ganttRight, _this.opt.scrollOptions);
    }, 100);
  };

  Gantt.prototype._initToggleButton = function () {
    var _this = this;
    var btn = document.querySelector('#toggleOut');

    btn.addEventListener('change', function(e) {
      Framework.toggleClass(_this.gantt, _this.opt.hideOutClass);
    });
  };

  /**
   * Project button
   */
  Gantt.prototype._initProjectButtons = function() {
    var _this = this;
    var projBtn = document.querySelectorAll('[data-filter=true] .gantt__proj-button');

    forEach(projBtn, function(index, value) {
      var proj = value.getAttribute('data-proj');
      if (proj) {
        value.addEventListener('click', function() {
          Framework.toggleClass(_this.gantt, _this.opt.showProjClass + proj);
        });
      }
    });

    if (_this.opt.projButtonsSortable) {
      var btnArea = document.querySelector('.gantt__proj-list[data-sortable=true]');
      _this.btnSortable = Sortable.create(btnArea, {
        onUpdate: function (evt){
           console.log(evt);
        }
      });
    }
  };

  /**
   * Edit
   */
  Gantt.prototype.toggleEdit = function(el) {
    var _this = this;
    var rowParentEl = el.parentNode;
    var index = Array.prototype.indexOf.call(rowParentEl.parentNode.children, rowParentEl);
    var rightRowEl = _this.ganttScroll.children[index];

    var height = 0;
    if (Framework.hasClass(rowParentEl, 'gantt__row--edit')) {
      height = (_this.opt.rowHeight) + 'px';
      Framework.removeClass(rowParentEl, 'gantt__row--edit');
    } else {
      height = ((_this.opt.rowHeight * (_this.opt.proj.length + 1)) + 30) + 'px';
      Framework.addClass(rowParentEl, 'gantt__row--edit');
    }
    rowParentEl.style.height = height;
    rightRowEl.style.height = height;
  };

  Gantt.prototype._initEdit = function() {
    var _this = this;

    if (_this.opt.editProject) {
      var ganttRow = _this.gantt.querySelectorAll('.gantt__row:not(.gantt__row--noedit)');

      forEach(ganttRow, function(index, value) {
        // Add edit btn
        var editBtn = document.createElement('div');
        editBtn.className = 'gantt__editBtn';
        editBtn.innerHTML = '<i class="ion ion-edit"></i>';
        editBtn.addEventListener('click', function() {
          _this.toggleEdit(this);
        });
        value.appendChild(editBtn);

        // Add increment/decrement button
        forEach(value.querySelectorAll('input'), function(index, value) {
          _this._addIncrementBtn(value);
        });
      });
    }
  };

  Gantt.prototype._addIncrementBtn = function(input) {
    var buttonIncrement = document.createElement('button');
    buttonIncrement.className = 'data-increment';
    buttonIncrement.innerHTML = '+';
    buttonIncrement.onclick = function() {
      input.value = parseInt(input.value) + 1;
    };

    var buttonDecrement = document.createElement('button');
    buttonDecrement.className = 'data-decrement';
    buttonDecrement.innerHTML = '-';
    buttonDecrement.onclick = function() {
      input.value = ((parseInt(input.value) - 1) > -1) ? (parseInt(input.value) - 1) : input.value;
    };

    var inputWrapper = input.parentNode;
    inputWrapper.appendChild(buttonIncrement);
    inputWrapper.appendChild(buttonDecrement);
  };

  Gantt.prototype._getStage = function(proj, id) {
    for (var i = 0; i < proj.stage.length; i++) {
      if (proj.stage[i].id === id) {
        return proj.stage[i];
      }
    }
  };

  /**
   * Render
   */
  Gantt.prototype.render = function() {
    var _this = this;
    _this._initEdit();
    _this._renderSegments();
    _this._renderDeadLines();
  };

  Gantt.prototype._renderSegments = function() {
    var _this = this;
    var workItems = _this.gantt.querySelectorAll('.gantt__work-proj');
    forEach(workItems, function(index, value) {
      _this._renderSegment(value);
    });
  };

  Gantt.prototype._renderSegment = function(value) {
    var _this = this;
    var dayLength = value.getAttribute('data-proj-daylength');
    var dayStart = value.getAttribute('data-proj-daystart');
    var deltaToScroll = value.getAttribute('data-proj-next');

    value.style.width = (_this.opt.dayLength * dayLength) + 'px';
    value.style.left = (_this.opt.dayLength * dayStart) + 'px';

    if (deltaToScroll) {
      _this._setNextBtn(value, deltaToScroll);
    }
  };

  Gantt.prototype._renderDeadLines = function() {
    var _this = this;
    var deadlineItems = _this.gantt.querySelectorAll('.gantt__deadline');
    forEach(deadlineItems, function(index, value) {
      var day = value.getAttribute('data-proj-day');
      value.style.left = (_this.opt.dayLength * day) + 'px';
    });
  };

  Gantt.prototype._setNextBtn = function(item, delta) {
    var _this = this;
    var scrollX = (delta * _this.opt.dayLength) * -1;
    var btn = document.createElement('button');

    btn.addEventListener('click', function() {
      _this.scroll.scrollTo(scrollX, 0, 1000, IScroll.utils.ease.circular);
    });

    item.appendChild(btn);
  }

  window.Gantt = Gantt;

})(window);
