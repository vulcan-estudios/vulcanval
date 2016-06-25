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

  const conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};
