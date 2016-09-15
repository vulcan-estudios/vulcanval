'use strict';

var ui = require('./_ui');

/**
 * On field change.
 *
 * @private
 */
var change = function change(vv, field) {
  'use strict';

  var settings = vv.settings;
  var invalid = vv.rawValidation(field.name);
  var wasInvalid = field.$el.data('vv-valid') === false;
  var lastMsg = field.$el.data('vv-msg');

  // Field general.
  field.$el.data({
    'vv-modified': true,
    'vv-msg': invalid
  });

  // Field invalid.
  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && field.$display) {
      field.$display.html(invalid);
    }

    ui.addFieldErrorClasses(settings, field);

    if (wasInvalid && lastMsg !== invalid) {
      ui.updateFieldErrorClasses(settings, field);
    }
  }

  // Field valid.
  else {
      field.$el.data('vv-valid', true);
      ui.removeFieldErrorClasses(settings, field);
    }

  ui.refreshFormState(settings);

  field.$el.trigger('vv-modify', {
    name: field.name,
    value: field.value(),
    valid: !invalid,
    msg: invalid
  });
};

module.exports = change;