const extend = require('extend');
const log = require('./log');
const utils = require('./utils');

/**
 * @namespace settings
 * @type {Object}
 *
 * @description
 * vulcanval validation settings by default.
 *
 * When using validation methods you have to pass an object settings to
 * configure the validation process which will overwrite this settings used by
 * default.
 */
const settings = {

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * What event to listen to trigger the first validation on fields.
   *
   * @type {String}
   * @default 'blur change'
   */
  firstValidationEvent: 'blur change',

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * After first validation, what events to listen to re-validate fields.
   *
   * @type {String}
   * @default 'input blur change'
   */
  validationEvents: 'input blur change',

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * Validate field elements on instance time.
   *
   * @type {Boolean}
   * @default false
   */
  autostart: null,

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * @type {Boolean}
   * @default false
   */
  intern: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * Disable HTML5 validation with novalidate attribute when instanced on `<form>`.
   * This is enabled if attribute "novalidate" is present.
   *
   * @type {Boolean}
   * @default false
   */
  disableHTML5Validation: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * HTML tag classes to add to specific elements in form on error.
   * @type {Object}
   * @property {Object} [defaults] - Static classes.
   * @property {String} [defaults.form] - Form classes.
   * @property {String} [defaults.field] - Field classes.
   * @property {String} [defaults.label] - Field related label classes.
   * @property {String} [defaults.display] - Display classes.
   * @property {Object} [error] - On error classes.
   * @property {String} [error.form] - Form classes.
   * @property {String} [error.field] - Field classes.
   * @property {String} [error.label] - Field related label classes.
   * @property {String} [error.display] - Display classes.
   */
  classes: {
    defaults: {
      form: '',
      label: '',
      field: '',
      display: ''
    },
    error: {
      form: '',
      label: '',
      field: '',
      display: ''
    }
  },

  /**
   * Only client-side.
   *
   * jQuery `<form>` element.
   *
   * The form node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If any field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If all fields are valid. undefined if it's unknown.
   *
   * @private
   * @type {external:jQuery}
   */
  $form: null,

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields?
   *
   * Validation methods use this property to convert data {@link map maps} from
   * nested maps to plain maps when this property is enabled.
   *
   * @type {Boolean}
   * @default false
   *
   * @example
   * // Using a form like this:
   * // <form>
   * //  <input name="field1" />
   * //  <input name="map1.field2" />
   * //  <input name="map1.field3" />
   * //  <input name="map2.field4" />
   * // </form>
   *
   * const map = $('form').vulcanval('getMap');
   *
   * // If nested maps are enabled, the map object will have this value:
   * // { field1: '', map1: { field2: '', field3: '' }, map2: { field4: '' } }
   *
   * // Otherwise:
   * // { field1: '', 'map1.field2': '', 'map1.field3': '', 'map2.field4': '' }
   *
   * @see {@link external:"jQuery.fn".vulcanval}
   */
  enableNestedMaps: null,

  /**
   * **List of custom validators.**
   *
   * All of them recieve two parameters, the first one is the field value and the
   * second one the options gave to it when configured. Only if the user configured
   * a validator with an string, number or object value, it is received.
   *
   * The context of the validators is {@link fieldSettings} so don't use arrow functions.
   *
   * @namespace
   * @see {@link module:vulcanval.addValidator vulcanval.addValidator()} to see how to add new ones.
   * @see {@link fieldSettings.validators} to see how to implement them.
   * @type {Object}
   */
  validators: {},

  /**
   * Default messages locale.
   *
   * @type {String}
   * @default 'en'
   */
  locale: 'en',

  /**
   * Validators messages formats. This is an a plain object with keys as validator
   * names and values as messages formats. The messages can be configured by
   * locale otherwise the messages will be for the validator regardless the
   * locale configured.
   *
   * If a validator does not have a message for a locale, it will use the message
   * `general` in the locale.
   *
   * The formats can have some variables expressed as `{{var}}` where `var` is the
   * variable name.
   *
   * - The variable `{{value}}` is always present to use.
   * - The variable `{{option}}` can be used when the validator is configured
   *   with an string. Ex: in validator `isAlphanumeric: 'de-DE'`, the
   *   variable will have the `de-DE` value.
   * - If the validator is configured with an object, then its properties are
   *   available as variables. Ex: in `isInt: {min:4, max:8}`, `{{min}}` and `{{max}}`
   *   will be available as variables in the message.
   *
   * There is one exception, the validator `isLength` can have an specific message
   * for its two properties to configure, min and max values. Other validators only
   * have messages regardless the properties passes to it. See examples.
   *
   * Also, the order of validator messages on errors can vary.
   *
   * @type {Object}
   * @default {}
   *
   * @example
   * const map = {
   *   username: 'Romel Pérez',
   *   age: 720
   * };
   *
   * const settings = {
   *
   *   locale: 'es',
   *   msgs: {
   *
   *     // Used regardless the locale.
   *     isAlphanumeric: 'Debe ser alfanumérico en local "{{option}}".',
   *
   *     // Configured by locale.
   *     isInt: {
   *       en: 'Value "{{value}}" must be a integer number.',
   *       es: 'Valor "{{value}}" debe ser número entero.'
   *     },
   *
   *     // This is an special case. We can configure by properties only in this validator.
   *     isLength: {
   *
   *       // We can configure a global message when the validator fails in this property.
   *       min: 'Mínimo valor: {{min}}.',
   *
   *       // And we can configure by locale too.
   *       max: {
   *         en: 'Maximum value: {{max}}.',
   *         es: 'Máximo valor: {{max}}.'
   *       }
   *     }
   *   },
   *
   *   fields: [{
   *     name: 'username',
   *     validators: {
   *       isAlphanumeric: 'en-GB',
   *       isLength: { min: 4, max: 16 },
   *       isLowercase: true  // If this fails, the default message will be used
   *     }
   *   }, {
   *     name: 'age',
   *     validators: {
   *       isInt: { max: 500 }
   *     }
   *   }]
   * };
   *
   * let usernameValid = vulcanval.validateField('username', map, settings);
   * console.log(usernameValid); // 'Debe ser alfanumérico en local "en-GB".'
   *
   * map.username = 'rp';
   * usernameValid = vulcanval.validateField('username', map, settings);
   * console.log(usernameValid); // 'Mínimo valor: 4.'
   *
   * let ageValid = vulcanval.validateField('age', map, settings);
   * console.log(ageValid); // 'Valor "720" debe ser número entero.'
   */
  msgs: {
    defaults: {}
  },

  /**
   * The form fields to configure.
   *
   * The main property to configure validation.
   *
   * @type {Array}
   * @default [ ]
   */
  fields: [],

  /**
   * Only client-side.
   *
   * Utility context. Makes reference to the {@link utilityContext}.
   *
   * @private
   * @type {Object}
   */
  context: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * On form submit event.
   *
   * @private
   * @type {Function}
   */
  onSubmit: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * On form reset event.
   *
   * @private
   * @type {Function}
   */
  onReset: null,

  /**
   * Extend settings.
   *
   * @private
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} Extended settings.
   */
  extend (custom) {
    'use strict';

    custom = extend(true, {}, custom);

    const locales = [];
    utils.walkObject(this.msgs, function (msgs, locale) {
      if (locale !== 'defaults') locales.push(locale);
    });

    // Validate locale.
    if (custom.locale) {
      if (!this.msgs[custom.locale]) {
        log.error(`locale "${custom.locale}" not found`);
      }
    }

    // Interpolate messages by validator to messages by locale.
    if (custom.msgs) {

      const msgs = custom.msgs;
      const newMsgs = {};

      const setMsgInLocale = (locale, name, msg) => {
        if (!newMsgs[locale]) newMsgs[locale] = {};
        newMsgs[locale][name] = msg;
      };
      const setMsgAsDefault = (name, msg) => {

        // A default message will be set as the only one to search.
        if (!newMsgs.defaults) newMsgs.defaults = {};
        newMsgs.defaults[name] = msg;

        // Locale messages will be set to empty.
        locales.forEach(function (locale) {
          if (!newMsgs[locale]) newMsgs[locale] = {};
          newMsgs[locale][name] = null;
        });
      };

      utils.walkObject(msgs, function (messages, validatorName) {

        // Messages for properties in validator.
        // At the moment, only isLength works this way.
        if (validatorName === 'isLength') {
          const properties = messages;
          utils.walkObject(properties, function (value, property) {
            if (typeof value === 'object') {
              utils.walkObject(value, function (message, locale) {
                setMsgInLocale(locale, `${validatorName}.${property}`, message);
              });
            } else {
              setMsgAsDefault(`${validatorName}.${property}`, value);
            }
          });
        }

        if (typeof messages === 'object') {
          utils.walkObject(messages, function (message, locale) {
            setMsgInLocale(locale, validatorName, message);
          });
        } else {
          setMsgAsDefault(validatorName, messages);
        }
      });

      custom.msgs = newMsgs;
    }

    return extend(true, {}, this, custom);
  },

  /**
   * Get a message template according to locale.
   *
   * @private
   * @param  {String} id - Validator identifier.
   * @return {String}
   */
  getMsgTemplate (id) {
    'use strict';

    // locale with validator
    if (this.msgs[this.locale] && this.msgs[this.locale][id]) {
      return this.msgs[this.locale][id];
    }
    // default with validator
    else if (this.msgs.defaults[id]) {
      return this.msgs.defaults[id];
    }
    // locale general
    else if (this.msgs[this.locale] && this.msgs[this.locale].general) {
      return this.msgs[this.locale].general;
    }
    // default general
    else {
      return this.msgs.defaults.general;
    }
  }
};

module.exports = settings;
