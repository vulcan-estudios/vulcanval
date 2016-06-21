const isValid =       require('./isValid');
const validate =      require('./validate');
const inspect =       require('./inspect');
const getMap =        require('./getMap');
const forceValid =    require('./forceValid');
const forceInvalid =  require('./forceInvalid');

const methods = { isValid, validate, inspect, getMap, forceValid, forceInvalid };

jQuery.fn.vulcanval = function (settings) {

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
