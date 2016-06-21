const validator = require('validator');
const extend = require('extend');
const settings = require('./settings');
const log = require('./log');
const utils = require('./utils');
const convertMapTo = require('./convertMapTo');

module.exports = function (map, customSettings, callback) {

  if (typeof map !== 'object') {
    return log.error('first parameter (map) must be an object');
  }

  if (typeof customSettings === 'function') {
    callback = customSettings;
    customSettings = null;
  }

  customSettings = extend(true, settings, customSettings);

  if (customSettings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  const context = {
    config: customSettings,
    get: function (name) {
      return map[name];
    }
  };

  return customSettings.fields.every(function (field) {

    const valueType = typeof map[field.name];
    const value = valueType === 'boolean' ? map[field.name] : String(map[field.name]);

    if (typeof field !== 'object') {
      log.warn('fields array should contain only objects');
      return true;
    }

    if (field.disabled) {
      return true;
    }

    if (field.condition && !field.condition.call(context)) {
      return true;
    }

    if (field.required) {
      if (valueType === 'boolean') {
        return !!value;
      }
    } else {
      if (value === '' || valueType === 'boolean') {
        return true;
      }
    }

    return utils.everyInObject(field.validators, function (val, valName) {

      const valType = typeof val;
      const valOpts = valType === 'object' || valType === 'string' || valType === 'number' ?
        val :
        undefined;

      // isLength validator.
      if (valName === 'isLength') {
        if (valType !== 'object') {
          return log.error('fields validator "isLength" must be an object if defined');
        }
        return validator.isLength(value, val);
      }

      // matches validator.
      else if (valName === 'matches') {
        if (valType !== 'object') {
          return log.error('fields validator "matches" must be an object if defined');
        }
        return validator.matches(value, val.pattern);
      }

      // Custom validator.
      else if (customSettings.validators[valName]) {
        return customSettings.validators[valName].call(context, value, valOpts);
      }

      // `validator` validator.
      else if (validator[valName]) {
        return validator[valName](value, valOpts);
      }

      // Not found.
      else {
        return log.error(`validator "${valName}" was not found`);
      }
    });
  });
};
