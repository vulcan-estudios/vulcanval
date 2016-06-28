const ui = require('./_ui');

const fetchUISettings = function ($el, $fields) {
  'use strict';

  const fetched = {};
  const elTag = $el[0].tagName;

  // Fetch form settings.
  if (elTag === 'FORM') {

    const disabled = ui.getAttr($el, 'disabled');
    const intern = ui.getAttr($el, 'intern') !== void 0;
    const autostart = ui.getAttr($el, 'autostart') !== void 0;
    const novalidate = ui.getAttr($el, 'novalidate') !== void 0;

    if (disabled) fetched.disabled = true;
    if (intern) fetched.intern = true;
    if (autostart) fetched.autostart = true;
    if (novalidate) fetched.disableHTML5Validation = true;

    const locale = ui.getAttr($el, 'locale');
    if (locale) fetched.locale = locale;
  }

  // Fetch fields settings.
  const fields = [];

  fetched.fields = fields;

  $fields.each(function (i, f) {

    const $f = $(f);
    const name = ui.getAttr($f, 'name');
    const type = ui.getAttr($f, 'type');

    const field = { name, $el: $f };
    const validators = {};

    const disabled = ui.getAttr($f, 'disabled');
    const required = ui.getAttr($f, 'required') !== void 0;
    const autostart = ui.getAttr($f, 'autostart') !== void 0;
    const intern = ui.getAttr($f, 'intern') !== void 0;

    if (disabled) field.disabled = true;
    if (required) field.required = true;
    if (autostart) field.autostart = true;
    if (intern) field.intern = true;

    const display = ui.getAttr($f, 'display');
    if (display) field.display = display;

    const minlength = ui.getAttr($f, 'minlength');
    const maxlength = ui.getAttr($f, 'maxlength');
    if (minlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.min = +minlength;
    }
    if (maxlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.max = +maxlength;
    }

    const min = ui.getAttr($f, 'min');
    const max = ui.getAttr($f, 'max');
    if (type === 'number') {
      validators.isFloat = true;
      if (min) {
        if (validators.isFloat === true) validators.isFloat = {};
        validators.isFloat.min = +min;
      }
      if (max) {
        if (validators.isFloat === true) validators.isFloat = {};
        validators.isFloat.max = +max;
      }
      validators.isFloat = isFloat;
    }

    if (type === 'email') validators.isEmail = true;
    if (type === 'url') validators.isURL = true;
    if (type === 'datetime') validators.isDate = true;

    const pattern = ui.getAttr($f, 'pattern');
    const patternMsgs = ui.getAttr($f, 'pattern-msgs');
    if (pattern) {
      validators.matches = pattern;
      if (patternMsgs) validators.matches = { pattern, msgs: patternMsgs };
    }

    if (Object.keys(validators).length) {
      field.validators = validators;
    }
    if (Object.keys(field).length > 1 || Object.keys(validators).length) {
      fields.push(field);
    }
  });

  return fetched;
};

module.exports = fetchUISettings;
