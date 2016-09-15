'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var extend = require('extend');
var validator = require('validator');
var log = require('./log');
var utils = require('./utils');
var browser = require('./browser');

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

  log.debug('validating field: ' + field.name + '="' + field.value + '"');

  field.rules = utils.find(settings.fields, function (vals) {
    return vals.name === field.name;
  });

  if (!field.rules) {
    log.warn('field "' + field.name + '" to validate does not have validators');
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
  if (browser.isNodejs && field.rules.onlyUI) {
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
    var params = extend({}, { value: value, option: option }, options);

    // If it is custom, the message can be by locales or can be universal.
    if (custom) {
      return utils.format((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' ? id[settings.locale] : id, params);
    } else {
      return utils.format(settings.getMsgTemplate(id), params);
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

  utils.everyInObject(field.rules.validators, function (val, valName) {

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
        return log.error('fields validator "isLength" must be a plain object if defined');
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
          return log.error('fields validator "matches" must be a plain object or RegExp');
        }
        if (val instanceof RegExp) {
          pattern = val;
          hasMsg = false;
        } else if (val.pattern instanceof RegExp) {
          pattern = val.pattern;
          hasMsg = val.msgs;
        } else {
          return log.error('matches validator needs a RegExp');
        }
        if (!validator.matches(field.value, pattern)) {
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
        else if (validator[valName]) {
            if (!validator[valName](field.value, valOpts)) {
              err = getMsg(false, valName, val);
            }
            return true;
          }

          // Not found.
          else {
              return log.error('validator "' + valName + '" was not found');
            }
  });

  if (err) {
    log.info('invalid field ' + field.name + '="' + field.value + '":', err);
  }

  return !err ? false : err;
};