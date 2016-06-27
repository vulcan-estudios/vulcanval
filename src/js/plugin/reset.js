const log = require('../log');
const utils = require('../utils');
const ui = require('./ui');

/**
 * Reset the form validation state.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `reset`.
 * @param  {String} [fieldName] - Only limite reset to specified field.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (fieldName) {
  'use strict';

  const settings = this.data('vv-settings');
  if (!settings) return this;

  let field;
  if (fieldName) {
    field = utils.find(settings.fields, f => f.name === fieldName);
    if (!field) log.error(`field "${fieldName}" not found`);
  }

  if (!field && settings.$form) {
    settings.$form.removeClass('vv-form_error');
    settings.$form.removeClass(settings.classes.error.form);
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  settings.fields.every(function (f) {

    if (field && field.name !== f.name) return true;

    f.$el.removeClass('vv-field_error');
    f.$el.removeClass(settings.classes.error.field);

    if (f.$display) {
      f.$display.removeClass('vv-display_error');
      f.$display.removeClass(settings.classes.error.display);
    }

    if (f.$labels) {
      f.$labels.removeClass('vv-label_error');
      f.$labels.removeClass(settings.classes.error.label);
    }

    f.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
    f.$el.trigger('vv-modify', {
      name: f.name,
      value: f.value(),
      valid: void 0
    });

    return true;
  });

  ui.refreshFormState(settings);

  return this;
};
