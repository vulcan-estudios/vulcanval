'use strict';

var _extend = require('extend');
var utils = require('../utils');

/**
 * @namespace fieldSettings
 * @type {Object}
 *
 * @description
 * The default properties and methods for a field.
 *
 * This is configured in {@link settings.fields} array property.
 *
 * Each field settings can be affected by the main {@link settings} and by the
 * {@link fieldsetSettings}.
 */
var fieldSettings = {

  /**
   * The field name. This property is required.
   *
   * @name name
   * @memberof fieldSettings
   * @type {String}
   */
  name: null,

  /**
   * Field will be ignored in validation if `true`.
   *
   * @name disabled
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * Field is required and cannot be undefined nor empty string. If the field is
   * not required but it does NOT have a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value},
   * then this will pass over all validators.
   *
   * @name required
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //required: null,

  /**
   * *Only client-side.*
   *
   * Validate field elements on instance time.
   *
   * @name autostart
   * @memberof fieldSettings
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
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * *Only client-side.*
   *
   * Ignore field in validation in server side.
   *
   * @name onlyUI
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //onlyUI: null,

  /**
   * *Only client-side.*
   *
   * What event to listen to trigger the first validation on field.
   *
   * @name firstValidationEvent
   * @memberof fieldSettings
   * @type {String}
   * @default Inherited from {@link settings}
   */
  //firstValidationEvent: null,

  /**
   * *Only client-side.*
   *
   * After first validation, what events to listen to re-validate field.
   *
   * @name validationEvents
   * @memberof fieldSettings
   * @type {String}
   * @default Inherited from {@link settings}
   */
  //validationEvents: null,

  /**
   * The validators list. This is an object with keys as the validators names and
   * values as their configuration. If the value is simply a boolean `true`,
   * the validator will be invoked without options. It it is string, number or
   * object it will be send as validator options. If value is `false`, the validator
   * will not be used.
   *
   * These won't be used if the field value is boolean.
   *
   * You can use all validators from the {@link https://www.npmjs.com/package/validator validator}
   * package.
   *
   * This object will be merged with the {@link fieldsetSettings.validators fieldsets validators}
   * this field is in.
   *
   * @name validators
   * @memberof fieldSettings
   * @type {Object}
   */
  validators: null,

  /**
   * *Only client-side.*
   *
   * Field jQuery element.
   *
   * The field node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If the field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If the field is valid. undefined if it's unknown.
   * - {Boolean|String} vv-msg - The error message if field is invalid. false if
   *   field is valid.
   *
   * The field node element triggers an event called `vv-modify` to inform about
   * a change in the field which affects the validation process. This event
   * receives an object parameter describing:
   * - {String} name - Field name.
   * - {*} value - Field value.
   * - {Boolean} valid - Field status.
   * - {Boolean|String} msg - If field is invalid the error, otherwise false.
   *
   * @private
   * @name $el
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $el: null,

  /**
   * *Only client-side.*
   *
   * The element where to set the current field message error. If not specified,
   * the messages won't be shown on UI.
   *
   * When configured by HTML attribute `data-vv-display`, the value expected should
   * be a jQuery selector. Otherwise this can be anything to select with the jQuery
   * selector method.
   *
   * @name display
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  display: null,

  /**
   * *Only client-side.*
   *
   * Display jQuery element.
   *
   * @private
   * @name $display
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $display: null,

  /**
   * *Only client-side.*
   *
   * jQuery `<label>` elements which have `for` attribute to the field element.
   *
   * @private
   * @name $labels
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $labels: null,

  /**
   * *Only client-side.*
   *
   * Field onFirstChange event (this is defined by user).
   *
   * @private
   * @name onFirstChange
   * @memberof fieldSettings
   * @type {Function}
   */
  onFirstChange: null,

  /**
   * *Only client-side.*
   *
   * Field onChange event (this is defined by user).
   *
   * @private
   * @name onChange
   * @memberof fieldSettings
   * @type {Function}
   */
  onChange: null,

  /**
   * *Only client-side.*
   *
   * Field onBlur event.
   *
   * @private
   * @name onBlur
   * @memberof fieldSettings
   * @type {Function}
   */
  onBlur: null,

  /**
   * A condition gate to verify if the field will be validated. Receives
   * the field value as first parameter and has to return a boolean, if `true`
   * the validation will procced as normal, otherwise the validation will halt.
   *
   * This is a function
   * with the {@link utilityContext utility context} as function context so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * @method
   * @name onlyIf
   * @memberof fieldSettings
   * @return {Boolean}
   */
  onlyIf: null,

  /**
   * *Only client-side.*
   *
   * Method to get the value of the field. This will have the {@link utilityContext utilty context}
   * so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * By default this can retrieve the value of `<input>`s of any kind except
   * `image`, `submit`, `reset`, `file` and `button`, `<textarea>`s and `<select>`s.
   *
   * You can overwrite this to create your own custom field value getter. Otherwise
   * leave this property as default.
   *
   * The first paramter `$field` will be binded to the function and it is the
   * jQuery element the fields belongs to.
   *
   * @method
   * @name value
   * @memberof fieldSettings
   * @param  {external:jQuery} $field - The field element.
   * @return {*} The value returned will depend on the type of element or what you
   * configure if you overwrite this method.
   */
  value: function value($field) {

    // @FIXIT: Make the space trimmer works with an option.

    var type, name, val;

    if (!$field) {
      return;
    } else if ($field[0].tagName === 'INPUT') {

      type = String($field.attr('type')).toUpperCase();
      name = $field.attr('name') || $field.data('vv-name');

      if (type === 'CHECKBOX') {
        return $field.prop('checked');
      }
      if (type === 'RADIO') {
        return $field.parents('form, body').first().find('input[type="radio"][name="' + name + '"]:checked').val() || '';
      } else if (type !== 'BUTTON' && type !== 'SUBMIT' && type !== 'RESET') {
        return utils.trimSpaces($field.val());
      }
    } else if ($field[0].tagName === 'TEXTAREA' || $field[0].tagName === 'SELECT') {
      return utils.trimSpaces($field.val());
    }
  },


  /**
   * Extend field settings default configuration.
   *
   * @private
   * @name extend
   * @memberof fieldSettings
   * @param  {Object} custom
   * @return {Object}
   */
  extend: function extend(custom) {
    return _extend(Object.create(fieldSettings), custom);
  }
};

module.exports = fieldSettings;