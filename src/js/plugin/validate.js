const log = require('../log');
const utils = require('../utils');

/**
 * Validate visually complete `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `'validate'`.
 * @param  {String} [fieldName] - Only limite validation to the field.
 * @return {external:jQuery} The same jQuery object.
 */
const validate = function (fieldName) {
  'use strict';

  const settings = this.data('vv-settings');

  if (fieldName) {
    const field = utils.find(settings.fields, f => f.name === fieldName);
    if (!field) log.error(`field "${fieldName}" not found`);
    field.$el.trigger('vv-change');
    field.$el.trigger('focus');
  } else {

    let invalid;
    let first = true;

    settings.fields.forEach(function (field) {

      invalid = field.$el.vulcanval('inspect', field.name);

      if (invalid) {
        field.$el.trigger('vv-change');
        if (first) {
          first = false;
          field.$el.trigger('focus');
        }
      }
    });
  }

  return this;
};

module.exports = validate;
