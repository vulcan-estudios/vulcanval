'use strict';

var browser = {

  isNodejs: function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch (e) {}
    return isNodejs;
  }(),

  perform: function perform(isNeeded, fn) {
    if (!browser.isNodejs) {
      if (window.jQuery) {
        fn();
      } else if (isNeeded) {
        throw new Error('jQuery is required to perform operations');
      }
    }
  }
};

module.exports = browser;