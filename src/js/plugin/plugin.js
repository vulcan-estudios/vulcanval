const inspect =       require('./inspect');
const validate =      require('./validate');
const forceValid =    require('./forceValid');
const forceInvalid =  require('./forceInvalid');
const getMap =        require('./getMap');

const methods = { inspect, validate, forceValid, forceInvalid, getMap };

/**
 * @summary jQuery plugin to set the validators in forms.
 *
 * @description
 * Defines validation functionalities over form elements.
 *
 * This can be instantiated on any form element with a valid attribute `name`,
 * except the `<form>`:
 *
 * - `<form>`
 * - `<input>` with `type` different than `submit` and `button`
 * - `<textarea>`
 * - `<select>`
 *
 * Also, the plugin can be instantiated on any element with a valid input name in
 * attribute `data-vv-name` which will be treated as a normal `<input>`. This is
 * useful to create custom fields/entries.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {settings} settings - Instance settings. This is used to configure the
 * whole validation process.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (settings) {

  if (typeof settings === 'string') {
    if (methods[settings]) {
      const args = Array.prototype.slice.call(arguments, 1);
      return methods[settings].apply(this, args);
    } else {
      throw new Error(`jQuery vulcanval method unrecognized "${settings}".`);
    }
  }

  if (this.data('vv-config')) return;

  const conf = $.extend(true, {
    //
  }, settings);

  this.data('vv-config', conf);

  this.each(function () {

    // HTML
    // All JS configured validators will be merged with the HTML attributes to
    // enable HTML5 form validation integration.

    // EVENTS
    // if (isForm) this.on('submit', evaluate and evaluateInAsyncMode)

    // INIT
    //
  });

  return this;
};
