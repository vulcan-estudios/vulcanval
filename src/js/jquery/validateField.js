const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

const validateField = function (fieldName) {
  'use strict';

  const vv = this.data('vv');
  const settings = vv.settings;

  if (!fieldName) {
    log.error(`a valid field name is required`);
  }

  const field = utils.find(settings.fields, f => f.name === fieldName);

  if (!field) {
    log.error(`field "${fieldName}" was not found`);
  }

  field.$el.trigger('vv-change');

  field.$el.trigger('focus');

  return this;
};

module.exports = validateField;
