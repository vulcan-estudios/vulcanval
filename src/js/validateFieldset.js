const log =           require('./log');
const utils =         require('./utils');
const convertMapTo =  require('./convertMapTo');
const rawValidation = require('./rawValidation');

/**
 * Validate all fields of fieldset in {@link map} provided.
 *
 * @static
 * @method validator.validateFieldset
 *
 * @param  {String} fieldsetName - The fieldset name to validate.
 * @param  {map} map - The data map (plain or nested).
 *
 * @return {Boolean|Object} If the fieldset fields are valid, `false` will be returned.
 * Otherwise there will be an object describing each field error as a plain map with its
 * keys as the fields names even if the property {@link settings.enableNestedMaps}
 * is enabled. Use the {@link vulcanval.convertMapTo} method if needed.
 *
 * @example
 * const map = {
 *   user: {
 *     name: 'Romel',
 *     age: 22
 *   },
 *   course: {
 *     id: '4cdfb11e1f3c000000007822',
 *     register: 'wrong value'
 *   }
 * };
 *
 * const settings = {
 *
 *   // Usually you would use nested maps with fieldsets.
 *   enableNestedMaps: true,
 *
 *   fieldsets: [{
 *     name: 'user',
 *     fields: ['user.name', 'user.age'],
 *     required: true
 *   }, {
 *     name: 'course',
 *     fields: ['course.id', 'course.register'],
 *     required: true
 *   }],
 *
 *   fields: [{
 *     name: 'user.name',
 *     validators: { isAlphanumeric: true, isLowercase: true }
 *   }, {
 *     name: 'user.age',
 *     validators: { isInt: { min: 1, max: 500 } }
 *   }, {
 *     name: 'course.id',
 *     validators: { isMongoId: true }
 *   }, {
 *     name: 'course.register',
 *     validators: { isISO8601: true }
 *   }]
 * };
 *
 * const vv = vulcanval(settings);
 *
 * const nameResult = vv.validateFieldset('user', map);
 * console.log(nameResult);
 * // { 'user.name': 'This field should only contain lowercase text.' }
 *
 * const ageResult = vv.validateFieldset('course', map);
 * console.log(ageResult);
 * // { 'course.register': 'Please type a valid date.' }
 */
module.exports = function (fieldsetName, map) {
  'use strict';

  if (typeof map !== 'object') {
    log.error('second parameter (map) must be an object');
  }

  const fieldset = utils.find(this.settings.fieldsets, fs => fs.name === fieldsetName);

  if (!fieldset) {
    log.error(`fieldset "${fieldsetName}" was not found`);
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn(`field "${name}" not found in map`);
    }
  };

  const errors = {};

  fieldset.fields.forEach(fieldname => {
    const err = this.rawValidation(fieldname);
    if (err) {
      errors[fieldname] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};
