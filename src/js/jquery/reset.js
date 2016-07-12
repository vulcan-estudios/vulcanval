const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

const ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset the `<form>` validation state. This removes all current error states.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `'reset'`.
 * @return {external:jQuery} The same jQuery object.
 */
const reset = function () {
  'use strict';

  const vv = this.data('vv');
  const settings = vv.settings;

  settings.fields.forEach(function (field) {
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

  settings.fields.forEach(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = reset;
