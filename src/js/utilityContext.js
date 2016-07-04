/**
 * @namespace utilityContext
 * @type {Object}
 *
 * @description
 * This is the function context used in some methods/functions in validations
 * processes.
 */
const utilityContext = {

  /**
   * Reference to the {@link https://www.npmjs.com/package/validator validator}
   * package.
   *
   * @type {Object}
   */
  validator: null,

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
