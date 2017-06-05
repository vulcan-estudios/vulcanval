'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate a field in provided data {@link map}.
 *
 * @static
 * @method validator.validateField
 *
 * @param  {String} fieldName - The field name to validate. If the {@link map} is nested,
 * the field name should be set as in plain map. Ex: `{user: {name: 'romel'}}` will be `'user.name'`.
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
 * const vv = vulcanval(settings);
 *
 * const nameResult = vv.validateField('name', map);
 * console.log(nameResult); // 'This field should only contain lowercase text.'
 *
 * const ageResult = vv.validateField('age', map);
 * console.log(ageResult); // false
 */
module.exports = function (fieldName, map) {
  'use strict';

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    log.error('second parameter (map) must be an object');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  if (!utils.find(this.settings.fields, function (f) {
    return f.name === fieldName;
  })) {
    log.error('field "' + fieldName + '" was not found');
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn('field "' + name + '" not found in map');
    }
  };

  return this.rawValidation(fieldName);
};