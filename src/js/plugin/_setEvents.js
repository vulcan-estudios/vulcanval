const validator = require('validator');
const utils = require('../utils');
const ui = require('./_ui');
const change = require('./_change');

/**
 * Set elements validation events.
 *
 * @private
 * @param {settings} settings
 */
const setEvents = function (settings) {
  'use strict';

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

    const isTextField = !!field.$el.filter('input[type!=checkbox][type!=radio], textarea').length;
    const firstEvent = (field.firstValidationEvent || settings.firstValidationEvent) +' vv-change';
    const normalEvent = (field.validationEvents || settings.validationEvents) +' vv-change';
    const initial = isTextField && typeof field.$el.val() === 'string' && field.$el.val().length;

    field.onChange = function (ev) {
      change(settings, field, ev);
    };

    field.onFirstChange = function (e) {
      field.$el.off(firstEvent, field.onFirstChange);
      field.$el.on(normalEvent, field.onChange);
      field.$el.trigger('vv-change');
    };

    // @FIXIT: Make this run with an option.
    field.onBlur = function (e) {
      if (isTextField) {
        field.$el.val(utils.trimSpaces(field.$el.val()));
      }
    };

    field.$el.on('blur', field.onBlur);
    field.$el.on(firstEvent, field.onFirstChange);

    if (initial || field.autostart || settings.autostart) {
      field.$el.trigger('vv-change');
    }
  });
};

module.exports = setEvents;
