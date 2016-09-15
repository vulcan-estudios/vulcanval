'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of the `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `'inspect'`.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If form is valid, `false` will be returned.
 */
var inspect = function inspect() {

  var vv = this.data('vv');
  var settings = vv.settings;

  var errors = {};

  settings.fields.forEach(function (field) {
    var invalid = vv.rawValidation(field.name);
    if (invalid) errors[field.name] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspect;