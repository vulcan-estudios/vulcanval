/**
 * @namespace utilityContext
 * @type {Object}
 *
 * @description
 * This is the function context used in some methods/functions in validations
 * processes.
 *
 * Currently is available in custom validators functions, onlyIf gates, fields
 * value methods and this.get().
 */
const utilityContext = {

  /**
   * This is only available on the client side, on server this will be `null`.
   *
   * Reference to the form element used in jQuery plugin instance.
   *
   * @type {external:jQuery}
   * @default null
   */
  $form: null,

  /**
   * This is only available on the client side, on server this will be `null`.
   *
   * Reference to the field used in the specific validation in task.
   *
   * @type {external:jQuery}
   * @default null
   */
  $field: null,

  /**
   * Reference to the {@link https://www.npmjs.com/package/validator validator}
   * package.
   *
   * @type {Object}
   */
  validator: null,

  /**
   * Reference to the settings used in the validation.
   *
   * @type {settings}
   */
  settings: null,

  /**
   * A method used to get another field value in the data {@link map} used in
   * the validation. You need to pass the name of the field as a first parameter
   * and will return its value in the data map.
   *
   * If the {@link map} was nested when used in a validation method, you need to
   * reference it as it were plain, ex: `{ person: { age: 22 } }` will be gotten
   * with `.get('person.age')`.
   *
   * @type {Function}
   */
  get: null
};

module.exports = utilityContext;
