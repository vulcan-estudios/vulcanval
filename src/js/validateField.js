const extend = require('extend');
const validator = require('validator');
const log = require('./log');
const utils = require('./utils');

module.exports = function (conf) {

  log.debug(`validateField: ${conf.field.name}=${conf.field.value}`);

  if (typeof conf !== 'object') {
    return log.error('parameter must be an object');
  }
  if (typeof conf.field.name !== 'string') {
    return log.error('field property must contain a property name as string');
  }
  if (!(typeof conf.field.value === 'string' || typeof conf.field.value === 'number' ||
  typeof conf.field.value === 'boolean')) {
    return log.error('field property must contain a property inmutable value');
  }

  const field = { name: conf.field.name, value: conf.field.value };
  const settings = conf.settings;
  const context = conf.context;
  const callback = conf.callback;

  field.rules = utils.find(settings.fields, vals => vals.name === field.name);

  if (!field.rules) {
    log.warn('field to validate does not have validators');
    return true;
  }

  field.type = typeof field.value;
  field.value = field.type === 'boolean' ? field.value : String(field.value);

  // disabled
  if (field.rules.disabled) {
    return true;
  }

  // condition
  if (field.rules.condition && !field.rules.condition.call(context)) {
    return true;
  }

  // Get a message according to error and error parameters.
  const getMsg = (custom, str, opts, params) => {

    str = str ? str : '';

    const msgs = settings.msgs[settings.locale];
    const value = field.value;
    const option = typeof opts === 'string' || typeof opts === 'number' ? opts : '';
    params = extend(params, { value, option });
    if (custom) {
      return utils.format(str ? str : msgs.general, params);
    }

    const ids = str.split('.');
    if (ids.length > 1) {
      return utils.format(msgs[ids[0]][ids[1]] ? msgs[ids[0]][ids[1]] : msgs.general, params);
    } else {
      return utils.format(msgs[str] ? msgs[str] : msgs.general, params);
    }
  };

  var err = null;

  // required
  if (field.rules.required) {
    if (field.type === 'boolean') {
      if (field.value) {
        return true;
      } else {
        err = getMsg();
      }
    }
    else if (field.value === '') {
      err = getMsg();
    }
  } else {
    if (field.value === '' || field.type === 'boolean') {
      return true;
    }
  }

  utils.everyInObject(field.rules.validators, function (val, valName) {

    if (err) return false;

    const valType = typeof val;
    const valOpts = valType === 'object' || valType === 'string' || valType === 'number' ?
      val :
      undefined;

    // isLength validator.
    if (valName === 'isLength') {
      if (valType !== 'object') {
        return log.error('fields validator "isLength" must be an object if defined');
      }
      if (field.value.length < (valOpts.min || 0)) {
        err = getMsg(false, 'isLength.min', val, { min: valOpts.min });
      }
      else if (valOpts.max && field.value.length > valOpts.max) {
        err = getMsg(false, 'isLength.max', val, { max: valOpts.max });
      }
      return true;
    }

    // matches validator.
    else if (valName === 'matches') {
      if (valType !== 'object') {
        return log.error('fields validator "matches" must be an object if defined');
      }
      if (!validator.matches(field.value, val.pattern)) {
        err = getMsg(true, val.msg, val);
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

  if (err) {
    return { name: field.name, value: field.value, msg: err };
  } else {
    return true;
  }
};
