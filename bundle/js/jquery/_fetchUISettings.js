'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');
var $ = require('../jquery');

/**
 * Fetch UI elements settings configured as nodes attributes and properties.
 *
 * @private
 * @param  {external:jQuery} $el - Element on instance.
 * @param  {external:jQuery} $fields - Fields filtered.
 * @return {settings}
 */
var fetchUISettings = function fetchUISettings($el, $fields) {
  'use strict';

  var fetched = {};
  var elTag = $el[0].tagName;

  // Fetch form settings.
  if (elTag === 'FORM') {

    var disabled = ui.getAttr($el, 'disabled');
    var intern = ui.getAttr($el, 'intern') !== void 0;
    var autostart = ui.getAttr($el, 'autostart') !== void 0;
    var novalidate = ui.getAttr($el, 'novalidate') !== void 0;

    if (disabled) fetched.disabled = true;
    if (intern) fetched.intern = true;
    if (autostart) fetched.autostart = true;
    if (novalidate) fetched.disableHTML5Validation = true;

    var locale = ui.getAttr($el, 'locale');
    if (locale) fetched.locale = locale;
  }

  // Fetch fields settings.
  var fields = [];

  fetched.fields = fields;

  $fields.each(function (i, f) {

    var $f = $(f);
    var name = ui.getAttr($f, 'name');
    var type = ui.getAttr($f, 'type');

    var field = { name: name, $el: $f };
    var validators = {};

    var disabled = ui.getAttr($f, 'disabled') !== void 0;
    var required = ui.getAttr($f, 'required') !== void 0;
    var autostart = ui.getAttr($f, 'autostart') !== void 0;
    var intern = ui.getAttr($f, 'intern') !== void 0;

    if (disabled) field.disabled = true;
    if (required) field.required = true;
    if (autostart) field.autostart = true;
    if (intern) field.intern = true;

    var display = ui.getAttr($f, 'display');
    if (display) field.display = display;

    var minlength = ui.getAttr($f, 'minlength');
    var maxlength = ui.getAttr($f, 'maxlength');
    if (minlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.min = +minlength;
    }
    if (maxlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.max = +maxlength;
    }

    var min = ui.getAttr($f, 'min');
    var max = ui.getAttr($f, 'max');
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
    }

    if (type === 'email') validators.isEmail = true;
    if (type === 'url') validators.isURL = true;
    if (type === 'datetime') validators.isDate = true;

    var pattern = ui.getAttr($f, 'pattern');
    var patternMsgs = ui.getAttr($f, 'pattern-msgs');
    if (pattern) {
      pattern = new RegExp(pattern);
      validators.matches = pattern;
      if (patternMsgs) validators.matches = { pattern: pattern, msgs: patternMsgs };
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