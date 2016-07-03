const validator = require('validator');
const settings = require('../settings');
const utils = require('../utils');
const log = require('../log');
const fieldSettings = require('../fieldSettings');
const ui = require('./_ui');

/**
 * Create final settings from fetched from UI and provided from user.
 *
 * @param  {external:jQuery} $el
 * @param  {settings} fetched
 * @param  {settings} custom
 * @return {settings}
 */
const createSettings = function ($el, fetched, custom) {
  'use strict';

  // Extend every specific field settings.
  const fetchedFields = fetched.fields || [];
  delete fetched.fields;

  const customFields = custom.fields || [];
  delete custom.fields;

  const newFields = [];

  customFields.forEach(customField => {
    const fetchedField = utils.find(fetchedFields, field => field.name === customField.name);

    if (fetchedField) {
      $.extend(true, fetchedField, customField);
      newFields.push(fieldSettings.extend(fetchedField));
    } else {
      newFields.push(fieldSettings.extend(customField));
    }
  });

  fetchedFields.forEach(fetchedField => {
    if (!utils.find(newFields, nf => nf.name === fetchedField.name)) {
      newFields.push(fieldSettings.extend(fetchedField));
    }
  });

  // Extend base settings with fetched and custom settings.
  let newSettings = settings.extend(fetched);
  newSettings = newSettings.extend(custom);

  newSettings.fields = newFields;

  if ($el[0].tagName === 'FORM') {
    newSettings.$form = $el;
  }

  // Create an utility context. This will be used in all methods using the
  // '../utilityContext.js' function context.
  newSettings.context = {
    validator,
    get (getFieldName) {
      const getField = utils.find(newSettings.fields, f => f.name === getFieldName);
      if (getField) {
        return getField.value && getField.value();
      } else {
        log.warn(`field "${getFieldName}" not found`);
      }
    }
  };

  return newSettings;
};

module.exports = createSettings;
