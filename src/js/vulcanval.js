const extend =        require('extend');
const validator =     require('validator');
const settings =      require('./settings');
const log =           require('./log');
const utils =         require('./utils');
const browser =       require('./browser');
const rawValidation = require('./rawValidation');
const convertMapTo =  require('./convertMapTo');
const cleanMap =      require('./cleanMap');
const validateMap =   require('./validateMap');
const validateField = require('./validateField');

/**
 * jQuery object.
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

/**
 * This is a reference to the {@link module:vulcanval}.
 *
 * @name vulcanval
 * @memberof external:jQuery
 * @type {Object}
 * @see {@link module:vulcanval}
 */

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
const vulcanval = {

  validator,
  rawValidation,
  convertMapTo,
  cleanMap,
  validateField,
  validateMap,

  /**
   * Extend validators messages in an specific localization. If it does not exist,
   * it will be created.
   *
   * @param  {Object} locale - A plain object describing the locale.
   * @param  {String} locale.id - The identifier of the locale. It should be like:
   * `'en'`, `'es'`, `'jp'` or similar.
   * @param  {Object} locale.msgs - A plain object with validators names as keys
   * and messages formats as values. It should have a default value with the key
   * `general`, which will be used when there is no message for an specific validator
   * on error.
   *
   * @example
   * const locale = {
   *   id: 'jp',
   *   msgs: {
   *
   *     // Default error message: "Invalid form field error".
   *     general: '無効なフォームフィールド。',
   *
   *     // Message: "Form field has to be alphanumeric error message."
   *     isAlphanumeric: 'フォームフィールドは、英数字である必要があります。'
   *   }
   * };
   *
   * vulcanval.extendLocale(locale);
   */
  extendLocale (locale) {
    settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
  },

  /**
   * Set an specific locale as default in validations. The locale has to be
   * already installed with the {@link module:vulcanval.extendLocale vulcanval.extendLocale}
   * method.
   *
   * @param {String} locale - The locale identifier.
   *
   * @example
   * // Configuring messages in Japanese.
   * vulcanval.setLocale('jp');
   */
  setLocale (locale) {
    if (!settings.msgs[locale]) {
      return log.error(`the locale "${locale}" does not exist`);
    }
    settings.locale = locale;
  },

  /**
   * Add a custom validator.
   *
   * All validators in the package {@link https://www.npmjs.com/package/validator validator}
   * are installed and ready to use.
   *
   * @param {String} name - An alphanumeric validator name.
   * @param {Function} validator - The validator function. Receives as a first parameter
   * the value of the field and has to return a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value}.
   * This function will have the {@link utilityContext utility context} as
   * function context. Don't pass
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}
   * or it won't be available.
   *
   * @example
   * vulcanval.addValidator('isGreat', function (value) {
   *   return value.length > 4 && value.indexOf('great') >= 0;
   * });
   *
   * const map = {
   *   field0: 'normal value'
   * };
   *
   * const settings = {
   *   msgs: {
   *     isGreat: 'This field needs to be great!'
   *   },
   *   fields: [{
   *     name: 'field0',
   *     validators: {
   *       isGreat: true
   *     }
   *   }]
   * };
   *
   * const field0Valid = vulcanval.validateField('field0', map, settings);
   * console.log(field0Valid); // 'This field needs to be great!'
   *
   * @see In the example is used the {@link module:vulcanval.validateField vulcanval.validateField}
   * static method to test the new validator.
   */
  addValidator (name, validator) {
    settings.validators[name] = validator;
  },

  /**
   * Change the debug level.
   *
   * @param  {Boolean|Number} isDebug - A `true` value to display all messages.
   * A number to describe the scale of debug logs using the
   * {@link https://github.com/romelperez/prhone-log prhone-log} module to log
   * events. By default the log scale is `2`.
   */
  debug (isDebug) {
    if (isDebug !== undefined) {
      log.settings.scale = typeof isDebug === 'number' ? isDebug : isDebug ? 10 : 1;
    }
  }
};

browser.perform(false, function () {
  window.vulcanval = vulcanval;
});

module.exports = vulcanval;
