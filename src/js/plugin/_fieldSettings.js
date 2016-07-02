const extend = require('extend');

/**
 * @namespace fieldSettings
 * @type {Object}
 *
 * @description
 * The default properties and methods for a field in vulcanval {@link settings.fields}
 * configuration.
 */
const fieldSettings = {

  /**
   * The field name. This property is always required.
   *
   * @type {String}
   */
  name: null,

  /**
   * Field will be ignored in validation if `true`.
   *
   * @type {Boolean}
   * @default false
   */
  disabled: false,

  /**
   * Field is required and cannot be undefined. If the field is not required but
   * it has a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value},
   * then this will pass over all validators.
   *
   * @type {Boolean}
   * @default false
   */
  required: false,

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
   * @type {Object}
   */
  validators: null,

  /**
   * Only client-side.
   *
   * What event to listen to trigger the first validation on field.
   *
   * @type {String}
   * @default Inherited from {@link settings}
   */
  firstValidationEvent: null,

  /**
   * Only client-side.
   *
   * After first validation, what events to listen to re-validate field.
   *
   * @type {String}
   * @default Inherited from {@link settings}
   */
  validationEvents: null,

  /**
   * Only client-side.
   *
   * Validate field elements on instance time.
   *
   * @type {Boolean}
   * @default false
   */
  autostart: false,

  /**
   * Only client-side.
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * If the field is an `<input>` type `hidden`, this will be set as `true`.
   *
   * @type {Boolean}
   * @default false
   */
  intern: false,

  /**
   * Ignore field when extracting the data {@link map} from the form.
   *
   * @type {Boolean}
   * @default false
   */
  ignoreInMap: false,

  /**
   * Only client-side.
   *
   * The element where to set the current field message error. If not specified,
   * the messages won't be shown on UI. This is a jQuery selector.
   *
   * @type {external:jQuery}
   */
  display: null,

  /**
   * Only client-side.
   *
   * Display jQuery element.
   *
   * @private
   * @type {external:jQuery}
   */
  $display: null,

  /**
   * Only client-side.
   *
   * jQuery `<label>` elements which have `for` attribute to the field element.
   *
   * @private
   * @type {external:jQuery}
   */
  $labels: null,

  /**
   * Only client-side.
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
   * @type {external:jQuery}
   */
  $el: null,

  /**
   * Only client-side.
   *
   * Field onFirstChange event.
   *
   * @private
   * @type {Function}
   */
  onFirstChange: null,

  /**
   * Only client-side.
   *
   * Field onChange event.
   *
   * @private
   * @type {Function}
   */
  onChange: null,

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
   * @return {Boolean}
   */
  onlyIf: null,

  /**
   * Only client-side.
   *
   * Method to get the value of the field. This will have the {@link utilityContext utilty context}
   * so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * By default this can retrieve the value of `<input>`s of any kind except `submit`
   * and `button`, `<textarea>`s and `<select>`s.
   *
   * You can overwrite this to create your own custom field value getter.
   *
   * @param  {external:jQuery} $field - The field element.
   * @return {*} The value returned will depend on the type of element.
   */
  value ($field) {

    // By default this should only use in its context the $form and the $field
    // values.

    var type, name;

    if ($field[0].tagName === 'INPUT') {

      type = String($field.attr('type')).toUpperCase();
      name = $field.attr('name') || $field.data('vv-name');

      if (type === 'CHECKBOX') {
        return $field.prop('checked');
      }
      if (type === 'RADIO') {
        return this.$form.find(`input[type="radio"][name="${name}"]:checked`).val();
      }
      else if (type !== 'BUTTON' && type !== 'SUBMIT') {
        return $field.val();
      }
    }

    else if ($field[0].tagName === 'TEXTAREA' || $field[0].tagName === 'SELECT') {
      return $field.val();
    }
  },

  /**
   * Extend field settings default configuration.
   *
   * @private
   * @param  {Object} custom
   * @return {Object}
   */
  extend (custom) {
    return extend(true, {}, this, custom);
  }
};

module.exports = fieldSettings;
