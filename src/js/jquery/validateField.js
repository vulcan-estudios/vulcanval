const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually an specific field in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateField - With value `'validateField'`.
 * @param  {String} fieldName - The field name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
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
