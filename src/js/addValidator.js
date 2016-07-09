const settings = require('./settings');

/**
 * Add a custom validator.
 *
 * All validators in the package {@link https://www.npmjs.com/package/validator validator}
 * are installed and ready to use.
 *
 * @memberof module:vulcanval
 *
 * @param {String} name - An alphanumeric validator name.
 * @param {Function} validator - The validator function. Receives as a first parameter
 * the value of the field and has to return a
 * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value}.
 * This function will have the {@link utilityContext utility context} as
 * function context. Don't pass
 * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}
 * or it won't be available.
 *
 * @example
 * vulcanval.addValidator('isGreat', function (value) {
 *   return value.length > 4 && value.indexOf('great') >= 0;
 * });
 *
 * const map = {
 *   field0: 'normal value'
 * };
 *
 * const settings = {
 *   msgs: {
 *     isGreat: 'This field needs to be great!'
 *   },
 *   fields: [{
 *     name: 'field0',
 *     validators: {
 *       isGreat: true
 *     }
 *   }]
 * };
 *
 * const field0Valid = vulcanval.validateField('field0', map, settings);
 * console.log(field0Valid); // 'This field needs to be great!'
 *
 * @see In the example is used the {@link module:vulcanval.validateField vulcanval.validateField}
 * static method to test the new validator.
 */
module.exports = function addValidator (name, validator) {
  settings.validators[name] = validator;
};
