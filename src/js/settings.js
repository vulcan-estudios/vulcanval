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
  validators: {},

  /**
   * Default messages locale.
   * @type {String}
   */
  locale: 'en',

  /**
   * Validators messages.
   * @type {Object}
   */
  msgs: {},

  /**
   * The form fields to configure.
   * @type {Array}
   */
  fields: []
};

module.exports = settings;
