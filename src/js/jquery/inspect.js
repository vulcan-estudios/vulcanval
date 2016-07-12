const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

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
