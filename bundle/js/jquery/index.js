'use strict';

var extend = window.vulcanval.utils.extend;
var validator = window.vulcanval.validator;
var log = window.vulcanval.log;
var utils = window.vulcanval.utils;
var browser = window.vulcanval.utils.browser;
var fieldSettings = window.vulcanval.utils.fieldSettings;

var $ = require('../external').jQuery;
var ui = require('./_ui');
var fetchUISettings = require('./_fetchUISettings.js');
var setAttrs = require('./_setAttrs');
var setHTML = require('./_setHTML');
var setEvents = require('./_setEvents');
var change = require('./_change');

var inspect = require('./inspect');
var inspectFieldset = require('./inspectFieldset');
var inspectField = require('./inspectField');
var validate = require('./validate');
var validateFieldset = require('./validateFieldset');
var validateField = require('./validateField');
var reset = require('./reset');
var resetFieldset = require('./resetFieldset');
var resetField = require('./resetField');
var getMap = require('./getMap');

var methods = {
  inspect: inspect, inspectFieldset: inspectFieldset, inspectField: inspectField,
  validate: validate, validateFieldset: validateFieldset, validateField: validateField,
  reset: reset, resetFieldset: resetFieldset, resetField: resetField,
  getMap: getMap
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
 * - `<input>` with `type` different than `file`, `submit`, `image`, `button` and `reset`
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
 * @see Also see the {@link http://vulcan-estudios.github.io/vulcanval#demos demos}
 * to learn how to implement this method.
 */
var plugin = function plugin(customSettings) {
  'use strict';

  if (!this.length) {
    return this;
  }

  var $el = this.first();

  if (typeof customSettings === 'string') {
    if (methods[customSettings]) {
      if (!methods[customSettings].free && !$el.data('vv-settings')) {
        log.error('element needs to be instantiated');
      } else {
        var args = Array.prototype.slice.call(arguments, 1);
        return methods[customSettings].apply($el, args);
      }
    } else {
      log.error('method unrecognized "' + customSettings + '"');
    }
  }

  if ($el.data('vv-settings')) {
    return this;
  }

  //
  // Validate elements.
  //
  var $fields = void 0;
  if ($el[0].tagName === 'FORM') {
    $fields = ui.filterFields(ui.findFields($el));
  } else {
    $fields = ui.filterFields($el);
  }

  if (!$fields.length) {
    log.error('only <form>; <input>, <textarea> and <select> with valid attr "name"; ' + 'and elements with valid attr "data-vv-name"');
  }

  $fields.each(function (i, field) {
    var name = ui.getAttr(field, 'name');
    if (!utils.validateFieldName(name)) {
      log.error('the field with attribute name "' + name + '" is invalid');
    }
  });

  //
  // Create settings.
  //
  var fetchedSettings = fetchUISettings($el, $fields);
  customSettings = customSettings ? customSettings : {};

  // Merge fields settings. We don't merge fieldset settings because from UI
  // we don't extract fieldsets information.
  customSettings.fields = utils.mergeCollections('name', fetchedSettings.fields, customSettings.fields);
  delete fetchedSettings.fields;

  // All fields have to have an element.
  customSettings.fields.forEach(function (field) {
    if (!field.$el) {
      log.error('field "' + field.name + '" does not have DOM element');
    }
  });

  extend(true, fetchedSettings, customSettings);

  //
  // Instance.
  //
  var vv = window.vulcanval(fetchedSettings);
  var settings = vv.settings;

  if (settings.disabled) {
    log.warn('form is disabled, vulcanval will not operate');
    return this;
  }

  if ($el[0].tagName === 'FORM') {
    settings.$form = $el;
  }

  // Set method to get form data maps.
  vv.settings.context.get = function (getFieldName) {
    var getField = utils.find(vv.settings.fields, function (f) {
      return f.name === getFieldName;
    });
    if (getField) {
      return getField.value && getField.value();
    } else {
      log.warn('field "' + getFieldName + '" was not found in form');
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

// Install plugin in jQuery namespace.
$.fn.vulcanval = plugin;

module.exports = plugin;