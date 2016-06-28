const extend = require('extend');
const log = require('./log');
const utils = require('./utils');
const convertMapTo = require('./convertMapTo');

/**
 * Clean a map.
 *
 * @static
 * @method module:vulcanval.cleanMap
 *
 * @param  {Boolean} isPlain
 * @param  {map} map
 * @param  {settings} settings
 *
 * @return {map}
 */
module.exports = function (isPlain, map, settings) {
  'use strict';

  if (!isPlain) {
    map = convertMapTo('plain', map);
  }

  const newMap = {};

  settings.fields.forEach(field => {
    newMap[field.name] = map[field.name];
  });

  if (!isPlain) {
    return convertMapTo('nested', newMap);
  }

  return newMap;
};
