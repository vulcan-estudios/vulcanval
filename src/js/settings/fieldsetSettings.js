const extend = require('extend');
const utils = require('../utils');

/**
 * @namespace fieldsetSettings
 * @type {Object}
 *
 * @description
 * These properties and methods will affect the fields settings.
 *
 * This is configured in {@link settings.fieldsets} array property.
 */
const fieldsetSettings = {

  /**
   * Fieldset name. This will be used to identify this fieldset.
   *
   * @type {String}
   */
  name: null,

  /**
   * The fields this fieldset covers.
   *
   * This can be a RegExp to match against the fields names, a string that is
   * the starting string of fields names or an array with the names of the fields.
   *
   * @type {RegExp|String|Array}
   * @default null
   */
  fields: null,

  /**
   * Default {@link fieldSettings.disabled} value in fieldset.
   */
  disabled: null,

  /**
   * Default {@link fieldSettings.required} value in fieldset.
   */
  required: null,

  /**
   * Default {@link fieldSettings.autostart} value in fieldset.
   */
  autostart: null,

  /**
   * Default {@link fieldSettings.intern} value in fieldset.
   */
  intern: null,

  /**
   * Default {@link fieldSettings.onlyUI} value in fieldset.
   */
  onlyUI: null,

  /**
   * Default {@link fieldSettings.firstValidationEvent} value in fieldset.
   */
  firstValidationEvent: null,

  /**
   * Default {@link fieldSettings.validationEvents} value in fieldset.
   */
  validationEvents: null,

  /**
   * Extends {@link fieldSettings.validators} value in fieldset.
   */
  validators: null,

  /**
   * Middleware {@link fieldSettings.onlyIf} value in fieldset.
   */
  onlyIf: null,

  /**
   * Extend fieldset settings default configuration.
   *
   * @private
   * @param  {Object} custom
   * @return {Object}
   */
  extend (custom) {
    return extend(Object.create(fieldsetSettings), custom);
  }
};

module.exports = fieldsetSettings;
