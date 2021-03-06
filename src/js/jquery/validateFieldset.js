const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields of an specific fieldset in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateFieldset - With value `'validateFieldset'`.
 * @param  {String} fieldsetName - The fieldset name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
const validateFieldset = function (fieldsetName) {
  'use strict';

  const vv = this.data('vv');
  const settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  const fieldset = utils.find(settings.fieldsets, fs => fs.name === fieldsetName);

  if (!fieldset) {
    log.error(`fieldset "${fieldsetName}" was not found`);
  }

  let field;
  let invalid;
  let first = true;

  fieldset.fields.forEach(function (fieldName) {

    field = utils.find(settings.fields, f => f.name === fieldName);

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(fieldName);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validateFieldset;
