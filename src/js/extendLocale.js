const extend = require('extend');
const settings = require('./settings/settings');

/**
 * Extend validators messages in an specific localization. If it does not exist,
 * it will be created.
 *
 * @memberof module:vulcanval
 *
 * @param  {Object} locale - A plain object describing the locale.
 * @param  {String} locale.id - The identifier of the locale. It should be like:
 * `'en'`, `'es'`, `'jp'` or similar.
 * @param  {Object} locale.msgs - A plain object with validators names as keys
 * and messages formats as values. It should have a default value with the key
 * `general`, which will be used when there is no message for an specific validator
 * on error.
 *
 * @example
 * const locale = {
 *   id: 'jp',
 *   msgs: {
 *
 *     // Default error message: "Invalid form field error".
 *     general: '無効なフォームフィールド。',
 *
 *     // Message: "Form field has to be alphanumeric error message."
 *     isAlphanumeric: 'フォームフィールドは、英数字である必要があります。'
 *   }
 * };
 *
 * vulcanval.extendLocale(locale);
 */
module.exports = function extendLocale (locale) {
  settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
};
