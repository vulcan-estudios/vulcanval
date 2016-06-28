const validator = require('validator');

const utils = {

  /**
   * Is the environment Node.js?
   * Snippet source: https://github.com/iliakan/detect-node
   * @type {Boolean}
   */
  isNodejs: (function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch(e) {}
    return isNodejs;
  })(),

  performInBrowser (isNeeded, fn) {
    if (!utils.isNodejs) {
      if (window.jQuery) {
        fn();
      }
      else if (isNeeded) {
        log.error('jQuery is required to perform operations');
      }
    }
  },

  walkObject (obj, callback, context) {

    if (!context) context = obj;

    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        callback.call(context, obj[p], p);
      }
    }

    return obj;
  },

  everyInObject (obj, callback, context) {

    if (!context) context = obj;

    var keep;

    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        keep = callback.call(context, obj[name], name);
        if (!keep) return false;
      }
    }

    return !!keep;
  },

  findInObject (obj, callback, context) {

    if (!context) context = obj;

    var found;

    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        found = callback.call(context, obj[p], p);
        if (found) return obj[p];
      }
    }

    return obj;
  },

  find (arr, callback, context) {

    if (!context) context = arr;

    for (var i=0; i<arr.length; i++) {
      if (callback.call(context, arr[i], i)) {
        return arr[i];
      }
    }
  },

  format (str, params) {

    str = String(str);
    params = params || {};

    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        str = str.replace(new RegExp(`\{\{${p}\}\}`, 'g'), params[p]);
      }
    }

    return str;
  },

  validateFieldName (name) {
    return name.split('.').every(function (part) {
      return validator.isAlphanumeric(part) && !validator.isInt(part.charAt(0)) && !!part.length;
    });
  }
};

module.exports = utils;
