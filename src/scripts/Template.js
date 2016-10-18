var Template = {
  opt: {
    searchBtn: '.head__btn--search'
  },
  init: function() {
    var _this = this;

    var search = new SearchForm(_this.opt.searchBtn);

    _this.initModal();
    _this.initGantt();
    _this.initTimingBox();
    _this.initLeftBar();
  },
  initTimingBox: function() {
    var unloadBox = document.querySelectorAll('.unloadBox__inner');

    forEach(unloadBox, function(index, value) {
      var unloadBox = new TimingBox(value);
    });
  },
  initGantt: function() {
    var gantt = new Gantt('gantt-id', {editProject: true});
    gantt.update({ proj: [
      {
        id: 3,
        name: 'Progetto 1',
        stage: [
          {id: 1, hours: 8, resources: 1},
          {id: 2, hours: 4, resources: 2}
        ]
      },
      {
        id: 45,
        name: 'Progetto 2',
        stage: [
          {id: 1, hours: 2, resources: 1},
          {id: 2, hours: 2, resources: 2}
        ]
      }
    ] });
    gantt.render();
  },
  initModal: function() {
    var openModal = document.querySelectorAll('[data-modal-id]');

    forEach(openModal, function(index, value) {
      var modal = new Modal({
        modalId: value.getAttribute('data-modal-id')
      });

      value.addEventListener('click', function(e) {
        e.stopPropagation();
        modal.open();
      });
    });
  },
  initLeftBar: function() {
    var toggleBtn = document.querySelector('[rel="toggleLeftbar"]');
    var el = document.documentElement;
    toggleBtn.addEventListener('click', function() {
      Framework.toggleClass(el, 'hide-leftbar');
    });
  }
};
