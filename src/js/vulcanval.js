/**
 * jQuery object.
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

const log = require('./log');
const utils = require('./utils');
const vulcanval = require('./main');
const plugin = require('./plugin/plugin');
const localeEN = require('./localization/en');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

// Expose the public API.
utils.performInBrowser(true, function () {
  window.jQuery.vulcanval = vulcanval;
  window.jQuery.fn.vulcanval = plugin;
});

module.exports = vulcanval;
