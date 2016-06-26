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

  const settings = this.data('vv-settings');
  if (!settings) return this;

  const field = conf.field;
  const context = field._context;
  const invalid = this.vulcanval('inspect', field.name);

  // @TODO: Behaviour in async validation.
  // @TODO: Determine behaviour with intern property.
  // @TODO: Set states.
  // @TODO: Trigger custom events.

  if (invalid) {
    field.$el.data('vv-isValid', false);
    field.$el.html(invalid).addClass('vv-field_error');
    if (field.$display) field.$display.html(invalid).addClass('vv-display_error');
  }

  else {
    field.$el.data('vv-isValid', true);
    field.$el.removeClass('vv-field_error');
    if (field.$display) field.$display.removeClass('vv-display_error');
  }

  let formUnknown = false;
  const formValid = settings.fields.every(field => {
    const state = field.$el.data('vv-isValid');
    if (state === undefined) {
      formUnknown = true;
      return true;
    }
    if (state === true) {
      return true;
    }
  });

  if (formUnknown || formValid) {
    if (settings.$form) settings.$form.removeClass('vv-form_error');
  } else {
    if (settings.$form) settings.$form.addClass('vv-form_error');
  }

  if (settings.$form) {
    settings.$form.data('vv-isValid', formUnknown ? undefined : formValid);
  }

  return this;
};
