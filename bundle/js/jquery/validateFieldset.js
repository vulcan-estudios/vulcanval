'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields of an specific fieldset in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateFieldset - With value `'validateFieldset'`.
 * @param  {String} fieldsetName - The fieldset name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
var validateFieldset = function validateFieldset(fieldsetName) {
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
  var invalid = void 0;
  var first = true;

  fieldset.fields.forEach(function (fieldName) {

    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(fieldName);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validateFieldset;