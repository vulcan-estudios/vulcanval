const extend = require('extend');
const utils = require('./utils');

const settings = {

  /**
   * What event to listen to trigger the first validation on fields.
   * @type {String}
   */
  firstValidationEvent: 'change',

  /**
   * After first validation, what events to listen to re-validate fields.
   * @type {String}
   */
  validationEvents: 'change input blur',

  /**
   * Auto start validation at instance time.
   * @type {Boolean}
   */
  autostart: false,

  /**
   * Don't validate form/fieldsets/fields. This can be used to ignore validations
   * but map a form field values into an object.
   * @type {Boolean}
   */
  silent: false,

  /**
   * Validate form/fieldsets/fields but don't modify UI. Ex: don't show error
   * messages.
   * @type {Boolean}
   */
  intern: false,

  /**
   * HTML tag classes to add to specific elements in form on error.
   * @type {Object}
   */
  classes: {
    error: {
      label: '',
      input: '',
      display: ''
    }
  },

  /**
   * Enable asynchronous validations.
   * @type {Boolean}
   */
  async: false,

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

    if (subid && this.msgs[this.locale][id][subid]) {
      return this.msgs[this.locale][id][subid];
    }
    else if (subid && this.msgs.defaults[id][subid]) {
      return this.msgs.defaults[id][subid];
    }
    else if (this.msgs[this.locale][id]) {
      return this.msgs[this.locale][id];
    }
    else if (this.msgs.defaults[id]) {
      return this.msgs.defaults[id];
    }
    else if (this.msgs[this.locale].general) {
      return this.msgs[this.locale].general;
    }
    else {
      return this.msgs.defaults.general;
    }
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
  }
};

module.exports = settings;
