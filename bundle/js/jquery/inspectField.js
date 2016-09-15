'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of an specific field in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspectField - With value `'inspectField'`.
 * @param  {String} [fieldName] - The field name to inspect.
 * @return {String|Boolean}  It will return an error message if field is invalid,
 * otherwise `false`.
 */
var inspectField = function inspectField(fieldName) {

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  var field = utils.find(settings.fields, function (f) {
    return f.name === fieldName;
  });

  if (!field) {
    log.error('field "' + fieldName + '" was not found');
  }

  return vv.rawValidation(field.name);
};

module.exports = inspectField;