const ui = require('./_ui');

/**
 * On field change.
 *
 * @private
 */
const change = function (vv, field) {
  'use strict';

  const settings = vv.settings;
  const invalid = vv.rawValidation(field.name);
  const wasInvalid = field.$el.data('vv-valid') === false;
  const lastMsg = field.$el.data('vv-msg');

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
