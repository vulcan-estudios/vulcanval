(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ui = require('./_ui');

/**
 * On field change.
 *
 * @private
 */
var change = function change(vv, field) {
  'use strict';

  var settings = vv.settings;
  var invalid = vv.rawValidation(field.name);
  var wasInvalid = field.$el.data('vv-valid') === false;
  var lastMsg = field.$el.data('vv-msg');

  // Field general.
  field.$el.data({
    'vv-modified': true,
    'vv-msg': invalid
  });

  // Field invalid.
  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && field.$display) {
      field.$display.html(invalid);
    }

    ui.addFieldErrorClasses(settings, field);

    if (wasInvalid && lastMsg !== invalid) {
      ui.updateFieldErrorClasses(settings, field);
    }
  }

  // Field valid.
  else {
      field.$el.data('vv-valid', true);
      ui.removeFieldErrorClasses(settings, field);
    }

  ui.refreshFormState(settings);

  field.$el.trigger('vv-modify', {
    name: field.name,
    value: field.value(),
    valid: !invalid,
    msg: invalid
  });
};

module.exports = change;

},{"./_ui":6}],2:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

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

},{"./_ui":6}],3:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * Set HTML elements attributes according to final settings.
 *
 * @private
 * @param {settings} settings
 */
var setAttrs = function setAttrs(vv) {
  'use strict';

  var settings = vv.settings;

  if (settings.$form) {

    settings.$form.data('vv', vv);
    settings.$form.data('vv-settings', settings);

    if (settings.disabled) settings.$form.attr('disabled', 'disabled');
    if (settings.disableHTML5Validation) settings.$form.attr('novalidate', 'novalidate');
  }

  settings.fields.forEach(function (field) {

    if (!field.$el) return;

    field.$el.data('vv', vv);
    field.$el.data('vv-settings', settings);

    if (field.disabled) field.$el.attr('disabled', 'disabled');
    if (field.required) field.$el.prop('required', true);

    if (field.validators) {
      utils.walkObject(field.validators, function (val, valName) {
        switch (valName) {
          case 'isLength':
            if (val.min) field.$el.attr('minlength', val.min);
            if (val.max) field.$el.attr('maxlength', val.max);
            break;

          // Modifiers/flags in RegExp are not supported in HTML input pattern attr.
          case 'matches':
            var pattern = val instanceof RegExp ? val : val.pattern;
            field.$el.attr('pattern', pattern.toString().replace(/^\//, '').replace(/\/.{0,3}$/, ''));
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
};

module.exports = setAttrs;

},{"./_ui":6}],4:[function(require,module,exports){
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

},{"./_change":1,"./_ui":6}],5:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * Set HTML elements and initial classes.
 *
 * @private
 * @param {settings} settings
 */
var setHTML = function setHTML(vv) {
  'use strict';

  var settings = vv.settings;

  if (!settings.intern) {

    // Form.
    if (settings.$form) {
      settings.$form.addClass('vv-form');
      settings.$form.addClass(settings.classes.defaults.form);
    }

    // Fields.
    settings.fields.forEach(function (field) {

      if (!field.$el || field.disabled || field.intern) return;

      var id = field.$el.attr('id');
      if (id) {
        field.$labels = $('label[for=' + id + ']');
        field.$labels.addClass('vv-label');
        field.$labels.addClass(settings.classes.defaults.label);
      }

      field.$el.addClass('vv-field');
      field.$el.addClass(settings.classes.defaults.field);

      if (field.display) {
        field.$display = field.display && $(field.display);
        field.$display.addClass('vv-display');
        field.$display.addClass(settings.classes.defaults.display);
      }
    });
  }
};

module.exports = setHTML;

},{"./_ui":6}],6:[function(require,module,exports){
'use strict';

var ui = {
  refreshFormState: function refreshFormState(settings) {
    'use strict';

    var unknown = void 0;
    var valid = void 0;
    var state = void 0;

    if (settings.$form) {

      unknown = false;

      valid = settings.fields.every(function (field) {

        if (!field.$el) return true;
        if (field.disabled || field.onlyIf && !field.onlyIf()) return true;

        state = field.$el.data('vv-valid');

        if (state === void 0) {
          unknown = true;
          return true;
        }

        if (state === true) {
          return true;
        }
      });

      settings.$form.data({
        'vv-modified': true,
        'vv-valid': unknown ? void 0 : valid
      });

      if (!settings.intern) {
        if (unknown || valid) {
          settings.$form.removeClass('vv-form_error');
          settings.$form.removeClass(settings.classes.error.form);
        } else {
          settings.$form.addClass('vv-form_error');
          settings.$form.addClass(settings.classes.error.form);
        }
      }
    }

    return { valid: valid, unknown: unknown };
  },
  findFields: function findFields($form) {
    return $form.find('input, select, textarea, [data-vv-name]');
  },


  /**
   * Allow fields types:
   * - input type text-like
   * - input type checkbox
   * - input type radio
   * - input type hidden
   * - input type to exclude: file, image, submit, button and reset
   * - textarea
   * - select
   * - custom entries (* with attr data-vv-name)
   */
  filterFields: function filterFields($fields) {
    return $fields.filter(['input[name][type!=image][type!=button][type!=submit][type!=reset][type!=file]', 'select[name]', 'textarea[name]', '[data-vv-name]'].join(','));
  },
  getAttr: function getAttr(el, attr) {
    return $(el).attr(attr) !== void 0 ? $(el).attr(attr) : $(el).data('vv-' + attr);
  },
  getProp: function getProp(el, prop) {
    var value1 = $(el).prop(prop);
    var value2 = $(el).data('vv-' + prop);
    return typeof value1 === 'boolean' || typeof value1 === 'string' ? true : value2 !== void 0 ? value2 : void 0;
  },
  addFieldErrorClasses: function addFieldErrorClasses(settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.addClass('vv-field_error');
      field.$el.addClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.addClass('vv-display_error');
        field.$display.addClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.addClass('vv-label_error');
        field.$labels.addClass(settings.classes.error.label);
      }
    }
  },
  updateFieldErrorClasses: function updateFieldErrorClasses(settings, field) {

    if (field.$el && field.$display) {
      field.$display.removeClass('vv-display_error-update');
      setTimeout(function () {
        return field.$display.addClass('vv-display_error-update');
      }, 0);
    }
  },
  removeFieldErrorClasses: function removeFieldErrorClasses(settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.removeClass('vv-field_error');
      field.$el.removeClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.removeClass('vv-display_error vv-display_error-update');
        field.$display.removeClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.removeClass('vv-label_error');
        field.$labels.removeClass(settings.classes.error.label);
      }
    }
  }
};

module.exports = ui;

},{}],7:[function(require,module,exports){
'use strict';

var convertMapTo = window.vulcanval.convertMapTo;
var fieldSettings = window.vulcanval.fieldSettings;

var ui = require('./_ui');

/**
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * This method can also be used over `<form>` elements without being instantiated
 * and will return a plain data map with all its inputs, selects and textareas
 * values.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `'getMap'`.
 * @return {map} The data {@link map}.
 */
var getMap = function getMap() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv && vv.settings;

  var map = {};

  // Instantiated form.
  if (settings) {
    settings.fields.forEach(function (field) {
      if (field.onlyUI || field.disabled) return;
      map[field.name] = field.value();
    });
    if (settings.enableNestedMaps) {
      map = convertMapTo('nested', map);
    }
  }

  // Normal form.
  else if (this[0].tagName === 'FORM') {
      var $form = this;
      ui.filterFields(ui.findFields($form)).each(function (i, field) {

        var $field = $(field);
        var name = $field.attr('name') || $field.data('vv-name');
        var isDisabled = $field.prop('disabled');

        if (isDisabled) return;

        map[name] = fieldSettings.value($field);
      });
    }

  return map;
};

getMap.free = true;

module.exports = getMap;

},{"./_ui":6}],8:[function(require,module,exports){
'use strict';

var extend = window.vulcanval.utils.extend;
var validator = window.vulcanval.validator;
var log = window.vulcanval.log;
var utils = window.vulcanval.utils;
var browser = window.vulcanval.utils.browser;
var fieldSettings = window.vulcanval.utils.fieldSettings;

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

browser.perform(true, function () {
  window.jQuery.fn.vulcanval = plugin;
});

module.exports = plugin;

},{"./_change":1,"./_fetchUISettings.js":2,"./_setAttrs":3,"./_setEvents":4,"./_setHTML":5,"./_ui":6,"./getMap":7,"./inspect":9,"./inspectField":10,"./inspectFieldset":11,"./reset":12,"./resetField":13,"./resetFieldset":14,"./validate":15,"./validateField":16,"./validateFieldset":17}],9:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of the `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `'inspect'`.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If form is valid, `false` will be returned.
 */
var inspect = function inspect() {

  var vv = this.data('vv');
  var settings = vv.settings;

  var errors = {};

  settings.fields.forEach(function (field) {
    var invalid = vv.rawValidation(field.name);
    if (invalid) errors[field.name] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspect;

},{}],10:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of an specific field in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspectField - With value `'inspectField'`.
 * @param  {String} [fieldName] - The field name to inspect.
 * @return {String|Boolean}  It will return an error message if field is invalid,
 * otherwise `false`.
 */
var inspectField = function inspectField(fieldName) {

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  var field = utils.find(settings.fields, function (f) {
    return f.name === fieldName;
  });

  if (!field) {
    log.error('field "' + fieldName + '" was not found');
  }

  return vv.rawValidation(field.name);
};

module.exports = inspectField;

},{}],11:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of all fields in fieldset in the `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspectFieldset - With value `'inspectFieldset'`.
 * @param  {String} fieldsetName - The fieldset name to inspect.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If fieldset is valid, `false` will be returned.
 */
