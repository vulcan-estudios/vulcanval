const validator = require('validator');
const extend = require('extend');
const settings = require('./settings');
const log = require('./log');
const utils = require('./utils');
const convertMapTo = require('./convertMapTo');
const rawValidation = require('./rawValidation');

module.exports = function (fieldName, map, customSettings) {

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

  const context = {
    validator,
    settings: customSettings,
    get (name) {
      return map[name];
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

  if (isValidField === true) {
    return true;
  } else {
    log.debug(`invalid field name="${fieldName}" with value=${map[fieldName]}:`, isValidField.msg);
    return isValidField;
  }
};
