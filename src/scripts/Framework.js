var Framework = {
  hasClass: function(elem, c) {
    return elem.classList.contains(c);
  },
  addClass: function(elem, c) {
    elem.classList.add(c);
  },
  removeClass: function(elem, c) {
    elem.classList.remove(c);
  },
  toggleClass: function(elem, c) {
    var fn = this.hasClass(elem, c) ? this.removeClass : this.addClass;
    fn(elem, c);
  },
  extend: function(o1, o2) {
    var extended = {};
    var prop;
    for (prop in o1) {
      if (Object.prototype.hasOwnProperty.call(o1, prop)) {
        extended[prop] = o1[prop];
      }
    }
    for (prop in o2) {
      if (Object.prototype.hasOwnProperty.call(o2, prop)) {
        extended[prop] = o2[prop];
      }
    }
    return extended;
  }
};

var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};
