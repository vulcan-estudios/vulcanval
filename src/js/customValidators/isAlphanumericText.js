module.exports = function isAlphanumericText (value, locale) {
  value = value.replace(/\s/g, '').replace(/\r?\n/g, '');
  locale = typeof locale === 'string' ? locale : undefined;
  return this.validator.isAlphanumeric(value, locale);
};
