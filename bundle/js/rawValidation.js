'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _external = require('./external');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * rawValidation method.
 *
 * @private
 * @param  {String} fieldName
 * @return {String|Boolean} `false` if valid, otherwise the error message.
 */
module.exports = function (fieldName) {
  'use strict';

  var settings = this.settings;
  var field = {
    name: fieldName,
    value: settings.context.get(fieldName)
  };

  _log2.default.debug('validating field: ' + field.name + '="' + field.value + '"');

  field.rules = _utils2.default.find(settings.fields, function (vals) {
    return vals.name === field.name;
  });

  if (!field.rules) {
    _log2.default.warn('field "' + field.name + '" to validate does not have validators');
    return false;
  }

  // If the value is boolean, we don't go until validators.
  // The package `validator` only accepts strings, if the value is numeric,
  // convert it to string.
  // Void values will be converted to empty strings.
  field.type = _typeof(field.value);
  field.value = field.type === 'number' ? String(field.value) : field.value;
  field.value = field.value === undefined || field.value === null ? '' : field.value;

  // disabled
  if (field.rules.disabled) {
    return false;
  }

  // used only in client side
  if (_browser2.default.isNodejs && field.rules.onlyUI) {
    return false;
  }

  // condition
  if (field.rules.onlyIf && !field.rules.onlyIf()) {
    return false;
  }

  // Get a message according to error and error parameters.
  var getMsg = function getMsg(custom, id, opts) {

    id = id ? id : 'general';

    var value = field.value;
    var option = typeof opts === 'string' || typeof opts === 'number' ? opts : '';
    var options = (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object' ? opts : null;
    var params = (0, _extend2.default)({}, { value: value, option: option }, options);

    // If it is custom, the message can be by locales or can be universal.
    if (custom) {
      return _utils2.default.format((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' ? id[settings.locale] : id, params);
    } else {
      return _utils2.default.format(settings.getMsgTemplate(id), params);
    }
  };

  var err = null;

  // required
  if (field.rules.required) {
    if (field.type === 'boolean') {
      if (field.value) {
        return false;
      } else {
        err = getMsg();
      }
    } else if (field.value === '') {
      err = getMsg();
    }
  } else {
    if (field.value === '' || field.type === 'boolean') {
      return false;
    }
  }

  _utils2.default.everyInObject(field.rules.validators, function (val, valName) {

    // There is already an error.
    if (err) {
      return false;
    }

    // Validator disabled.
    if (val === false) {
      return true;
    }

    var hasMsg, pattern;

    var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
    var valOpts = valType === 'object' || valType === 'string' || valType === 'number' ? val : undefined;

    // isLength validator.
    if (valName === 'isLength') {
      if (valType !== 'object' || !(typeof val.min === 'number' || val.max)) {
        return _log2.default.error('fields validator "isLength" must be a plain object if defined');
      }
      if (field.value.length < (valOpts.min || 0)) {
        err = getMsg(false, 'isLength.min', val);
      } else if (valOpts.max && field.value.length > valOpts.max) {
        err = getMsg(false, 'isLength.max', val);
      }
      return true;
    }

    // matches validator (accepts a plain object and a regular expression)
    else if (valName === 'matches') {
        if (valType !== 'object') {
          return _log2.default.error('fields validator "matches" must be a plain object or RegExp');
        }
        if (val instanceof RegExp) {
          pattern = val;
          hasMsg = false;
        } else if (val.pattern instanceof RegExp) {
          pattern = val.pattern;
          hasMsg = val.msgs;
        } else {
          return _log2.default.error('matches validator needs a RegExp');
        }
        if (!_external.validator.matches(field.value, pattern)) {
          err = getMsg(hasMsg, hasMsg ? val.msgs : 'general', val);
        }
        return true;
      }

      // Custom validator.
      else if (settings.validators[valName]) {
          if (!settings.validators[valName].call(settings.context, field.value, valOpts)) {
            err = getMsg(false, valName, val);
          }
          return true;
        }

        // `validator` validator.
        else if (_external.validator[valName]) {
            if (!_external.validator[valName](field.value, valOpts)) {
              err = getMsg(false, valName, val);
            }
            return true;
          }

          // Not found.
          else {
              return _log2.default.error('validator "' + valName + '" was not found');
            }
  });

  if (err) {
    _log2.default.info('invalid field ' + field.name + '="' + field.value + '":', err);
  }

  return !err ? false : err;
};