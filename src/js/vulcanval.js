const extend =    require('extend');
const validator = require('validator');

const log =       require('./log');
const utils =     require('./utils');
const browser =   require('./browser');
const localeEN =  require('./locale/en');

const settings =          require('./settings/settings');
const fieldsetSettings =  require('./settings/fieldsetSettings');
const fieldSettings =     require('./settings/fieldSettings');
const utilityContext =    require('./settings/utilityContext');

const extendLocale =      require('./extendLocale');
const convertMapTo =      require('./convertMapTo');
const cleanMap =          require('./cleanMap');
const addValidator =      require('./addValidator');
const rawValidation =     require('./rawValidation');
const validate =          require('./validate');
const validateField =     require('./validateField');
const validateFieldset =  require('./validateFieldset');

const isEqualToField =      require('./validators/isEqualToField');
const isAlphanumericText =  require('./validators/isAlphanumericText');

/**
 * This is a reference to the {@link module:vulcanval vulcanval}.
 *
 * @name vulcanval
 * @memberof external:window
 * @type {Object}
 * @see {@link module:vulcanval}
 */

/**
 * Proto
 */
const vulcanvalProto = {
  cleanMap,
  rawValidation,
  validate,
  validateFieldset,
  validateField
};

/**
 * The vulcan validator (vulcanval) object.
 *
 * This module exposes some static methods to validate data maps extracted maybe
 * extracted from client-side form elements. The data maps are simple plain JavaScript
 * objects with each element name and value in form. The validations configurations
 * are extended from the {@link settings}.
 *
 * In Node.js environments use like:
 *
 * ```js
 * const vulcanval = require('vulcanval');
 * ```
 *
 * In browser environments this object is available in {@link external:window.vulcanval window.vulcanval}.
 *
 * @module vulcanval
 */
const vulcanval = function (custom) {
  return extend(Object.create(vulcanvalProto), {
    settings: settings.extend(custom)
  });
};

vulcanval.version =   '2.0.0';
vulcanval.log =       log;
vulcanval.utils =     utils;
vulcanval.validator = validator;

vulcanval.settings =          settings;
vulcanval.fieldsetSettings =  fieldsetSettings;
vulcanval.fieldSettings =     fieldSettings;
vulcanval.utilityContext =    utilityContext;

vulcanval.extendLocale = extendLocale;
vulcanval.addValidator = addValidator;
vulcanval.convertMapTo = convertMapTo;

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.settings.locale = 'en';

// Install custom validators.
vulcanval.addValidator('isEqualToField', isEqualToField);
vulcanval.addValidator('isAlphanumericText', isAlphanumericText);

// Install module in browser if client side.
browser.perform(false, function () {
  window.vulcanval = vulcanval;
});

module.exports = vulcanval;
