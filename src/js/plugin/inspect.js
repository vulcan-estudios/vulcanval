const utils = require('../utils');
const rawValidation = require('../rawValidation');

/**
 * Inspect the validation status of the `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `inspect`.
 * @param  {String} [fieldName] - Only limite inspection to the field.
 * @return {Object} A plain object with keys as field names and values with objects
 * describing: `{ * value, Boolean isValid, String [msg] }`.
 */
module.exports = function (fieldName) {

  const settings = this.data('vv-settings');
  if (!settings) return this;

  if (fieldName) {
    const field = utils.find(settings.fields, f => f.name === fieldName);
    return rawValidation({
      settings,
      context: field._context,
      field: { name: field.name, value: field.value() }
    });
  }

  else {
    const errors = {};
    settings.fields.forEach(function (field) {
      const invalid = rawValidation({
        settings,
        context: field._context,
        field: { name: field.name, value: field.value() }
      });
      if (invalid) errors[field.name] = invalid;
    });
    return Object.keys(errors).length ? errors : false;
  }
};
