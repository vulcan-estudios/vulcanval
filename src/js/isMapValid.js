const validator = require('validator');
const extend = require('extend');
const settings = require('./settings');
const log = require('./log');
const utils = require('./utils');
const convertMapTo = require('./convertMapTo');
const validateField = require('./validateField');

module.exports = function (map, customSettings) {

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

  const context = {
    settings: customSettings,
    get (name) {
      return map[name];
    }
  };

  return customSettings.fields.every(function (field) {

    const isValidField = validateField({
      field: {
        name: field.name,
        value: map[field.name]
      },
      settings: customSettings,
      context
    });

    if (isValidField === true) {
      return true;
    } else {
      log.debug(`invalid field name="${field.name}" with value=${map[field.name]}:`, isValidField.msg);
      return false;
    }
  });
};
