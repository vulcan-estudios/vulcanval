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
   * A condition gate to verify if the field will be validated. Receives
   * the field value as first parameter and has to return a boolean, if `true`
   * the validation will procced as normal, otherwise the validation will halt.
   *
   * This is a function
   * with the {@link utilityContext utility context} as function context so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * @type {Function}
   * @default null
   */
  onlyIf: null,

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
   * @default null
   */
  validators: null,

  /**
   * Only client-side.
   *
   * What event to listen to trigger the first validation on field.
   *
   * @type {String}
   * @default 'blur change'
   */
  firstValidationEvent: 'blur change',

  /**
   * Only client-side.
   *
   * After first validation, what events to listen to re-validate field.
   *
   * @type {String}
   * @default 'input blur change'
   */
  validationEvents: 'input blur change',

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
   * Only client-side.
   *
   * The element where to set the current field message error. If not specified,
   * the messages won't be shown on UI.
   *
   * @type {external:jQuery}
   * @default null
   */
  display: null,

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
  }
};

module.exports = fieldSettings;
