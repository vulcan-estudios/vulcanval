const log = require('../log');
const utils = require('../utils');
const ui = require('./_ui');

/**
 * Reset the form or specific field validation state.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `'reset'`.
 * @param  {String} [fieldName] - Only limite reset to specified field.
 * @return {external:jQuery} The same jQuery object.
 */
const reset = function (fieldName) {
  'use strict';

  const settings = this.data('vv-settings');

  let field;
  if (fieldName) {
    field = utils.find(settings.fields, f => f.name === fieldName);
    if (!field) log.error(`field "${fieldName}" not found`);
  }

  settings.fields.forEach(function (f) {

    if (field && field.name !== f.name) return;

    ui.removeFieldErrorClasses(settings, f);

    f.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0,
      'vv-msg': void 0
    });
  });

  ui.refreshFormState(settings);

  if (!field && settings.$form) {
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  settings.fields.every(function (f) {
    f.$el.trigger('vv-modify', {
      name: f.name,
      value: f.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = reset;