var inspectFieldset = function inspectFieldset(fieldsetName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  var fieldset = utils.find(settings.fieldsets, function (fs) {
    return fs.name === fieldsetName;
  });

  if (!fieldset) {
    log.error('fieldset "' + fieldsetName + '" was not found');
  }

  var errors = {};

  var field = void 0;
  fieldset.fields.forEach(function (fieldName) {
    var invalid = vv.rawValidation(fieldName);
    if (invalid) errors[fieldName] = invalid;
  });

  return Object.keys(errors).length ? errors : false;
};

module.exports = inspectFieldset;

},{}],12:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset the `<form>` validation state. This removes all current error states.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `'reset'`.
 * @return {external:jQuery} The same jQuery object.
 */
var reset = function reset() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  settings.fields.forEach(function (field) {
    ui.removeFieldErrorClasses(settings, field);
    field.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0,
      'vv-msg': void 0
    });
  });

  ui.refreshFormState(settings);

  if (settings.$form) {
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  settings.fields.forEach(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = reset;

},{"./_ui":6}],13:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset specific field validation state. This removes all current error states
 * from field.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} resetField - With value `'resetField'`.
 * @param  {String} fieldName - The name of the field.
 * @return {external:jQuery} The same jQuery object.
 */
var resetField = function resetField(fieldName) {
  'use strict';

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  var vv = this.data('vv');
  var settings = vv.settings;

  var field = utils.find(settings.fields, function (f) {
    return f.name === fieldName;
  });

  if (!field) {
    log.error('field "' + fieldName + '" was not found');
  }

  ui.removeFieldErrorClasses(settings, field);

  field.$el.data({
    'vv-modified': void 0,
    'vv-valid': void 0,
    'vv-msg': void 0
  });

  ui.refreshFormState(settings);

  settings.fields.every(function (field) {
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = resetField;

},{"./_ui":6}],14:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

var ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset all fields in fieldset validation state. This removes all current error states
 * in those fields.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} resetFieldset - With value `'resetFieldset'`.
 * @param  {String} fieldsetName - Fieldset name to reset.
 * @return {external:jQuery} The same jQuery object.
 */
