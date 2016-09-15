"use strict";

/**
 * @name isEqualToField
 * @memberof settings.validators
 * @function
 *
 * @description
 * This field value has to be the same as another field the form. The name of
 * the comparing field should be set as a string parameter.
 */
module.exports = function isEqualToField(value, field) {
  return value === this.get(field);
};