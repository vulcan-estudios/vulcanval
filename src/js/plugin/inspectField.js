const log = require('../log');
const utils = require('../utils');

const inspectField = function (fieldName) {

  const vv = this.data('vv');
  const settings = vv.settings;

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  const field = utils.find(settings.fields, f => f.name === fieldName);

  if (!field) {
    log.error(`field "${fieldName}" was not found`);
  }

  return vv.rawValidation(field.name);
};

module.exports = inspectField;
