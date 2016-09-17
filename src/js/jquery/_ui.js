const $ = require('../jquery');

const ui = {

  refreshFormState (settings) {
    'use strict';

    let unknown;
    let valid;
    let state;

    if (settings.$form) {

      unknown = false;

      valid = settings.fields.every(field => {

        if (!field.$el) return true;
        if (field.disabled || (field.onlyIf && !field.onlyIf())) return true;

        state = field.$el.data('vv-valid');

        if (state === void 0) {
          unknown = true;
          return true;
        }

        if (state === true) {
          return true;
        }
      });

      settings.$form.data({
        'vv-modified': true,
        'vv-valid': unknown ? void 0 : valid
      });

      if (!settings.intern) {
        if (unknown || valid) {
          settings.$form.removeClass('vv-form_error');
          settings.$form.removeClass(settings.classes.error.form);
        } else {
          settings.$form.addClass('vv-form_error');
          settings.$form.addClass(settings.classes.error.form);
        }
      }
    }

    return { valid, unknown };
  },

  findFields ($form) {
    return $form.find('input, select, textarea, [data-vv-name]');
  },

  /**
   * Allow fields types:
   * - input type text-like
   * - input type checkbox
   * - input type radio
   * - input type hidden
   * - input type to exclude: file, image, submit, button and reset
   * - textarea
   * - select
   * - custom entries (* with attr data-vv-name)
   */
  filterFields ($fields) {
    return $fields.filter([
      'input[name][type!=image][type!=button][type!=submit][type!=reset][type!=file]',
      'select[name]',
      'textarea[name]',
      '[data-vv-name]'
    ].join(','));
  },

  getAttr (el, attr) {
    return $(el).attr(attr) !== void 0 ?
      $(el).attr(attr) :
      $(el).data(`vv-${attr}`);
  },

  getProp (el, prop) {
    const value1 = $(el).prop(prop);
    const value2 = $(el).data(`vv-${prop}`);
    return typeof value1 === 'boolean' || typeof value1 === 'string' ? true :
      value2 !== void 0 ? value2 : void 0;
  },

  addFieldErrorClasses (settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.addClass('vv-field_error');
      field.$el.addClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.addClass('vv-display_error');
        field.$display.addClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.addClass('vv-label_error');
        field.$labels.addClass(settings.classes.error.label);
      }
    }
  },

  updateFieldErrorClasses (settings, field) {

    if (field.$el && field.$display) {
      field.$display.removeClass('vv-display_error-update');
      setTimeout(() => field.$display.addClass('vv-display_error-update'), 0);
    }
  },

  removeFieldErrorClasses (settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.removeClass('vv-field_error');
      field.$el.removeClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.removeClass('vv-display_error vv-display_error-update');
        field.$display.removeClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.removeClass('vv-label_error');
        field.$labels.removeClass(settings.classes.error.label);
      }
    }
  }
};

module.exports = ui;
