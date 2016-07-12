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
 *
 * Important: one field can be affected by more than one fieldset so if you set
 * two fieldsets that match the same field, it will have the configuration of both
 * of them, being priority the last one.
 */
const fieldsetSettings = {

  /**
   * Fieldset name. This will be used to identify this fieldset and it is required.
   *
   * @name name
   * @memberof fieldsetSettings
   * @type {String}
   */
  name: null,

  /**
   * The fields this fieldset covers. This is required.
   *
   * This can be a RegExp to match against the fields names, a string that is
   * the starting string of fields names or an array with the names of the fields.
   *
   * @name fields
   * @memberof fieldsetSettings
   * @type {RegExp|String|Array}
   */
  fields: null,

  /**
   * Default {@link fieldSettings.disabled} value in fieldset.
   *
   * @name disabled
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * Default {@link fieldSettings.required} value in fieldset.
   *
   * @name required
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //required: null,

  /**
   * Default {@link fieldSettings.autostart} value in fieldset.
   *
   * @name autostart
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //autostart: null,

  /**
   * Default {@link fieldSettings.intern} value in fieldset.
   *
   * @name intern
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * Default {@link fieldSettings.onlyUI} value in fieldset.
   *
   * @name onlyUI
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //onlyUI: null,

  /**
   * Default {@link fieldSettings.firstValidationEvent} value in fieldset.
   *
   * @name firstValidationEvent
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //firstValidationEvent: null,

  /**
   * Default {@link fieldSettings.validationEvents} value in fieldset.
   *
   * @name validationEvents
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //validationEvents: null,

  /**
   * Extends {@link fieldSettings.validators} value in fieldset so all fields
   * that this fieldset covers will extend their validators with this object.
   *
   * @name validators
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  validators: null,

  /**
   * Middleware {@link fieldSettings.onlyIf} value in fieldset. This function
   * will be used in the fields to determine if they will be validated or not.
   *
   * @name onlyIf
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  onlyIf: null,

  /**
   * Extend fieldset settings default configuration.
   *
   * @private
   * @name extend
   * @memberof fieldsetSettings
   * @param  {Object} custom
   * @return {Object}
   */
  extend (custom) {
    return extend(Object.create(fieldsetSettings), custom);
  }
};

module.exports = fieldsetSettings;
