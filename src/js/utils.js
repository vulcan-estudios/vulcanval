const validator = require('validator');

const utils = {

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

  removeArrayDuplicates (arr) {
    'use strict';

    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }

    arr = [];
    for (let key in obj) {
      arr.push(key);
    }

    return arr;
  },

  format (str, params) {
    'use strict';

    str = String(str);
    params = params || {};

    const walk = (obj, list, i) => {
      if (!list[i]) return;
      if (typeof obj[list[i]] === 'object') {
        return walk(obj[list[i]], list, i+1);
      } else {
        return obj[list[i]];
      }
    };

    let name, value;
    let props = str.match(/\{\{\w+(\w|\.\w+)*\}\}/g);

    if (props && props.length) {

      props = utils.removeArrayDuplicates(props);
      props = props.map(p => p.replace('{{', '').replace('}}', '').split('.'));

      for (var i=0; i<props.length; i++) {
        value = walk(params, props[i], 0);
        if (value) {
          name = props[i].join('.');
          str = str.replace(new RegExp(`{{${name}}}`, 'g'), value);
        }
      }
    }

    return str;
  },

  validateFieldName (name) {
    return name.split('.').every(function (part) {
      return /^[-_a-zA-Z0-9]{1,}$/.test(part) &&
        !validator.isInt(part.charAt(0)) && !!part.length;
    });
  },

  trimSpaces (str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }
};

module.exports = utils;
