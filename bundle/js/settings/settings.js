'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extend2 = require('extend');

var _extend3 = _interopRequireDefault(_extend2);

var _fieldSettings = require('./fieldSettings');

var _fieldSettings2 = _interopRequireDefault(_fieldSettings);

var _fieldsetSettings = require('./fieldsetSettings');

var _fieldsetSettings2 = _interopRequireDefault(_fieldsetSettings);

var _utilityContext = require('./utilityContext');

var _utilityContext2 = _interopRequireDefault(_utilityContext);

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _external = require('../external');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace settings
 * @type {Object}
 *
 * @description
 * {@link module:vulcanval vulcanval} validation settings by default.
 *
 * When using validation methods you have to pass an object settings to
 * configure the validation process which will overwrite this settings used by
 * default.
 */
var settings = {

  /**
   * *Only client-side.*
   *
   * Disable HTML5 validation with novalidate attribute when instanced on `<form>`.
   * This is enabled if attribute "novalidate" is present.
   *
   * @name disableHTML5Validation
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //disableHTML5Validation: null,

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields?
   *
   * Validation methods use this property to convert data {@link map maps} from
   * nested maps to plain maps when this property is enabled.
   *
   * @name enableNestedMaps
   * @memberof settings
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
  //enableNestedMaps: null,

  /**
   * Form will not be instantiated. In client side, if `<form>` has the attribute
   * `disabled`, this will be enabled.
   *
   * @name disabled
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * *Only client-side.*
   *
   * Validate field elements on instance time.
   *
   * @name autostart
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //autostart: null,

  /**
   * *Only client-side.*
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * @name intern
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * *Only client-side.*
   *
   * What event to listen to trigger the first validation on fields.
   *
   * @name firstValidationEvent
   * @memberof settings
   * @type {String}
   * @default 'blur change'
   */
  firstValidationEvent: 'blur change',

  /**
   * *Only client-side.*
   *
   * After first validation, what events to listen to re-validate fields.
   *
   * @name validationEvents
   * @memberof settings
   * @type {String}
   * @default 'input blur change'
   */
  validationEvents: 'input blur change',

  /**
   * Default messages locale.
   *
   * @name locale
   * @memberof settings
   * @type {String}
   * @default 'en'
   */
  locale: 'en',

  /**
   * *Only client-side.*
   *
   * HTML tag classes to add to specific elements in form on default and on error.
   *
   * @name classes
   * @memberof settings
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
   * **List of custom validators.**
   *
   * All of them recieve two parameters, the first one is the field value and the
   * second one the options gave to it when configured. Only if the user configured
   * a validator with an string, number or object value, it is received.
   *
   * The context of the validators is {@link utilityContext} so don't use arrow functions.
   *
   * @name validators
   * @memberof settings
   * @namespace
   * @see {@link module:vulcanval.addValidator vulcanval.addValidator()} to see how to add new ones.
   * @see {@link fieldSettings.validators} to see how to implement them.
   * @type {Object}
   */
  validators: {},

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
   * - The variable `{{value}}` is always present to use and it's the value of the field
   *   validating.
   * - The variable `{{option}}` can be used when the validator is configured
   *   with an string. Ex: in validator `isAlphanumeric: 'de-DE'`, the
   *   variable will have the `de-DE` value. This also applies to numbers.
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
   * @name msgs
   * @memberof settings
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
   *
   *       // If this fails, the default message will be used because the package
   *       // does not have a message for this validator by default
   *       isMongoId: true
   *     }
   *   }, {
   *     name: 'age',
   *     validators: {
   *       isInt: { max: 500 }
   *     }
   *   }]
   * };
   *
   * const vv = vulcanval(settings);
   *
   * let usernameValid = vv.validateField('username', map);
   * console.log(usernameValid); // 'Debe ser alfanumérico en local "en-GB".'
   *
   * map.username = 'rp';
   * usernameValid = vv.validateField('username', map);
   * console.log(usernameValid); // 'Mínimo valor: 4.'
   *
   * let ageValid = vv.validateField('age', map);
   * console.log(ageValid); // 'Valor "720" debe ser número entero.'
   */
  msgs: {
    defaults: {}
  },

  /**
   * *Only client-side.*
   *
   * Utility context.
   *
   * @private
   * @name context
   * @memberof settings
   * @see {@link utilityContext}
   * @type {Object}
   */
  context: null,

  /**
   * The form fieldsets to configure.
   *
   * @name fieldsets
   * @memberof settings
   * @see See {@link fieldsetSettings} for more info about its configuration.
   * @type {Array}
   * @default [ ]
   */
  fieldsets: [],

  /**
   * The form fields to configure.
   *
   * @name fields
   * @memberof settings
   * @see See {@link fieldSettings} for more info about its configuration.
   * @type {Array}
   * @default [ ]
   */
  fields: [],

  /**
   * *Only client-side.*
   *
   * jQuery `<form>` element.
   *
   * The form node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If any field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If all fields are valid. undefined if it's unknown.
   *
   * @private
   * @name $form
   * @memberof settings
   * @type {external:jQuery}
   */
  $form: null,

  /**
   * *Only client-side.*
   *
   * On form submit event.
   *
   * @private
   * @name onSubmit
   * @memberof settings
   * @type {Function}
   */
  onSubmit: null,

  /**
   * *Only client-side.*
   *
   * On form reset event.
   *
   * @private
   * @name onReset
   * @memberof settings
   * @type {Function}
   */
  onReset: null,

  /**
   * Get a message template according to locale.
   *
   * @private
   * @name getMsgTemplate
   * @memberof settings
   * @param  {String} id - Validator identifier.
   * @return {String}
   */
  getMsgTemplate: function getMsgTemplate(id) {
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
  },


  /**
   * Extend settings.
   *
   * @private
   * @name extend
   * @memberof settings
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} Extended settings.
   */
  extend: function extend(custom) {
    'use strict';

    if ((typeof custom === 'undefined' ? 'undefined' : _typeof(custom)) !== 'object') {
      return _log2.default.error('a valid object is required to extend');
    }

    custom = (0, _extend3.default)(true, {}, custom);

    var locales = [];
    _utils2.default.walkObject(this.msgs, function (msgs, locale) {
      if (locale !== 'defaults') locales.push(locale);
    });

    // Validate fields.
    if (!Array.isArray(custom.fields) || !custom.fields.length) {
      _log2.default.error('there are no fields for validation');
    }
    if (custom.fields) {
      custom.fields.forEach(function (field) {
        if (!_utils2.default.validateFieldName(field.name)) {
          _log2.default.error('field name "' + field.name + '" must be a valid name');
        }
      });
    }

    // Create context.
    // @NOTE: The .get() method the context has will be set on this object
    // when the instance on client or server side is made.
    custom.context = _utilityContext2.default.extend();

    // Process fieldsets.
    if (custom.fieldsets) {
      (function () {
        var fieldsNames = custom.fields.map(function (field) {
          return field.name;
        });

        custom.fieldsets = custom.fieldsets.map(function (fieldset) {

          var fields = void 0,
              field = void 0;

          if (typeof fieldset.name !== 'string' || !_external.validator.isAlphanumeric(fieldset.name) || !fieldset.name.length) {
            _log2.default.error('fieldset name "' + fieldset.name + '" is invalid');
          }

          if (fieldset.fields instanceof RegExp) {
            fields = fieldsNames.filter(function (name) {
              return fieldset.fields.test(name);
            });
          } else if (typeof fieldset.fields === 'string') {
            fields = fieldsNames.filter(function (name) {
              return name.indexOf(fieldset.fields) === 0;
            });
          } else if (Array.isArray(fieldset.fields)) {
            fields = [];
            fieldset.fields.forEach(function (fsfield) {
              field = _utils2.default.find(fieldsNames, function (fn) {
                return fn === fsfield;
              });
              if (field) fields.push(field);else _log2.default.error('fieldset field "' + fsfield + '" not found');
            });
          }

          if (!fields || !fields.length) {
            _log2.default.error('fieldset name "' + fieldset.name + '" fields not found');
          }

          fieldset.fields = fields;

          return _fieldsetSettings2.default.extend(fieldset);
        });
      })();
    }

    // Process fields.
    var inheritFromSettings = ['disabled', 'autostart', 'intern', 'firstValidationEvent', 'validationEvents'];
    var inheritFromFieldsetSettings = ['disabled', 'autostart', 'intern', 'required', 'onlyUI', 'firstValidationEvent', 'validationEvents'];
    custom.fields = custom.fields.map(function (field) {

      var newField = {};

      // value() will only be used in client side so field.$el will be available.
      if (field.value) {
        newField.value = field.value.bind(custom.context, field.$el);
      } else {
        newField.value = _fieldSettings2.default.value.bind(custom.context, field.$el);
      }

      if (field.onlyIf) {
        (function () {
          var onlyIf = field.onlyIf;
          delete field.onlyIf;
          newField.onlyIf = function () {
            return onlyIf.call(custom.context, custom.context.get && custom.context.get(field.name));
          };
        })();
      }

      var fromBaseSettings = _utils2.default.pick(settings, inheritFromSettings);
      var fromSettings = _utils2.default.pick(custom, inheritFromSettings);
      (0, _extend3.default)(newField, fromBaseSettings, fromSettings);

      if (custom.fieldsets) {
        custom.fieldsets.forEach(function (fieldset) {
          if (_utils2.default.find(fieldset.fields, function (ff) {
            return ff === field.name;
          })) {

            var fromFieldsetSettings = _utils2.default.pick(fieldset, inheritFromFieldsetSettings);
            (0, _extend3.default)(newField, fromFieldsetSettings);

            if (fieldset.onlyIf) {
              (function () {
                var onlyIf = newField.onlyIf;
                var fsOnlyIf = fieldset.onlyIf;
                delete newField.onlyIf;
                newField.onlyIf = function () {
                  return (onlyIf ? onlyIf() : true) && fsOnlyIf.call(custom.context, custom.context.get && custom.context.get(field.name));
                };
              })();
            }

            newField.validators = (0, _extend3.default)(true, {}, newField.validators, fieldset.validators, field.validators);
          }
        });
      }

      var validators = field.validators;
      var onlyIf = field.onlyIf;
      var value = field.value;
      delete field.validators;
      delete field.onlyIf;
      delete field.value;

      field = (0, _extend3.default)(newField, field);

      if (!field.validators) field.validators = validators;
      if (!field.onlyIf) field.onlyIf = onlyIf;
      if (!field.value) field.value = value;

      return _fieldSettings2.default.extend(field);
    });

    // Validate locale.
    if (custom.locale) {
      if (!this.msgs[custom.locale]) {
        _log2.default.error('locale "' + custom.locale + '" was not found');
      }
    }

    // Interpolate messages by validator to messages by locale.
    if (custom.msgs) {
      (function () {

        var msgs = custom.msgs;
        var newMsgs = {};

        var setMsgInLocale = function setMsgInLocale(locale, name, msg) {
          if (!newMsgs[locale]) newMsgs[locale] = {};
          newMsgs[locale][name] = msg;
        };
        var setMsgAsDefault = function setMsgAsDefault(name, msg) {

          // A default message will be set as the only one to search.
          if (!newMsgs.defaults) newMsgs.defaults = {};
          newMsgs.defaults[name] = msg;

          // Locale messages will be set to empty.
          locales.forEach(function (locale) {
            if (!newMsgs[locale]) newMsgs[locale] = {};
            newMsgs[locale][name] = null;
          });
        };

        _utils2.default.walkObject(msgs, function (messages, validatorName) {

          // Messages for properties in validator.
          // At the moment, only isLength works this way.
          if (validatorName === 'isLength') {
            var properties = messages;
            _utils2.default.walkObject(properties, function (value, property) {
              if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                _utils2.default.walkObject(value, function (message, locale) {
                  setMsgInLocale(locale, validatorName + '.' + property, message);
                });
              } else {
                setMsgAsDefault(validatorName + '.' + property, value);
              }
            });
          }

          if ((typeof messages === 'undefined' ? 'undefined' : _typeof(messages)) === 'object') {
            _utils2.default.walkObject(messages, function (message, locale) {
              setMsgInLocale(locale, validatorName, message);
            });
          } else {
            setMsgAsDefault(validatorName, messages);
          }
        });

        custom.msgs = newMsgs;
      })();
    }

    return (0, _extend3.default)(true, {}, this, custom);
  }
};

module.exports = settings;