'use strict';

var extend = window.vulcanval.utils.extend;
var validator = window.vulcanval.validator;
var utils = window.vulcanval.utils;
var log = window.vulcanval.log;
var settings = window.vulcanval.settings;

var ui = require('./_ui');

/**
 * Create final settings from fetched from UI and provided from user.
 *
 * @private
 * @param  {external:jQuery} $el
 * @param  {settings} fetched
 * @param  {settings} custom
 * @return {settings}
 */
var createSettings = function createSettings($el, fetched, custom) {
  'use strict';

  // Merge fields settings. We don't merge fieldset settings because from UI
  // we don't extract fieldsets information.

  custom.fields = utils.mergeCollections('name', fetched.fields, custom.fields);
  delete fetched.fields;

  // All fields have to have an element.
  custom.fields.forEach(function (field) {
    if (!field.$el) {
      log.error('field "' + field.name + '" does not have DOM element');
    }
  });

  extend(true, fetched, custom);
  var newSettings = settings.extend(fetched);

  if ($el[0].tagName === 'FORM') {
    newSettings.$form = $el;
  }

  return newSettings;
};

module.exports = createSettings;