'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate provided data map and get an object describing each field error if there are.
 *
 * @static
 * @method validator.validate
 *
 * @param  {map} map - The data map.
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
 * const vv = vulcanval(settings);
 *
 * const result = vv.validate(map);
 * console.log(result);
 * // {
 * //   name: 'This field should only contain lowercase text.',
 * //   likesPumpkin: 'Please fill out this field.'
 * // }
 *
 * map.name = 'romel';
 * map.likesPumpkin = true;
 * const result2 = vv.validate(map);
 * console.log(result2);
 * // false
 */
module.exports = function (map) {
  'use strict';

  var _this = this;

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('first parameter (map) must be an object');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn('field "' + name + '" not found in map');
    }
  };

  var errors = {};

  this.settings.fields.forEach(function (field) {
    var err = _this.rawValidation(field.name);
    if (err) {
      errors[field.name] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};