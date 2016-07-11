const utils = window.vulcanval.utils;
const log = window.vulcanval.log;

const inspectFieldset = function (fieldsetName) {
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

  const errors = {};

  let field;
  fieldset.fields.forEach(function (fieldName) {
    const invalid = vv.rawValidation(fieldName);
    if (invalid) errors[fieldName] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspectFieldset;
