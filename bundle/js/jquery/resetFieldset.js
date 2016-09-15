'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset all fields in fieldset validation state. This removes all current error states
 * in those fields.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} resetFieldset - With value `'resetFieldset'`.
 * @param  {String} fieldsetName - Fieldset name to reset.
 * @return {external:jQuery} The same jQuery object.
 */
var resetFieldset = function resetFieldset(fieldsetName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  var fieldset = utils.find(settings.fieldsets, function (fs) {
    return fs.name === fieldsetName;
  });

  if (!fieldset) {
    log.error('fieldset "' + fieldsetName + '" was not found');
  }

  var field = void 0;

  fieldset.fields.forEach(function (fieldName) {
    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
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
    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
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