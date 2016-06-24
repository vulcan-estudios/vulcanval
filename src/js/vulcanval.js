const log = require('./log');
const utils = require('./utils');
const vulcanval = require('./main');
const plugin = require('./plugin/plugin');
const localeEN = require('./localization/en');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

// Expose the public API.
if (!utils.isNodejs) {
  if (window.jQuery) {
    window.jQuery.vulcanval = vulcanval;
    window.jQuery.fn.vulcanval = plugin;
  } else {
    log.error('jQuery is required to perform operations');
  }
}

module.exports = vulcanval;
