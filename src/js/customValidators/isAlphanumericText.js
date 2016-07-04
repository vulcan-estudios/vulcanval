/**
 * @name isAlphanumericText
 * @memberof settings.validators
 * @function
 *
 * @description
 * This is the same as the validator `isAlphanumeric` except that this cleans
 * spaces and line endings before validating so the field needs to have valid
 * alphanumeric strings.
 */
module.exports = function isAlphanumericText (value, locale) {
  value = value.replace(/\s/g, '').replace(/\r?\n/g, '');
  locale = typeof locale === 'string' ? locale : undefined;
  return this.validator.isAlphanumeric(value, locale);
};
