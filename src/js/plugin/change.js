const ui = require('./ui');

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
  const invalid = this.vulcanval('inspect', field.name);

  const wasInvalid = field.$el.data('vv-valid') === false;
  const lastMsg = field.$el.data('vv-msg');

  field.$el.data('vv-modified', true);
  field.$el.data('vv-msg', invalid);
  field.$el.trigger('vv-modify', {
    name: field.name,
    value: field.value(),
    valid: !invalid,
    msg: invalid
  });

  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && !settings.intern) {
      field.$el.addClass('vv-field_error');
      field.$el.addClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.html(invalid).addClass('vv-display_error');
        field.$display.addClass(settings.classes.error.display);

        if (wasInvalid && lastMsg !== invalid) {
          field.$display.removeClass('vv-display_error-update');
          setTimeout(() => field.$display.addClass('vv-display_error-update'), 0);
        }
      }

      if (field.$labels) {
        field.$labels.addClass('vv-label_error');
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
        field.$display.removeClass('vv-display_error vv-display_error-update');
        field.$display.removeClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.removeClass('vv-label_error');
        field.$labels.removeClass(settings.classes.error.label);
      }
    }
  }

  ui.refreshFormState(settings);

  return this;
};
