const validator =     require('validator');
const extend =        require('extend');
const settings =      require('./settings');
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
 * @param  {settings} settings - The validation settings.
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
module.exports = function (fieldName, map, customSettings) {
  'use strict';

  if (typeof map !== 'object') {
    return log.error('second parameter (map) must be an object');
  }
  if (typeof customSettings !== 'object') {
    return log.error('third parameter (settings) must be an object');
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

  const isValidField = rawValidation({
    field: {
      name: fieldName,
      value: map[fieldName]
    },
    settings: customSettings,
    context
  });

  return isValidField;
};
