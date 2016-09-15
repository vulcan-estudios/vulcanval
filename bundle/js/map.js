/**
 * @namespace map
 * @type {Object}
 *
 * @description
 * A plain object as a data map extracted from a `<form>`.
 *
 * This is basically a plain object with keys as form fields names and values
 * as their respective values.
 *
 * The values can be strings, numbers or booleans. Currently there is no support
 * for arrays.
 *
 * The keys can be simple alphanumeric values but can be used to describe a nested
 * or deep map if they have dots in the string in plain maps. The dots are to describe
 * `<fieldset>`s in the form and improve the structure of complex forms.
 *
 * If the map is plain and its keys have dots in the strings, it can be converted
 * to a nested map. The inverse is the same, if the map is nested and has possibly
 * many levels of deep objects, it can be converted to a plain map with dots
 * in the keys describing the deep fields.
 *
 * @example
 * // Plain map.
 * const plainMap = {
 *   normal: 'value0',
 *   another: true,
 *   'using.dots.inside': 100
 * };
 *
 * // Nested map.
 * const nestedMap = {
 *   name: 'Romel Pérez',
 *   age: 22,
 *   like: {
 *     apple: true,
 *     watermelon: true,
 *     pumpkin: false
 *   },
 *   favourite: {
 *     fruit: 'Cantaloupe',
 *     book: 'Spice and Wolf',
 *     game: 'World of Warcraft'
 *   }
 * };
 *
 * @see The {@link settings.enableNestedMaps} which is used in the validation
 * methods to determine how to treat the data map. Mainly used in server-side.
 *
 * @see The {@link external:"jQuery.fn".vulcanval jQuery.fn.vulcanval} `getMap`
 * method which extracts a data map from the form or fields used in validation.
 * Used in client-side.
 */
"use strict";