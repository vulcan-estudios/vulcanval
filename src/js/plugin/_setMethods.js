const validator = require('validator');
const utils = require('../utils');
const ui = require('./_ui');
const change = require('./_change');

/**
 * Set settings static methods.
 *
 * @private
 * @param {settings} settings
 */
const setMethods = function (settings) {
  'use strict';

  settings.fields.forEach(field => {

    field.value = field.value && field.value.bind(settings.context, field.$el);

    const onlyIf = field.onlyIf;
    delete field.onlyIf;
    if (onlyIf) {
      field.onlyIf = function () {
        return onlyIf.call(settings.context, field.value && field.value());
      };
    }
  });
};

module.exports = setMethods;
