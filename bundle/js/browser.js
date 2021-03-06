'use strict';

var browser = {

  isNodejs: function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch (e) {}
    return isNodejs;
  }(),

  install: function install(inBrowser) {
    if (!this.isNodejs) {
      inBrowser();
    }
  }
};

module.exports = browser;