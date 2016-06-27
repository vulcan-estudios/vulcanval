/**
 * On field change.
 *
 * @private
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} change
 * @param  {Object} conf
 * @param  {Object} conf.e
 * @param  {Object} conf.field
 * @return {external:jQuery}
 */
module.exports = function (conf) {
  'use strict';

  const settings = this.data('vv-settings');
  if (!settings) return this;

  const field = conf.field;
  const context = field._context;
  const invalid = this.vulcanval('inspect', field.name);
  const evModify = {
    name: field.name,
    value: field.value(),
    valid: !invalid,
    msg: invalid
  };

  field.$el.data('vv-modified', true);
  field.$el.trigger('vv-modify', evModify);

  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && !settings.intern) {
      field.$el.html(invalid).addClass('vv-field_error');
      field.$el.addClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.html(invalid).addClass('vv-display_error');
        field.$display.addClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.html(invalid).addClass('vv-label_error');
        field.$labels.addClass(settings.classes.error.label);
      }
    }
  }

  else {
    field.$el.data('vv-valid', true);

    if (!field.intern && !settings.intern) {
      field.$el.removeClass('vv-field_error');
      field.$el.removeClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.removeClass('vv-display_error');
        field.$display.removeClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.removeClass('vv-label_error');
        field.$labels.removeClass(settings.classes.error.label);
      }
    }
  }

  let formUnknown = false;
  const formValid = settings.fields.every(field => {
    const state = field.$el.data('vv-valid');
    if (state === void 0) {
      formUnknown = true;
      return true;
    }
    if (state === true) {
      return true;
    }
  });

  if (settings.$form) {
    settings.$form.data({
      'vv-modified': true,
      'vv-valid': formUnknown ? void 0 : formValid
    });

    if (!field.intern && !settings.intern) {
      if (formUnknown || formValid) {
        settings.$form.removeClass('vv-form_error');
        settings.$form.removeClass(settings.classes.error.form);
      } else {
        settings.$form.addClass('vv-form_error');
        settings.$form.addClass(settings.classes.error.form);
      }
    }
  }

  return this;
};
