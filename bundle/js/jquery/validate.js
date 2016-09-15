'use strict';

var utils = window.vulcanval.utils;
var log = window.vulcanval.log;

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually all fields in `<form>`.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `'validate'`.
 * @return {external:jQuery} The same jQuery object.
 */
var validate = function validate() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv.settings;

  var invalid = void 0;
  var first = true;

  settings.fields.forEach(function (field) {

    field.$el.trigger('vv-change');

    invalid = vv.rawValidation(field.name);

    if (invalid && first) {
      first = false;
      field.$el.trigger('focus');
    }
  });

  return this;
};

module.exports = validate;