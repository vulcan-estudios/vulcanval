'use strict';

var validator = window.vulcanval.validator;
var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');
var change = require('./_change');

/**
 * Set elements validation events.
 *
 * @private
 * @param {settings} settings
 */
var setEvents = function setEvents(vv) {
  'use strict';

  var settings = vv.settings;

  // Form.
  if (settings.$form) {

    settings.onSubmit = function (e) {
      settings.$form.vulcanval('validate');
      if (settings.$form.data('vv-valid') !== true) {
        e.preventDefault();
        return false;
      }
    };
    settings.$form.on('submit', settings.onSubmit);

    settings.onReset = function (e) {
      settings.$form.vulcanval('reset');
    };
    settings.$form.on('reset', settings.onReset);
  }

  // Fields.
  settings.fields.forEach(function (field) {

    if (!field.$el || field.disabled) return;

    var isNormalTextField = !!field.$el.filter('input[type!=checkbox][type!=radio][type!=password], textarea').length;
    var couldBeInitialized = !!field.$el.filter('input[type!=checkbox][type!=radio], textarea, select').length;
    var initial = couldBeInitialized && typeof field.$el.val() === 'string' && field.$el.val().length;
    var firstEvent = field.firstValidationEvent + ' vv-change';
    var normalEvent = field.validationEvents + ' vv-change';

    field.onChange = function (ev) {
      change(vv, field, ev);
    };

    field.onFirstChange = function (e) {
      field.$el.off(firstEvent, field.onFirstChange);
      field.$el.on(normalEvent, field.onChange);
      field.$el.trigger('vv-change');
    };

    // @FIXIT: Make this run with an option.
    field.onBlur = function (e) {
      if (isNormalTextField) {
        field.$el.val(utils.trimSpaces(field.$el.val()));
      }
    };

    field.$el.on('blur', field.onBlur);
    field.$el.on(firstEvent, field.onFirstChange);

    if (initial || field.autostart) {
      field.$el.trigger('vv-change');
    }
  });
};

module.exports = setEvents;