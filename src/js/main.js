const log = require('./log');
const utils = require('./utils');
const vulcanval = require('./vulcanval');
const plugin = require('./plugin/plugin');
const localeEN = require('./localization/en');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

module.exports = vulcanval;
