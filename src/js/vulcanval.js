const extend =    require('extend');
const validator = require('validator');

const settings =      require('./settings');
const log =           require('./log');
const isMapValid =    require('./isMapValid');
const inspectMap =    require('./inspectMap');
const convertMapTo =  require('./convertMapTo');
const validateField = require('./validateField');
const localeEN =      require('./localization/en');

const vulcanval = {

  validator,
  validateField,
  isMapValid,
  inspectMap,
  convertMapTo,

  extendLocale (locale) {
    settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
  },

  setLocale (locale) {
    if (!settings.msgs[locale]) {
      return log.error(`the locale "${locale}" does not exist`);
    }
    settings.locale = locale;
  },

  addValidator (name, validator) {
    settings.validators[name] = validator;
  },

  debug (isDebug) {
    if (isDebug !== undefined) {
      log.settings.production = !isDebug;
    }
  }
};

vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

module.exports = vulcanval;
