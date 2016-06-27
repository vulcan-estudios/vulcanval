// @TODO:
// - validate and set the target
//  - form
//  - input-like
//  - parameter
// - fetch all fields
// - get HTML fields validators
// - extend settings from base, HTML and JS
// - set initial states
// - set events and detect changes according to DOM
//  - execute validation proccesses
//  - reflect them in UI and states
//  - propagate custom events
// - initialize starting methods

const validator =     require('validator');
const log =           require('../log');
const utils =         require('../utils');
const settings =      require('../settings');
const fieldSettings = require('./fieldSettings');
const inspect =       require('./inspect');
const validate =      require('./validate');
const getMap =        require('./getMap');
const forceValid =    require('./forceValid');
const forceInvalid =  require('./forceInvalid');
const change =        require('./change');
const reset =         require('./reset');

const methods = { inspect, validate, getMap, forceValid, forceInvalid, change, reset };

/**
 * @summary jQuery plugin to set the validators in forms.
 *
 * @description
 * Defines validation functionalities over form elements.
 *
 * This can be instantiated on any form element with a valid attribute `name`,
 * except the `<form>`:
 *
 * - `<form>`
 * - `<input>` with `type` different than `submit` and `button`
 * - `<textarea>`
 * - `<select>`
 *
 * Also, the plugin can be instantiated on any element with a valid input name in
 * attribute `data-vv-name` which will be treated as a normal `<input>`. This is
 * useful to create custom fields/entries.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {settings} settings - Instance settings. This is used to configure the
 * whole validation process.
 * @return {external:jQuery} The same jQuery object.
 *
 * @TODO Add event on form submit to block if invalid form and enable in async mode.
 */
