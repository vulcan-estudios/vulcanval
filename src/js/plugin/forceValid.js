/**
 * Forces all `<form>` fields or specific field to be valid.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} forceValid - With value `forceValid`.
 * @param  {String} [fieldName] - Specific field name.
 * @return {external:jQuery}
 */
module.exports = function (fieldName) {

  const conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};
