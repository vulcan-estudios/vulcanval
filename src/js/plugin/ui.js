const ui = {

  refreshFormState (settings) {
    'use strict';

    let unknown = false;
    let state;

    const valid = settings.fields.every(field => {

      state = field.$el.data('vv-valid');

      if (state === void 0) {
        unknown = true;
        return true;
      }

      if (state === true) {
        return true;
      }
    });

    if (settings.$form) {
      settings.$form.data({
        'vv-modified': true,
        'vv-valid': unknown ? void 0 : valid
      });
    }

    if (!settings.intern) {
      if (unknown || valid) {
        settings.$form.removeClass('vv-form_error');
        settings.$form.removeClass(settings.classes.error.form);
      } else {
        settings.$form.addClass('vv-form_error');
        settings.$form.addClass(settings.classes.error.form);
      }
    }

    return { valid, unknown };
  }

};

module.exports = ui;
