/**
 * Forces all `<form>` fields or specific field to be invalid.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} forceInvalid - With value `forceInvalid`.
 * @param  {String} [fieldName] - Specific field name.
 * @return {external:jQuery}
 */
module.exports = function (fieldName) {

  const conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};
