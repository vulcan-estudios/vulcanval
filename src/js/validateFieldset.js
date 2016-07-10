const log =           require('./log');
const utils =         require('./utils');
const convertMapTo =  require('./convertMapTo');
const rawValidation = require('./rawValidation');

/**
 * Validate all fields in a fieldset.
 *
 * @method module:vulcanval.validateFieldset
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
