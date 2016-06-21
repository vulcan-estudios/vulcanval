(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
'use strict';

module.exports = function (map, to) {

  var form = {};

  var run = function run(n, o, p) {
    if (o.hasOwnProperty(p)) {
      n += '.' + p;
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean') {
        n = n.substring(1);
        form[n] = o[p];
      } else {
        for (var k in o[p]) {
          run(n, o[p], k);
        }
      }
    }
  };

  for (var p in map) {
    run('', map, p);
  }

  return form;
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function () {
  //
};

},{}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

//const validator = require('validator');
var extend = require('extend');
var settings = require('./settings');
var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');

/**
 * Validate a map form object with a given configuration.
 *
 * @param  {Object} map
 * @param  {Object} customSettings
 * @param  {Callback} [callback]
 * @return {Boolean}
 */
module.exports = function (map, customSettings, callback) {

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('first parameter (map) must be an object');
  }

  if (typeof customSettings === 'function') {
    callback = customSettings;
    customSettings = null;
  }

  customSettings = extend(true, settings, customSettings);

  if (customSettings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  var context = {
    config: customSettings,
    get: function get(name) {
      return map[name];
    }
  };

  return customSettings.fields.every(function (field) {

    var valueType = _typeof(map[field.name]);
    var value = valueType === 'boolean' ? map[field.name] : String(map[field.name]);

    if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) !== 'object') {
      log.warn('fields array should contain only objects');
      return true;
    }

    if (field.disabled) {
      return true;
    }

    if (field.condition && !field.condition.call(context)) {
      return true;
    }

    if (field.required) {
      if (valueType === 'boolean') {
        return !!value;
      }
    } else {
      if (value === '' || valueType === 'boolean') {
        return true;
      }
    }

    return utils.everyInObject(field.validators, function (val, valName) {

      var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
      var valOpts = valType === 'object' || valType === 'string' || valType === 'number' ? val : undefined;

      // isLength validator.
      if (valName === 'isLength') {
        if (valType !== 'object') {
          return log.error('fields validator "isLength" must be an object if defined');
        }
        return validator.isLength(value, val);
      }

      // matches validator.
      else if (valName === 'matches') {
          if (valType !== 'object') {
            return log.error('fields validator "matches" must be an object if defined');
          }
          return validator.matches(value, val.pattern);
        }

        // Custom validator.
        else if (customSettings.validators[valName]) {
            return customSettings.validators[valName].call(context, value, valOpts);
          }

          // `validator` validator.
          else if (validator[valName]) {
              return validator[valName](value, valOpts);
            }

            // Not found.
            else {
                return log.error('validator "' + valName + '" was not found');
              }
    });
  });
};

},{"./convertMapTo":2,"./log":6,"./settings":7,"./utils":8,"extend":1}],5:[function(require,module,exports){
'use strict';

var lang = {
  id: 'en',
  msgs: {
    isLength: {
      min: 'The field should contain at least {{min}} characters.',
      max: 'The field should contain at most {{max}} characters.'
    },
    isEmail: 'Please type a valid email address.',
    isNumeric: 'Please type a valid number.',
    isInt: 'Please type a valid integer number.',
    isURL: 'Please type a valid URL address.',
    isDate: 'Please type a valid date.'
  }
};

module.exports = lang;

},{}],6:[function(require,module,exports){
'use strict';

//const Log = require('prhone-log');

module.exports = new Log('vulcanval', {
  throwErrors: true,
  production: true
});

},{}],7:[function(require,module,exports){
'use strict';

var settings = {

  /**
   * What event to listen to trigger the first validation on fields.
   * @type {String}
   */
  firstValidationEvent: 'change',

  /**
   * After first validation, what events to listen to re-validate fields.
   * @type {String}
   */
  validationEvents: 'change input blur',

  /**
   * Auto start validation at instance time.
   * @type {Boolean}
   */
  autostart: false,

  /**
   * Don't validate form/fieldsets/fields. This can be used to ignore validations
   * but map a form field values into an object.
   * @type {Boolean}
   */
  silent: false,

  /**
   * Validate form/fieldsets/fields but don't modify UI. Ex: don't show error
   * messages.
   * @type {Boolean}
   */
  intern: false,

  /**
   * HTML tag classes to add to specific elements in form on error.
   * @type {Object}
   */
  classes: {
    error: {
      label: '',
      input: '',
      display: ''
    }
  },

  /**
   * Enable asynchronous validations.
   * @type {Boolean}
   */
  async: false,

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields.
   * @type {Boolean}
   *
   * @example
   * ```html
   * <form>
   *  <input name="field1" />
   *  <input name="map1.field2" />
   *  <input name="map1.field3" />
   *  <input name="map2.field4" />
   * </form>
   * ```
   *
   * ```js
   * const map = $('form').vulcanval('map');
   * ```
   *
   * If nested maps are enabled, the map object will have this value:
   * ```json
   * { field1: '', map1: { field2: '', field3: '' }, map2: { field4: '' } }
   * ```
   *
   * Otherwise:
   * ```json
   * { field1: '', 'map1.field2': '', 'map1.field3': '', 'map2.field4': '' }
   * ```
   */
  enableNestedMaps: false,

  /**
   * List of custom validators.
   * @type {Object}
   */
  validators: {},

  /**
   * Default messages locale.
   * @type {String}
   */
  locale: 'en',

  /**
   * Default message to show on error. This can be a map of locales:
   * { en: '', es: '', ... }
   * @type {String|Object}
   */
  msg: 'Please fill out this field.',

  /**
   * Validators messages.
   * @type {Object}
   */
  msgs: {},

  /**
   * The form fields to configure.
   * @type {Array}
   */
  fields: []
};

module.exports = settings;

},{}],8:[function(require,module,exports){
"use strict";

module.exports = {
  everyInObject: function everyInObject(obj, callback, context) {

    if (!context) context = obj;

    var keep = true;

    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        keep = callback.call(context, obj[name], name);
        if (!keep) return false;
      }
    }

    return !!keep;
  }
};

},{}],9:[function(require,module,exports){
'use strict';

var extend = require('extend');
//const validator = require('validator');

var settings = require('./settings');
var log = require('./log');
var isMapValid = require('./isMapValid');
var inspectMap = require('./inspectMap');
var convertMapTo = require('./convertMapTo');
var localeEN = require('./localization/en');

var vulcanval = {

  log: log,
  validator: validator,
  isMapValid: isMapValid,
  inspectMap: inspectMap,
  convertMapTo: convertMapTo,

  extendLocale: function extendLocale(locale) {
    settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
  },

  setLocale: function setLocale(locale) {
    settings.locale = locale;
  },

  addValidator: function addValidator(name, validator) {
    settings.validators[name] = validator;
  },

  debug: function debug(isDebug) {
    if (isDebug !== undefined) {
      log.settings.production = !isDebug;
    }
  }
};

vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

module.exports = vulcanval;

},{"./convertMapTo":2,"./inspectMap":3,"./isMapValid":4,"./localization/en":5,"./log":6,"./settings":7,"extend":1}]},{},[9]);
