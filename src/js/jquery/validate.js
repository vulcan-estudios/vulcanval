const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `'validate'`.
 * @return {external:jQuery} The same jQuery object.
 */
const validate = function () {
  'use strict';

  const vv = this.data('vv');
  const settings = vv.settings;

  let invalid;
  let first = true;

  settings.fields.forEach(field => {

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(field.name);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validate;
