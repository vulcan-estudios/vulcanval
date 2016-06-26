const extend = require('extend');
const validator = require('validator');
const log = require('./log');
const utils = require('./utils');

/**
 * vulcanval.rawValidation()
 *
 * @private
 *
 * @param  {Object} conf
 * @param  {Object} conf.field
 * @param  {String} conf.field.name
 * @param  {*}      conf.field.value
 * @param  {settings} conf.settings
 * @param  {utilityContext} conf.context
 *
 * @return {String|Boolean} `false` if invalid, otherwise the error message.
 */
module.exports = function (conf) {
  'use strict';

  if (typeof conf !== 'object') {
    return log.error('parameter must be an object');
  }

  log.debug(`validating field ${conf.field.name}="${conf.field.value}"`);

  const field = conf.field;
  const settings = conf.settings;
  const context = conf.context;

  field.rules = utils.find(settings.fields, vals => {
    if (typeof vals !== 'object') {
      return log.error('a field can only have an object to describe its validation');
    }
    return vals.name === field.name;
  });

  if (!field.rules) {
    log.warn('field to validate does not have validators');
    return false;
  }

  // If the value is boolean, we don't go until validators.
  // The package `validator` only accepts strings, if the value is numeric,
  // convert it to string.
  // Void values will be converted to empty strings.
  field.type = typeof field.value;
  field.value = field.type === 'number' ? String(field.value) : field.value;
  field.value = field.value === undefined || field.value === null ? '' : field.value;

  // disabled
  if (field.rules.disabled) {
    return false;
  }

  // condition
  if (field.rules.onlyIf && !field.rules.onlyIf.call(context, field.value)) {
    return false;
  }

  // Get a message according to error and error parameters.
  const getMsg = (custom, id, opts) => {

    id = id ? id : 'general';

    const value = field.value;
    const option = typeof opts === 'string' || typeof opts === 'number' ? opts : '';
    const options = typeof opts === 'object' ? opts : null;
    const params = extend({}, { value, option }, options);

    // If it is custom, the message can be by locales or can be universal.
    if (custom) {
      return utils.format(typeof id === 'object' ? id[settings.locale] : id, params);
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
    }
    else if (field.value === '') {
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
      return true;
    }

    // Validator disabled.
    if (val === false) {
      return true;
    }

    var hasMsg, pattern;

    const valType = typeof val;
    const valOpts = valType === 'object' || valType === 'string' || valType === 'number' ?
      val :
      undefined;

    // isLength validator.
    if (valName === 'isLength') {
      if (valType !== 'object' || !val.min || !val.max) {
        return log.error('fields validator "isLength" must be a plain object if defined');
      }
      if (field.value.length < (valOpts.min || 0)) {
        err = getMsg(false, 'isLength.min', val);
      }
      else if (valOpts.max && field.value.length > valOpts.max) {
        err = getMsg(false, 'isLength.max', val);
      }
      return true;
    }

    // matches validator (accepts a plain object and a regular expression)
    else if (valName === 'matches') {
      if (valType !== 'object') {
        return log.error('fields validator "matches" must be a plain object or RegExp');
      }
      hasMsg = !(val instanceof RegExp) && val.msgs;
      pattern = hasMsg ? val.pattern : val;
      if (!validator.matches(field.value, pattern)) {
        err = getMsg(hasMsg, hasMsg ? val.msgs : 'general', val);
      }
      return true;
    }

    // Custom validator.
    else if (settings.validators[valName]) {
      if (!settings.validators[valName].call(context, field.value, valOpts)) {
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
      return log.error(`validator "${valName}" was not found`);
    }
  });

  log.info(`invalid field ${conf.field.name}="${conf.field.value}":`, err);

  return !err ? false : err;
};
