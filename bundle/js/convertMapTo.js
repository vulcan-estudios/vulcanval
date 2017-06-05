'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');

// Plain to nested.
var toNested = function toNested(map) {

  var split, first, last;
  utils.walkObject(map, function (val, prop1) {

    split = prop1.split('.');

    if (!utils.validateFieldName(prop1)) {
      log.error('map field name "' + prop1 + '" is invalid');
    }

    last = split[split.length - 1];
    first = prop1.replace('.' + last, '');

    utils.walkObject(map, function (val2, prop2) {
      if (prop1 !== prop2 && first === prop2) {
        log.error('map field name "' + prop2 + '" is invalid');
      }
    });
  });

  var form = {};
  var names = [];

  utils.walkObject(map, function (val, prop) {
    names.push({ keys: prop.split('.'), value: val });
  });

  var obj;
  names.forEach(function (name) {
    obj = form;
    name.keys.forEach(function (key, index) {
      if (index === name.keys.length - 1) {
        obj[key] = name.value;
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    });
  });

  return form;
};

// Nested to plain.
var toPlain = function toPlain(map) {

  var split;

  var form = {};
  var throwErr = function throwErr(key) {
    return log.error('map field name "' + key + '" is invalid');
  };
  var isInvalidKey = function isInvalidKey(str) {
    return str.split('.').length > 1;
  };
  var run = function run(n, o, p) {
    if (o.hasOwnProperty(p)) {
      n += '.' + p;
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean' || o[p] === undefined || o[p] === null) {
        n = n.substring(1);
        form[n] = o[p];
      } else {
        for (var k in o[p]) {
          if (isInvalidKey(k)) throwErr(k);
          run(n, o[p], k);
        }
      }
    }
  };

  for (var p in map) {
    if (isInvalidKey(p)) throwErr(p);
    run('', map, p);
  }

  return form;
};

/**
 * Convert a map from nested to plain and viceversa.
 *
 * @static
 * @method module:vulcanval.convertMapTo
 *
 * @param  {String} to - It can have two values: `plain` or `nested`.
 * @param  {map} map - The object to convert.
 * @return {map} The converted object map.
 */
module.exports = function (to, map) {
  'use strict';

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('second parameter (map) must be an object');
  }

  to = to.toLowerCase();

  switch (to) {
    case 'nested':
      return toNested(map);
    case 'plain':
      return toPlain(map);
    default:
      return map;
  }
};