const log = require('../log');
const utils = require('../utils');
const ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset the form or specific field validation state.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `'reset'`.
 * @param  {String} [fieldName] - Only limite reset to specified field.
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

  field.$el.data({
    'vv-modified': void 0,
    'vv-valid': void 0,
    'vv-msg': void 0
  });

  ui.refreshFormState(settings);

  settings.fields.every(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = resetField;
