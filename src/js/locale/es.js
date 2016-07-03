const browser = require('../browser');

const lang = {
  id: 'es',
  msgs: {
    general: 'Completa este campo por favor.',
    isEqualToField: 'Este campo debe ser igual.',
    'isLength.min': 'El campo debe contener al menos {{min}} carácteres.',
    'isLength.max': 'El campo debe contener un máximo de {{max}} carácteres.',
    isEmail: 'Escribe un correo electrónico válido por favor.',
    isNumeric: 'Escribe un número válido por favor.',
    isInt: 'Escribe un número entero válido por favor.',
    isURL: 'Escribe una URL válida por favor.',
    isDate: 'Escribe una fecha válida por favor.',
    contains: 'Este campo debe contener el texto "{{option}}".',
    isAlphanumeric: 'Escribe sólo carácteres alfanuméricos por favor.',
    isCreditCard: 'Escribe una tarjeta de crédito válida por favor.',
    isLowercase: 'Este campo sólo debe contener texto en minúscula.',
    isUppercase: 'Este campo sólo debe contener texto en mayúscula.',
    isDivisibleBy: 'El número debe ser divisible por {{option}}.',
  }
};

browser.perform(false, function () {
  window.vulcanval.extendLocale(lang);
  window.vulcanval.setLocale(lang.id);
});

module.exports = lang;