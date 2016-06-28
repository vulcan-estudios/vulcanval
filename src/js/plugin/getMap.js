const convertMapTo = require('../convertMapTo');
const fieldSettings = require('./fieldSettings');
const ui = require('./ui');

/**
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `getMap`.
 * @return {map} The data {@link map}.
 */
module.exports = function () {
  'use strict';

  const settings = this.data('vv-settings');

  let map = {};

  if (settings) {
    settings.fields.forEach(function (field) {
      map[field.name] = field.value();
    });
    if (settings.enableNestedMaps) {
      map = convertMapTo('nested', map);
    }
  }
  else if (this[0].tagName === 'FORM') {
    const $form = this;
    ui.filterFields(ui.findFields($form)).each(function (i, field) {
      const $field = $(field);
      const name = $field.attr('name') || $field.data('vv-name');
      map[name] = fieldSettings.value.call({ $form, $field }, $field);
    });
  }

  return map;
};
