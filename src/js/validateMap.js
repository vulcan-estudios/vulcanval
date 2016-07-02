const validator =     require('validator');
const extend =        require('extend');
const settings =      require('./settings');
const log =           require('./log');
const utils =         require('./utils');
const convertMapTo =  require('./convertMapTo');
const rawValidation = require('./rawValidation');

/**
 * Validate provided data map using the provided validation settings and get an
 * object describing each field error if there are.
 *
 * @static
 * @method module:vulcanval.validateMap
 *
 * @param  {map} map - The data map.
 * @param  {settings} settings - The validation settings.
 *
 * @return {Boolean|Object} If the map is valid, `false` will be returned. Otherwise
 * there will be an object describing each field error as a plain map with its
 * keys as the fields names even if the property {@link settings.enableNestedMaps}
 * is enabled. Use the {@link vulcanval.convertMapTo} method if needed.
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
 *   }, {
 *     name: 'likesPumpkin',
 *     required: true
 *   }]
 * };
 *
 * const result = vulcanval.validateMap(map, settings);
 * console.log(result);
 * // {
 * //   name: 'This field should only contain lowercase text.',
 * //   likesPumpkin: 'Please fill out this field.'
 * // }
 *
 * map.name = 'romel';
 * map.likesPumpkin = true;
 * const result2 = vulcanval.validateMap(map, settings);
 * console.log(result2);
 * // false
 */
module.exports = function (map, customSettings) {
  'use strict';

  if (typeof map !== 'object') {
    return log.error('first parameter (map) must be an object');
  }
  if (typeof customSettings !== 'object') {
    return log.error('second parameter (settings) must be an object');
  }

  customSettings = settings.extend(customSettings);

  if (customSettings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  // Creating the './utilityContext' for this validation.
  const context = {
    validator,
    get (name) {
      if (map[name]) {
        return map[name];
      } else {
        log.warn(`field "${name}" not found in map`);
      }
    }
  };

  const errors = {};

  customSettings.fields.forEach(function (field) {

    const err = rawValidation({
      field: {
        name: field.name,
        value: map[field.name]
      },
      settings: customSettings,
      context
    });

    if (err) {
      log.debug(`invalid field name="${field.name}" with value=${map[field.name]}:`, err);
      errors[field.name] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};