var resetFieldset = function resetFieldset(fieldsetName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  var fieldset = utils.find(settings.fieldsets, function (fs) {
    return fs.name === fieldsetName;
  });

  if (!fieldset) {
    log.error('fieldset "' + fieldsetName + '" was not found');
  }

  var field = void 0;

  fieldset.fields.forEach(function (fieldName) {
    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
    ui.removeFieldErrorClasses(settings, field);
    field.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0,
      'vv-msg': void 0
    });
  });

  ui.refreshFormState(settings);

  if (settings.$form) {
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  fieldset.fields.forEach(function (fieldName) {
    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0,
      msg: void 0
    });
  });

  return this;
};

module.exports = resetFieldset;

},{"./_ui":6}],15:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `'validate'`.
 * @return {external:jQuery} The same jQuery object.
 */
var validate = function validate() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  var invalid = void 0;
  var first = true;

  settings.fields.forEach(function (field) {

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(field.name);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validate;

},{}],16:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually an specific field in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateField - With value `'validateField'`.
 * @param  {String} fieldName - The field name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
var validateField = function validateField(fieldName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldName) {
    log.error('a valid field name is required');
  }

  var field = utils.find(settings.fields, function (f) {
    return f.name === fieldName;
  });

  if (!field) {
    log.error('field "' + fieldName + '" was not found');
  }

  field.$el.trigger('vv-change');

  field.$el.trigger('focus');

  return this;
};

module.exports = validateField;

},{}],17:[function(require,module,exports){
'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields of an specific fieldset in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validateFieldset - With value `'validateFieldset'`.
 * @param  {String} fieldsetName - The fieldset name to validate.
 * @return {external:jQuery} The same jQuery object.
 */
var validateFieldset = function validateFieldset(fieldsetName) {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  if (!fieldsetName) {
    log.error('a valid fieldset name is required');
  }

  var fieldset = utils.find(settings.fieldsets, function (fs) {
    return fs.name === fieldsetName;
  });

  if (!fieldset) {
    log.error('fieldset "' + fieldsetName + '" was not found');
  }

  var field = void 0;
  var invalid = void 0;
  var first = true;

  fieldset.fields.forEach(function (fieldName) {

    field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(fieldName);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validateFieldset;

},{}]},{},[8]);
