const log =           require('./log');
const utils =         require('./utils');
const convertMapTo =  require('./convertMapTo');
const rawValidation = require('./rawValidation');

/**
 * Validate a field in provided data {@link map} using the provided validation {@link settings}.
 *
 * @static
 * @method module:vulcanval.validateField
 *
 * @param  {String} fieldName - The field name in data map. If the {@link map} is nested,
 * the field name is set as in plain map. Ex: `{user: {name: 'romel'}}` will be `'user.name'`.
 * @param  {map} map - The data map (plain or nested).
 *
 * @return {Boolean|String} If it is valid, `false` will be returned. Otherwise
 * there will be an string message describing the error.
 *
 * @example
 * const map = {
 *   name: 'Romel',
 *   age: 22,
 *   likesPumpkin: false
 * };
 *
 * const settings = {
 *   fields: [{
 *     name: 'name',
 *     required: true,
 *     validators: {
 *       isAlphanumeric: 'en-US',
 *       isLowercase: true
 *     }
 *   }, {
 *     name: 'age',
 *     validators: {
 *       isInt: { min: 1, max: 500 }
 *     }
 *   }]
 * };
 *
 * const nameResult = vulcanval.validateField('name', map, settings);
 * console.log(nameResult); // 'This field should only contain lowercase text.'
 *
 * const ageResult = vulcanval.validateField('age', map, settings);
 * console.log(ageResult); // false
 */
module.exports = function (fieldName, map) {
  'use strict';

  if (typeof map !== 'object') {
    log.error('second parameter (map) must be an object');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  if (!utils.find(this.settings.fields, f => f.name === fieldName)) {
    log.error(`field "${fieldName}" was not found`);
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn(`field "${name}" not found in map`);
    }
  };

  return this.rawValidation(fieldName);
};
