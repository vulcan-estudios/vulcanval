'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of all fields in fieldset in the `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspectFieldset - With value `'inspectFieldset'`.
 * @param  {String} fieldsetName - The fieldset name to inspect.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If fieldset is valid, `false` will be returned.
 */
var inspectFieldset = function inspectFieldset(fieldsetName) {
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

  var errors = {};

  var field = void 0;
  fieldset.fields.forEach(function (fieldName) {
    var invalid = vv.rawValidation(fieldName);
    if (invalid) errors[fieldName] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspectFieldset;