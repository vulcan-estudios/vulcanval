const log = require('../log');
const utils = require('../utils');

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of the `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `'inspect'`.
 * @param  {String} [fieldName] - Only limite inspection to the field.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If form is valid, `false` will be returned. If
 * the fieldName is sent, it will return an error message if field is invalid,
 * otherwise `false`.
 */
const inspect = function () {

  const vv = this.data('vv');
  const settings = vv.settings;

  const errors = {};

  settings.fields.forEach(function (field) {
    const invalid = vv.rawValidation(field.name);
    if (invalid) errors[field.name] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspect;
