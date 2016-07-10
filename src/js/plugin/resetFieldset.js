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
const resetFieldset = function (fieldsetName) {
  'use strict';

  const vv = this.data('vv');
  const settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  const fieldset = utils.find(settings.fieldsets, fs => fs.name === fieldsetName);

  if (!fieldset) {
    log.error(`fieldset "${fieldsetName}" was not found`);
  }

  let field;

  fieldset.fields.forEach(function (fieldName) {
    field = utils.find(settings.fields, f => f.name === fieldName);
    ui.removeFieldErrorClasses(settings, field);
    field.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0,
      'vv-msg': void 0
    });
  });

  ui.refreshFormState(settings);

  if (settings.$form) {
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  fieldset.fields.forEach(function (fieldName) {
    field = utils.find(settings.fields, f => f.name === fieldName);
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = resetFieldset;