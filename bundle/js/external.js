'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jQuery = exports.validator = undefined;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * window object.
 * @external window
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window}
 */

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

var jQuery = typeof window !== 'undefined' ? window.jQuery || window.$ : null;

exports.validator = _validator2.default;
exports.jQuery = jQuery;
exports.default = { validator: _validator2.default, jQuery: jQuery };