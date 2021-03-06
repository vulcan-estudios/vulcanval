const extend =    window.vulcanval.utils.extend;
const validator = window.vulcanval.validator;
const utils =     window.vulcanval.utils;
const log =       window.vulcanval.log;
const settings =  window.vulcanval.settings;

const ui = require('./_ui');

/**
 * Create final settings from fetched from UI and provided from user.
 *
 * @private
 * @param  {external:jQuery} $el
 * @param  {settings} fetched
 * @param  {settings} custom
 * @return {settings}
 */
const createSettings = function ($el, fetched, custom) {
  'use strict';

  // Merge fields settings. We don't merge fieldset settings because from UI
  // we don't extract fieldsets information.
  custom.fields = utils.mergeCollections('name', fetched.fields, custom.fields);
  delete fetched.fields;

  // All fields have to have an element.
  custom.fields.forEach(field => {
    if (!field.$el) {
      log.error(`field "${field.name}" does not have DOM element`);
    }
  });

  extend(true, fetched, custom);
  const newSettings = settings.extend(fetched);

  if ($el[0].tagName === 'FORM') {
    newSettings.$form = $el;
  }

  return newSettings;
};

module.exports = createSettings;
