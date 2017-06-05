const extend = require('extend');
const log = require('./log');
const utils = require('./utils');
const convertMapTo = require('./convertMapTo');

/**
 * Clean a {@link map} from properties outside the validation process.
 *
 * This is done by removing all properties which are not present in the fields
 * list of validation and the fields which are disabled or intented to be
 * only used in client side.
 *
 * @static
 * @method validator.cleanMap
 *
 * @param  {Boolean} isPlain - If the {@link map} is plain. `false` for nested.
 * @param  {map} map - The map to clean.
 *
 * @return {map} - The cleaned map.
 *
 * @see An example of this method is in the
 * {@link https://github.com/vulcan-estudios/vulcanval/tree/master/demo/server demo server}.
 */
module.exports = function (isPlain, map) {
  'use strict';

  if (typeof isPlain !== 'boolean') {
    map = isPlain;
    isPlain = true;
  }

  if (!isPlain) {
    map = convertMapTo('plain', map);
  }

  const newMap = {};

  this.settings.fields.forEach(field => {
    if (field.disabled || field.onlyUI) return;
    const value = map[field.name];
    if (value !== void 0) {
      newMap[field.name] = map[field.name];
    }
  });

  if (!isPlain) {
    return convertMapTo('nested', newMap);
  }

  return newMap;
};
