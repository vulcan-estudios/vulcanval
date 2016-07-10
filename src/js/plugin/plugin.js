const validator =       require('validator');

const log =             require('../log');
const utils =           require('../utils');
const browser =         require('../browser');
const fieldSettings =   require('../fieldSettings');

const ui =              require('./_ui');
const fetchUISettings = require('./_fetchUISettings.js');
const createSettings =  require('./_createSettings');
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

  // Validate elements.
  let $fields;
  if ($el[0].tagName === 'FORM') {
    $fields = ui.filterFields(ui.findFields($el));
  } else {
    $fields = ui.filterFields($el);
  }

  if (!$fields.length) {
    log.error('only <form>; <input>, <textarea> and <select> with valid attr "name"; and elements with valid attr "data-vv-name"');
  }

  $fields.each(function (i, field) {
    const name = ui.getAttr(field, 'name');
    if (!utils.validateFieldName(name)) {
      log.error(`the field with attribute name "${name}" is invalid`);
    }
  });

  // Fetch UI elements settings configured as nodes attributes and properties.
  let fetchedSettings = fetchUISettings($el, $fields);

  // Create settings.
  customSettings = customSettings ? customSettings : {};
  const settings = createSettings($el, fetchedSettings, customSettings);

  if (settings.disabled) {
    log.warn('complete form is disabled');
    return this;
  }

  // Create vulcanval instance.
  const vv = window.vulcanval(settings);

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
