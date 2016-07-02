const convertMapTo = require('../convertMapTo');
const fieldSettings = require('./_fieldSettings');
const ui = require('./_ui');

/**
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `'getMap'`.
 * @return {map} The data {@link map}.
 */
const getMap = function () {
  'use strict';

  const settings = this.data('vv-settings');

  let map = {};

  if (settings) {
    settings.fields.forEach(function (field) {
      if (field.ignoreInMap || field.disabled) return;
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
      const isDisabled = $field.prop('disabled');

      if (isDisabled) return;

      map[name] = fieldSettings.value.call({ $form, $field }, $field);
    });
  }

  return map;
};

getMap.free = true;

module.exports = getMap;
