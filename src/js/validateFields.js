const utils = require('./utils');

/**
 * Validate the fields provided and their affected fields set by their `listenTo`
 * properties.
 *
 * This method is not available for the jQuery plugin currently.
 *
 * @static
 * @method validator.validateFields
 *
 * @param  {String|Array} namesList - An array with the names of the fields to validate
 * or just one field name.
 * @param  {Object} map - The map to validate.
 *
 * @return {Boolean|Object} - If the fields are valid, returns false.
 * Otherwise there will be an object describing each field error as a plain map with its
 * keys as the fields names even if the property {@link settings.enableNestedMaps}
 * is enabled. Use the {@link vulcanval.convertMapTo} method if needed.
 *
 * @example
 * const vv = vulcanval({
 *   fields: [
 *     { name: 'married', required: true },
 *     { name: 'height', required: true },
 *     { name: 'age', required: true, listenTo: 'height' },
 *     { name: 'weight', required: true, listenTo: ['height', 'age'] }
 *   ]
 * });
 * const map = { married: false, height: '', age: '23', weight: '' };
 *
 * console.log(vv.validateFields('height', map));
 * // { height: 'Err message.', age: false, weight: 'Err message' }
 * // Height is validated and age and weight which are listening.
 *
 * console.log(vv.validateFields(['married', 'age'], map));
 * // { married: 'Err message', age: false, weight: 'Err message' }
 * // Married and age are validated and weight which is listening.
 */
module.exports = function (namesList, map) {

  const errors = {};
  const names = Array.isArray(namesList) ? namesList : [namesList];

  // Extra validation is performed by the validateField() method.
  const setMessage = (name) => {
    const message = this.validateField(name, map);
    errors[name] = message;
  };

  // Validate fields recursively.
  const validate = (name) => {
    setMessage(name);

    this.settings.fields.forEach(field => {

      let listenTo = field.listenTo || [];
      listenTo = Array.isArray(listenTo) ? listenTo : [listenTo];
      const isListener = utils.find(listenTo, el => el === name);
      const wasValidated = errors.hasOwnProperty(field.name);

      if (isListener && !wasValidated) {
        validate(field.name);
      }
    });
  };

  names.forEach(validate);

  return Object.keys(errors).length ? errors : false;
};
