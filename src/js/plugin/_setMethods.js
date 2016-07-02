const validator = require('validator');
const utils = require('../utils');
const ui = require('./_ui');
const change = require('./_change');

/**
 * Set settings static methods.
 *
 * @param {settings} settings
 */
const setMethods = function (settings) {
  'use strict';

  settings.fields.forEach(field => {
    field.value = field.value && field.value.bind(settings.context, field.$el);
    field.onlyIf = field.onlyIf && field.onlyIf.bind(settings.context);
  });
};

module.exports = setMethods;
