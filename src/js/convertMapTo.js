const log = require('./log');
const utils = require('./utils');

// Plain to nested.
const toNested = function (map) {

  var split, first, last;
  utils.walkObject(map, function (val, prop1) {

    split = prop1.split('.');

    if (!utils.validateFieldName(prop1)) {
      log.error(`map field name "${prop1}" is invalid`);
    }

    last = split[split.length-1];
    first = prop1.replace('.' + last, '');

    utils.walkObject(map, function (val2, prop2) {
      if (prop1 !== prop2 && first === prop2) {
        log.error(`map field name "${prop2}" is invalid`);
      }
    });
  });

  const form = {};
  const names = [];

  utils.walkObject(map, function (val, prop) {
    names.push({ keys: prop.split('.'), value: val });
  });

  var obj;
  names.forEach(function (name) {
    obj = form;
    name.keys.forEach(function (key, index) {
      if (index === name.keys.length-1) {
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
const toPlain = function (map) {

  var split;

  const form = {};
  const throwErr = (key) => log.error(`map field name "${key}" is invalid`);
  const isInvalidKey = str => str.split('.').length > 1;
  const run = (n, o, p) => {
    if (o.hasOwnProperty(p)) {
      n += '.'+ p;
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean' ||
      o[p] === undefined || o[p] === null) {
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
 * @return {Object} The converted object.
 */
module.exports = function (to, map) {
  'use strict';

  if (typeof map !== 'object') {
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
