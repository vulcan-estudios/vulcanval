const extend = require('extend');
const utils = require('./utils');

const settings = {

  /**
   * UI. Overwritten by field.
   * What event to listen to trigger the first validation on fields.
   * @type {String}
   */
  firstValidationEvent: 'blur change',

  /**
   * UI. Overwritten by field.
   * After first validation, what events to listen to re-validate fields.
   * @type {String}
   */
  validationEvents: 'input blur change',

  /**
   * UI. Overwritten by field.
   * Validate field elements on instance time.
   * @type {Boolean}
   */
  autostart: false,

  /**
   * UI. Overwritten by field.
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   * @type {Boolean}
   */
  intern: false,

  /**
   * UI. <form>.
   * Enable asynchronous validations. The UI API will behave differently.
   * @type {Boolean}
   */
  async: false,

  /**
   * UI. <form>.
   * Disable HTML5 validation with novalidate attribute when instanced on <form>.
   * @type {Boolean}
   */
  disableHTML5Validation: false,

  /**
   * UI. <form>.
   * HTML tag classes to add to specific elements in form on error.
   * @type {Object}
   */
  classes: {
    error: {
      form: '',
      label: '',
      input: '',
      display: ''
    }
  },

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields.
   * @type {Boolean}
   *
   * @example
   * ```html
   * <form>
   *  <input name="field1" />
   *  <input name="map1.field2" />
   *  <input name="map1.field3" />
   *  <input name="map2.field4" />
   * </form>
   * ```
   *
   * ```js
   * const map = $('form').vulcanval('map');
   * ```
   *
   * If nested maps are enabled, the map object will have this value:
   * ```json
   * { field1: '', map1: { field2: '', field3: '' }, map2: { field4: '' } }
   * ```
   *
   * Otherwise:
   * ```json
   * { field1: '', 'map1.field2': '', 'map1.field3': '', 'map2.field4': '' }
   * ```
   */
  enableNestedMaps: false,

  /**
   * List of custom validators.
   * @type {Object}
   */
  validators: {
    isEqualToField (value, opts) {
      return value === this.get(opts);
    }
  },

  /**
   * Default messages locale.
   * @type {String}
   */
  locale: 'en',

  /**
   * Validators messages. If a validator does not have a message for a locale,
   * it will be search in the `defaults` "locale".
   * @type {Object}
   */
  msgs: {
    defaults: {}
  },

  /**
   * The form fields to configure.
   * @type {Array}
   */
  fields: [],

  /**
   * Extend settings.
   * @private
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} - Extended settings.
   */
  extend (custom) {

    custom = extend(true, {}, custom);

    const locales = [];
    utils.walkObject(this.msgs, function (msgs, locale) {
      if (locale !== 'defaults') locales.push(locale);
    });

    // Interpolate messages by validator to messages by locale.
    if (custom.msgs) {
      const msgs = custom.msgs;
      const newMsgs = {};

      utils.walkObject(msgs, function (messages, validatorName) {
        if (typeof messages === 'object') {
          utils.walkObject(messages, function (message, locale) {
            if (!newMsgs[locale]) newMsgs[locale] = {};
            newMsgs[locale][validatorName] = message;
          });
        } else {

          // A default message will be set as the only one to search.
          if (!newMsgs.defaults) newMsgs.defaults = {};
          newMsgs.defaults[validatorName] = messages;

          // Locale messages will be set to empty.
          locales.forEach(function (locale) {
            if (!newMsgs[locale]) newMsgs[locale] = {};
            newMsgs[locale][validatorName] = null;
          });
        }
      });

      custom.msgs = newMsgs;
    }

    return extend(true, {}, this, custom);
  },

  /**
   * Get a message template according to locale.
   * @private
   * @param  {String} id - Validator identifier.
   * @return {String}
   */
  getMsgTemplate (id) {

    var parts;
    var subid;
    var format;

    if (id.indexOf('.') > 0) {
      parts = id.split('.');
      id = parts[0];
      subid = parts[1];
    }

    // locale with two properties
    if (subid && this.msgs[this.locale][id][subid]) {
      return this.msgs[this.locale][id][subid];
    }
    else if (subid && this.msgs.defaults[id][subid]) {
      return this.msgs.defaults[id][subid];
    }

    // locale with one property
    else if (this.msgs[this.locale][id]) {
      return this.msgs[this.locale][id];
    }
    else if (this.msgs.defaults[id]) {
      return this.msgs.defaults[id];
    }

    // locale general
    else if (this.msgs[this.locale].general) {
      return this.msgs[this.locale].general;
    }

    // default general
    else {
      return this.msgs.defaults.general;
    }
  }
};

module.exports = settings;
