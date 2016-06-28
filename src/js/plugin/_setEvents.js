const validator = require('validator');
const utils = require('../utils');
const ui = require('./_ui');
const change = require('./_change');

const trigger = ($e, ev) => {
  if (ev.replace(/\s/g, '').length) $e.trigger(ev);
};

const setEvents = function (settings) {

  // Create an utility context. This will be used in all methods using the
  // '../utilityContext.js' format.
  settings.context = {
    $form: settings.$form,
    settings,
    validator
  };
  const get = (function (getFieldName) {
    const getField = utils.find(settings.fields, f => f.name === getFieldName);
    if (getField) {
      return getField.value && getField.value();
    }
  }).bind(settings.context);
  settings.context.get = get;

  // Form.
  if (settings.$form) {

    settings.onSubmit = function (e) {
      if (settings.$form.data('vv-valid') !== true) {
        e.preventDefault();
        settings.$form.vulcanval('validate');
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

    if (field.disabled) return;

    const firstEvent = (field.firstValidationEvent || settings.firstValidationEvent) +' vv-change';
    const normalEvent = (field.validationEvents || settings.validationEvents) +' vv-change';
    const initial = typeof field.$el.val() === 'string' && field.$el.val().length;

    // Shortcut to the field value.
    const context = Object.create(settings.context);
    context.$field = field.$el;
    field.value = field.value && field.value.bind(context, field.$el);

    field.onChange = function (e) {
      change(settings, field, e);
    };

    field.onFirstChange = function (e) {
      field.$el.off(firstEvent, field.onFirstChange);
      field.$el.on(normalEvent, field.onChange);
      trigger(field.$el, 'vv-change');
    };

    field.$el.on(firstEvent, field.onFirstChange);

    if (initial || field.autostart || settings.autostart) {
      trigger(field.$el, 'vv-change');
    }
  });
};

module.exports = setEvents;
