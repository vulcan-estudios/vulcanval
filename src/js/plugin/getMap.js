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

  // This does not necessarily required the plugin instance.

  const conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};
