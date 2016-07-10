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
const setEvents = function (vv) {
  'use strict';

  const settings = vv.settings;

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

    const isNormalTextField = !!field.$el.filter('input[type!=checkbox][type!=radio][type!=password], textarea').length;
    const couldBeInitialized = !!field.$el.filter('input[type!=checkbox][type!=radio], textarea, select').length;
    const initial = couldBeInitialized && typeof field.$el.val() === 'string' && field.$el.val().length;
    const firstEvent = field.firstValidationEvent +' vv-change';
    const normalEvent = field.validationEvents +' vv-change';

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
