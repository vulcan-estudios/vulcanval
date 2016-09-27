'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

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
var reset = function reset() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  settings.fields.forEach(function (field) {
    ui.removeFieldErrorClasses(settings, field);
    field.$el.data('vv-modified', null);
    field.$el.data('vv-valid', null);
    field.$el.data('vv-msg', null);
  });

  ui.refreshFormState(settings);

  if (settings.$form) {
    settings.$form.data('vv-modified', null);
    settings.$form.data('vv-valid', null);
  }

  settings.fields.forEach(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: null,
      msg: null
    });
  });

  return this;
};

module.exports = reset;