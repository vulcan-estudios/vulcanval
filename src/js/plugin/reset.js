/**
 * Reset the form validation state.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `reset`.
 * @param  {String} [fieldName] - Only limite reset to specified field.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (fieldName) {

  const settings = this.data('vv-settings');
  if (!settings) return this;

  if (settings.$form) {
    settings.$form.removeClass('vv-form_error');
    settings.$form.removeClass(settings.classes.error.form);
    settings.$form.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
  }

  settings.fields.forEach(function (field) {

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

    field.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0
    });
    field.$el.trigger('vv-modify', {
      name: field.name,
      value: field.value(),
      valid: void 0
    });
  });

  return this;
};
