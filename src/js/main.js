const extend =        require('extend');
const validator =     require('validator');
const settings =      require('./settings');
const log =           require('./log');
const utils =         require('./utils');
const rawValidation = require('./rawValidation');
const convertMapTo =  require('./convertMapTo');
const validateMap =   require('./validateMap');
const validateField = require('./validateField');

module.exports = {

  validator,
  rawValidation,
  convertMapTo,
  validateField,
  validateMap,

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
      log.settings.scale = isDebug ? 10 : 2;
    }
  }
};
