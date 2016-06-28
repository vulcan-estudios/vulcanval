const ui = require('./_ui');

const change = function (settings, field, e) {
  'use strict';

  const invalid = field.$el.vulcanval('inspect', field.name);
  const wasInvalid = field.$el.data('vv-valid') === false;
  const lastMsg = field.$el.data('vv-msg');

  field.$el.data({
    'vv-modified': true,
    'vv-msg': invalid
  });

  // Field invalid.
  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && !settings.intern && field.$display) {
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
