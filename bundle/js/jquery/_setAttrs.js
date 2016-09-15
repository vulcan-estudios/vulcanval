'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * Set HTML elements attributes according to final settings.
 *
 * @private
 * @param {settings} settings
 */
var setAttrs = function setAttrs(vv) {
  'use strict';

  var settings = vv.settings;

  if (settings.$form) {

    settings.$form.data('vv', vv);
    settings.$form.data('vv-settings', settings);

    if (settings.disabled) settings.$form.attr('disabled', 'disabled');
    if (settings.disableHTML5Validation) settings.$form.attr('novalidate', 'novalidate');
  }

  settings.fields.forEach(function (field) {

    if (!field.$el) return;

    field.$el.data('vv', vv);
    field.$el.data('vv-settings', settings);

    if (field.disabled) field.$el.attr('disabled', 'disabled');
    if (field.required) field.$el.prop('required', true);

    if (field.validators) {
      utils.walkObject(field.validators, function (val, valName) {
        switch (valName) {
          case 'isLength':
            if (val.min) field.$el.attr('minlength', val.min);
            if (val.max) field.$el.attr('maxlength', val.max);
            break;

          // Modifiers/flags in RegExp are not supported in HTML input pattern attr.
          case 'matches':
            var pattern = val instanceof RegExp ? val : val.pattern;
            field.$el.attr('pattern', pattern.toString().replace(/^\//, '').replace(/\/.{0,3}$/, ''));
            break;
          case 'isFloat':
          case 'isInt':
            if (val.min) field.$el.attr('min', val.min);
            if (val.max) field.$el.attr('max', val.max);
            break;
        }
      });
    }
  });
};

module.exports = setAttrs;