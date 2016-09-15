'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually an specific field in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateField - With value `'validateField'`.
 * @param  {String} fieldName - The field name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
var validateField = function validateField(fieldName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  var field = utils.find(settings.fields, function (f) {
    return f.name === fieldName;
  });

  if (!field) {
    log.error('field "' + fieldName + '" was not found');
  }

  field.$el.trigger('vv-change');

  field.$el.trigger('focus');

  return this;
};

module.exports = validateField;