module.exports = function (custom) {
  'use strict';

  const $el = this.first();

  if (!this.length) {
    return log.error('no elements found');
  }

  if (typeof custom === 'string') {
    if (methods[custom]) {
      const args = Array.prototype.slice.call(arguments, 1);
      return methods[custom].apply($el, args);
    } else {
      throw new Error(`jQuery vulcanval method unrecognized "${custom}".`);
    }
  }

  if ($el.data('vv-settings')) {
    return $el;
  }

  custom = custom ? custom : {};

  let $fields;

  const getAttr = (el, attr) => {
    return $(el).attr(attr) !== void 0 ? $(el).attr(attr) : $(el).data(`vv-${attr}`);
  };
  const getProp = (el, prop) => {
    const value1 = $(el).prop(prop);
    const value2 = $(el).data(`vv-${prop}`);
    return typeof value1 === 'boolean' || typeof value1 === 'string' ? true :
      value2 !== void 0 ? value2 : void 0;
  };


  //
  // VALIDATE ELEMENTS
  //
  const elTag = $el[0].tagName;
  const filter = ($toFilter) => {
    return $toFilter.filter('input[name][type!=button][type!=submit][type!=reset], select[name], textarea[name], [data-vv-name]');
  };

  if (elTag === 'FORM') {
    $fields = filter($el.find('input, select, textarea, [data-vv-name]'));
  } else {
    $fields = filter($el);
  }

  if (!$fields.length) {
    log.error('only <form>; <input>, <textarea> and <select> with valid attr "name"; and elements with valid attr "data-vv-name"');
  }

  $fields.each(function (i, field) {
    const name = getAttr(field, 'name');
    if (!utils.validateFieldName(name)) {
      log.error(`the field with attribute name "${name}" is invalid`);
    }
  });


// DEBUG:
console.log('html fields gathered', $fields);


  //
  // FETCH FORM CONFIGS
  //
  let customSettings = {};

  if (elTag === 'FORM') {

    const disabled = getProp($el, 'disabled');
    const intern = getAttr($el, 'intern') !== void 0;
    const autostart = getAttr($el, 'autostart') !== void 0;
    const novalidate = getAttr($el, 'novalidate') !== void 0;

    if (disabled) customSettings.disabled = true;
    if (intern) customSettings.intern = true;
    if (autostart) customSettings.autostart = true;
    if (novalidate) customSettings.disableHTML5Validation = true;

    const locale = getAttr($el, 'locale');
    if (locale) customSettings.locale = locale;
  }


// DEBUG:
console.log('html parsed settings', JSON.parse(JSON.stringify(customSettings)));


  //
  // FETCH FIELDS CONFIGS
  //
  const fields = [];

  $fields.each(function (i, f) {

    const $f = $(f);
    const name = getAttr($f, 'name');
    const type = getAttr($f, 'type');

    const field = { name, $el: $f };
    const validators = {};

    const disabled = getAttr($f, 'disabled');
    const required = getAttr($f, 'required') !== void 0;
    const autostart = getAttr($f, 'autostart') !== void 0;
    const intern = getAttr($f, 'intern') !== void 0;

    if (disabled) field.disabled = true;
    if (required) field.required = true;
    if (autostart) field.autostart = true;
    if (intern) field.intern = true;

    const display = getAttr($f, 'display');
    if (display) field.display = display;

    const minlength = getAttr($f, 'minlength');
    const maxlength = getAttr($f, 'maxlength');
    if (minlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.min = +minlength;
    }
    if (maxlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.max = +maxlength;
    }

    const min = getAttr($f, 'min');
    const max = getAttr($f, 'max');
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

    const pattern = getAttr($f, 'pattern');
    const patternMsgs = getAttr($f, 'pattern-msgs');
    if (pattern) {
      validators.matches = pattern;
      if (patternMsgs) validators.matches = { pattern, msgs: patternMsgs };
    }

    if (Object.keys(validators).length) {
      field.validators = validators;
    }
    if (Object.keys(field).length > 1 || Object.keys(validators).length) {
      fields.push(fieldSettings.extend(field));
    }
  });


// DEBUG:
console.log('html parsed fields', JSON.parse(JSON.stringify(fields)));


  //
  // CREATE SETTINGS
  //
  const customFields = custom.fields;
  delete custom.fields;

  if (elTag === 'FORM') {
    customSettings.$form = $el;
  }

  // Extend every specific field settings.
  if (customFields) {
    customFields.forEach(cf => {
      const field = utils.find(fields, field => field.name === cf.name);
      if (field) {
        $.extend(true, field, cf);
      } else {
        fields.push(cf);
      }
    });
  }

  customSettings = settings.extend(customSettings);
  customSettings = customSettings.extend(custom);
  customSettings.fields = fields;

  // Entire form is disabled.
  if (customSettings.disabled) {
    log.warn('complete form is disabled');
    return $el;
  }


// DEBUG:
console.log('final settings', customSettings);


  //
  // SET ATTRS FROM SETTINGS
  //
  if (customSettings.$form) {

    $el.data('vv-settings', customSettings);

    if (customSettings.disabled)               $el.prop('disabled', true);
    if (customSettings.disableHTML5Validation) $el.attr('novalidate', 'novalidate');
  }

  fields.forEach(function (field) {

    field.$el.data('vv-settings', customSettings);

    if (field.disabled) field.$el.prop('disabled', true);
    if (field.required) field.$el.prop('required', true);

    if (field.validators) {
      utils.walkObject(field.validators, function (val, valName) {
        switch (valName) {
          case 'isLength':
            if (val.min) field.$el.attr('minlength', val.min);
            if (val.max) field.$el.attr('maxlength', val.max);
            break;
          case 'matches':
            if (val instanceof RegExp) field.$el.attr('pattern', val);
            else field.$el.attr('pattern', val.pattern);
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


  //
  // HTML
  //
  if (!customSettings.intern) {

    // FORM.
    if (customSettings.$form) {
      customSettings.$form.addClass('vv-form');
      customSettings.$form.addClass(customSettings.classes.defaults.form);
    }

    // FIELDS.
    fields.forEach(function (field) {

      if (field.disabled || field.intern) return;

      const id = field.$el.attr('id');
      if (id) {
        field.$labels = $(`label[for=${id}]`);
        field.$labels.addClass('vv-label');
        field.$labels.addClass(customSettings.classes.defaults.label);
      }

      field.$el.addClass('vv-field');
      field.$el.addClass(customSettings.classes.defaults.field);

      if (field.display) {
        field.$display = field.display && $(field.display);
        field.$display.addClass('vv-display');
        field.$display.addClass(customSettings.classes.defaults.display);
      }
    });
  }


  //
  // EVENTS
  //
  const trigger = ($e, ev) => {
    if (ev.replace(/\s/g, '').length) $e.trigger(ev);
  };

  // FORM.
  if (customSettings.$form) {

    customSettings._onSubmit = function (e) {
      if (customSettings.$form.data('vv-valid') !== true) {
        e.preventDefault();
        customSettings.$form.vulcanval('validate');
        return false;
      }
    };
    customSettings.$form.on('submit', customSettings._onSubmit);

    customSettings._onReset = function (e) {
      customSettings.$form.vulcanval('reset');
    };
    customSettings.$form.on('reset', customSettings._onReset);
  }

  // FIELDS.
  fields.forEach(function (field) {

    if (field.disabled) return;

    const firstEvent = (field.firstValidationEvent || customSettings.firstValidationEvent) +' vv-change';
    const normalEvent = (field.validationEvents || customSettings.validationEvents) +' vv-change';
    const initial = typeof field.$el.val() === 'string' && field.$el.val().length;
    const context = {
      $form: customSettings.$form,
      $field: field.$el,
      settings: customSettings,
      validator
    };
    const get = (function (getFieldName) {
      const getField = utils.find(fields, f => f.name === getFieldName);
      if (getField) {
        return getField.value && getField.value();
      }
    }).bind(context);
    context.get = get;

    field.value = field.value && field.value.bind(context, field.$el);

    field._context = context;

    field._onChange = function (e) {
      field.$el.vulcanval('change', { field, e });
    };

    field._onFirstChange = function (e) {
      field.$el.off(firstEvent, field._onFirstChange);
      field.$el.on(normalEvent, field._onChange);
      trigger(field.$el, 'vv-change');
    };

    // @TODO: Listen to autofill event.

    field.$el.on(firstEvent, field._onFirstChange);

    if (initial || field.autostart || customSettings.autostart) {
      trigger(field.$el, 'vv-change');
    }
  });

  return $el;
};
