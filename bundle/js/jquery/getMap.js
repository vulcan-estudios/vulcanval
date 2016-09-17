'use strict';

var convertMapTo = window.vulcanval.convertMapTo;
var fieldSettings = window.vulcanval.fieldSettings;

var ui = require('./_ui');
var $ = require('../jquery');

/**
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * This method can also be used over `<form>` elements without being instantiated
 * and will return a plain data map with all its inputs, selects and textareas
 * values.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `'getMap'`.
 * @return {map} The data {@link map}.
 */
var getMap = function getMap() {
  'use strict';

  var vv = this.data('vv');
  var settings = vv && vv.settings;

  var map = {};

  // Instantiated form.
  if (settings) {
    settings.fields.forEach(function (field) {
      if (field.onlyUI || field.disabled) return;
      map[field.name] = field.value();
    });
    if (settings.enableNestedMaps) {
      map = convertMapTo('nested', map);
    }
  }

  // Normal form.
  else if (this[0].tagName === 'FORM') {
      var $form = this;
      ui.filterFields(ui.findFields($form)).each(function (i, field) {

        var $field = $(field);
        var name = $field.attr('name') || $field.data('vv-name');
        var isDisabled = $field.prop('disabled');

        if (isDisabled) return;

        map[name] = fieldSettings.value($field);
      });
    }

  return map;
};

getMap.free = true;

module.exports = getMap;