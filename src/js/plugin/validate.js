/**
 * Validate complete `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `validate`.
 * @param  {String} [fieldName] - Only limite validation to the field.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (fieldName) {

  const conf = this.data('vv-config');
  if (!conf) return this;

  // Should focus the first invalid field if there is.

  return this;
};
