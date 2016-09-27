const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

const ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset specific field validation state. This removes all current error states
 * from field.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} resetField - With value `'resetField'`.
 * @param  {String} fieldName - The name of the field.
 * @return {external:jQuery} The same jQuery object.
 */
const resetField = function (fieldName) {
  'use strict';

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  const vv = this.data('vv');
  const settings = vv.settings;

  const field = utils.find(settings.fields, f => f.name === fieldName);

  if (!field) {
    log.error(`field "${fieldName}" was not found`);
  }

  ui.removeFieldErrorClasses(settings, field);

  field.$el.data('vv-modified', null);
  field.$el.data('vv-valid', null);
  field.$el.data('vv-msg', null);

  ui.refreshFormState(settings);

  settings.fields.every(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: null,
      msg: null
    });
  });

  return this;
};

module.exports = resetField;
