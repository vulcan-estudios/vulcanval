const extend =          window.vulcanval.utils.extend;
const validator =       window.vulcanval.validator;
const log =             window.vulcanval.log;
const utils =           window.vulcanval.utils;
const browser =         window.vulcanval.utils.browser;
const fieldSettings =   window.vulcanval.utils.fieldSettings;

const ui =              require('./_ui');
const fetchUISettings = require('./_fetchUISettings.js');
const setAttrs =        require('./_setAttrs');
const setHTML =         require('./_setHTML');
const setEvents =       require('./_setEvents');
const change =          require('./_change');

const inspect =         require('./inspect');
const inspectFieldset = require('./inspectFieldset');
const inspectField =    require('./inspectField');
const validate =        require('./validate');
const validateFieldset =require('./validateFieldset');
const validateField =   require('./validateField');
const reset =           require('./reset');
const resetFieldset =   require('./resetFieldset');
const resetField =      require('./resetField');
const getMap =          require('./getMap');

const methods = {
  inspect, inspectFieldset, inspectField,
  validate, validateFieldset, validateField,
  reset, resetFieldset, resetField,
  getMap
};

/**
 * @summary jQuery plugin to instantiate the validators in forms.
 *
 * @description
 * Defines validation functionalities over form elements.
 *
 * This can be instantiated on forms or any form elements with a valid attribute `name`:
 *
 * - `<form>`
 * - `<input>` with `type` different than `submit`, `button` and `reset`
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
 */
const plugin = function (customSettings) {
  'use strict';

  if (!this.length) {
    return this;
  }

  const $el = this.first();

  if (typeof customSettings === 'string') {
    if (methods[customSettings]) {
      if (!methods[customSettings].free && !$el.data('vv-settings')) {
        log.error(`element needs to be instantiated`);
      } else {
        const args = Array.prototype.slice.call(arguments, 1);
        return methods[customSettings].apply($el, args);
      }
    } else {
      log.error(`method unrecognized "${customSettings}"`);
    }
  }

  if ($el.data('vv-settings')) {
    return this;
  }

  //
  // Validate elements.
  //
  let $fields;
  if ($el[0].tagName === 'FORM') {
    $fields = ui.filterFields(ui.findFields($el));
  } else {
    $fields = ui.filterFields($el);
  }

  if (!$fields.length) {
    log.error('only <form>; <input>, <textarea> and <select> with valid attr "name"; '+
      'and elements with valid attr "data-vv-name"');
  }

  $fields.each(function (i, field) {
    const name = ui.getAttr(field, 'name');
    if (!utils.validateFieldName(name)) {
      log.error(`the field with attribute name "${name}" is invalid`);
    }
  });

  //
  // Create settings.
  //
  const fetchedSettings = fetchUISettings($el, $fields);
  customSettings = customSettings ? customSettings : {};

  // Merge fields settings. We don't merge fieldset settings because from UI
  // we don't extract fieldsets information.
  customSettings.fields = utils.mergeCollections(
    'name',
    fetchedSettings.fields,
    customSettings.fields
  );
  delete fetchedSettings.fields;

  // All fields have to have an element.
  customSettings.fields.forEach(field => {
    if (!field.$el) {
      log.error(`field "${field.name}" does not have DOM element`);
    }
  });

  extend(true, fetchedSettings, customSettings);

  //
  // Instance.
  //
  const vv = window.vulcanval(fetchedSettings);
  const settings = vv.settings;

  if (settings.disabled) {
    log.warn('form is disabled, vulcanval will not operate');
    return this;
  }

  if ($el[0].tagName === 'FORM') {
    settings.$form = $el;
  }

  // Set method to get form data maps.
  vv.settings.context.get = function (getFieldName) {
    const getField = utils.find(vv.settings.fields, f => f.name === getFieldName);
    if (getField) {
      return getField.value && getField.value();
    } else {
      log.warn(`field "${getFieldName}" was not found in form`);
    }
  };

  //
  // UI configuration.
  //

  // Set parsed settings attributes in current HTML.
  setAttrs(vv);

  // Update form elements.
  setHTML(vv);

  // Set elements events.
  setEvents(vv);

  return $el;
};

browser.perform(true, function () {
  window.jQuery.fn.vulcanval = plugin;
});

module.exports = plugin;
