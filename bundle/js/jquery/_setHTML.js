'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');
var $ = require('../jquery').jQuery;

/**
 * Set HTML elements and initial classes.
 *
 * @private
 * @param {settings} settings
 */
var setHTML = function setHTML(vv) {
  'use strict';

  var settings = vv.settings;

  if (!settings.intern) {

    // Form.
    if (settings.$form) {
      settings.$form.addClass('vv-form');
      settings.$form.addClass(settings.classes.defaults.form);
    }

    // Fields.
    settings.fields.forEach(function (field) {

      if (!field.$el || field.disabled || field.intern) return;

      var id = field.$el.attr('id');
      if (id) {
        field.$labels = $('label[for=' + id + ']');
        field.$labels.addClass('vv-label');
        field.$labels.addClass(settings.classes.defaults.label);
      }

      field.$el.addClass('vv-field');
      field.$el.addClass(settings.classes.defaults.field);

      if (field.display) {
        field.$display = field.display && $(field.display);
        field.$display.addClass('vv-display');
        field.$display.addClass(settings.classes.defaults.display);
      }
    });
  }
};

module.exports = setHTML;