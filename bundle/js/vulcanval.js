'use strict';

var extend = require('extend');

var validator = require('./external').validator;
var log = require('./log');
var utils = require('./utils');
var browser = require('./browser');
var localeEN = require('./locale/en');
var version = require('./version');

var settings = require('./settings/settings');
var fieldsetSettings = require('./settings/fieldsetSettings');
var fieldSettings = require('./settings/fieldSettings');
var utilityContext = require('./settings/utilityContext');

var extendLocale = require('./extendLocale');
var convertMapTo = require('./convertMapTo');
var cleanMap = require('./cleanMap');
var addValidator = require('./addValidator');
var rawValidation = require('./rawValidation');
var validate = require('./validate');
var validateField = require('./validateField');
var validateFieldset = require('./validateFieldset');

var isEqualToField = require('./validators/isEqualToField');
var isAlphanumericText = require('./validators/isAlphanumericText');

/**
 * This is a reference to the {@link module:vulcanval vulcanval}.
 *
 * @name vulcanval
 * @memberof external:window
 * @type {Object}
 * @see {@link module:vulcanval}
 */

/**
 * @namespace validator
 * @type {Object}
 * @description
 * This is an object created by the module {@link module:vulcanval vulcanval} by
 * specified {@link settings} to validate {@link map data maps}.
 *
 * This object has some methods to help you validate data possibly extracted from
 * forms through a configuration that can be used in client side and server side.
 *
 * @see {@link module:vulcanval vulcanval} to see how to create this object.
 */
var vulcanvalProto = {
  cleanMap: cleanMap,
  rawValidation: rawValidation,
  validate: validate,
  validateFieldset: validateFieldset,
  validateField: validateField
};

/**
 * The vulcan validator (vulcanval) creator.
 *
 * This module is a function which receives a {@link settings} object and returns
 * a {@link validator} object to validate {@link map data maps}.
 *
 * Also this has some properties and methods to configure the validations globally.
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
 * @see {@link validator}
 * @example
 * // Changing a global configuration in settings.
 * vulcanval.settings.locale = 'pt';
 *
 * // Addind a new validator method.
 * vulcanval.addValidator('valName', function () { ... });
 *
 * // Extending/creating a new locale/language.
 * vulcanval.extendLocale({ ... });
 *
 * // A form configuration to create a validator.
 * const settings = {
 *   fields: [{
 *     name: 'fieldName',
 *     validators: {}
 *   }]
 * };
 *
 * // Creating a validator from settings.
 * const validator = vulcanval(settings);
 *
 * // A data map to validate.
 * const map = {
 *   fieldName: 'field value'
 * };
 *
 * // Validating the map with the validator.
 * const result = validator.validate(map);
 */
var vulcanval = function vulcanval(custom) {
  return extend(Object.create(vulcanvalProto), {
    settings: settings.extend(custom)
  });
};

vulcanval.addMethod = function (name, method) {
  if (typeof name !== 'string' || !name) {
    log.error('A valid method name should be provided.');
  }
  if (typeof method !== 'function') {
    log.error('A valid function should be provided as second parameter.');
  }
  vulcanvalProto[name] = method;
};

/**
 * @name log
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link https://github.com/romelperez/prhone-log prhone-log}
 * package instance used to log messages.
 */
vulcanval.log = log;

/**
 * @name validator
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link https://github.com/chriso/validator.js validator}
 * package.
 */
vulcanval.validator = validator;

/**
 * @name settings
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link settings} global configuration.
 */
vulcanval.settings = settings;

/**
 * @name utilityContext
 * @memberof module:vulcanval
 * @type {Object}
 *
 * @description
 * This is a reference to the {@link utilityContext} global configuration.
 *
 * This can be mutated to use your own custom properties and methods in any
 * method/function that make use of this context.
 */
vulcanval.utilityContext = utilityContext;

vulcanval.version = version;
vulcanval.utils = utils;
vulcanval.fieldsetSettings = fieldsetSettings;
vulcanval.fieldSettings = fieldSettings;
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
browser.install(function () {
  window.vulcanval = vulcanval;
});

module.exports = vulcanval;