import validator from 'validator';

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

const jQuery = typeof window !== 'undefined' ? (window.jQuery || window.$) : null;

export { validator, jQuery };

export default { validator, jQuery };
