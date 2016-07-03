const log = require('./log');
const utils = require('./utils');
const vulcanval = require('./vulcanval');
const plugin = require('./plugin/plugin');
const localeEN = require('./locale/en');
const isEqualToField = require('./customValidators/isEqualToField');
const isAlphanumericText = require('./customValidators/isAlphanumericText');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

// Install custom validators.
vulcanval.addValidator('isEqualToField', isEqualToField);
vulcanval.addValidator('isAlphanumericText', isAlphanumericText);

module.exports = vulcanval;
