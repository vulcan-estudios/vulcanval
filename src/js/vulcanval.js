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

utils.performInBrowser(true, function () {
  window.jQuery.fn.vulcanval = plugin;
});

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

module.exports = vulcanval;
