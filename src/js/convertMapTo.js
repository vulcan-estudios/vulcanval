const log = require('./log');
const utils = require('./utils');

/**
 * @namespace map
 * @type {Object}
 *
 * @description
 * A plain object as a data map extracted from a `<form>`.
 *
 * This is basically an plain object with keys as form fields names and values
 * as their respective values.
 *
 * The values can be strings, numbers or booleans. Currently there is no support
 * for arrays.
 *
 * The keys can be simple alphanumeric values but can be used to describe a nested
 * or deep map if they are dots in the string in plain maps. The dots are to describe
 * `<fieldset>`s in the form and improve the structure of complex forms.
 *
 * If the map is plain and its keys have dots in the strings, it can be converted
 * to a nested map. The inverse is the same, if the map is nested and has possibly
 * many levels of deep objects, it can be converted to a plain map with dots
 * in the keys describing the deep fields.
 *
 * @example
 * // Plain map.
 * const plainMap = {
 *   normal: 'value0',
 *   another: true,
 *   'using.dots.inside': 100
 * };
 *
 * // Nested map.
 * const nestedMap = {
 *   name: 'Romel Pérez',
 *   age: 22,
 *   like: {
 *     apple: true,
 *     watermelon: true,
 *     pumpkin: false
 *   },
 *   favourite: {
 *     fruit: 'Cantaloupe',
 *     book: 'Spice and Wolf',
 *     game: 'World of Warcraft'
 *   }
 * };
 *
 * @see The {@link settings.enableNestedMaps} which is used in the validation
 * methods to determine how to treat the data map. Mainly used in server-side.
 *
 * @see The {@link external:"jQuery.fn".vulcanval jQuery.fn.vulcanval} `getMap`
 * method which extracts a data map from the form or fields used in validation.
 * Used in client-side.
 */

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
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean') {
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
