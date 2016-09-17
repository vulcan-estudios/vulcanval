const browser = require('../browser');

const lang = {
  id: 'es',
  msgs: {
    general: 'Completa este campo por favor.',
    isEqualToField: 'Este campo debe ser igual.',
    isAlphanumericText: 'Escribe sólo texto alfanumérico por favor.',
    'isLength.min': 'El campo debe contener al menos {{min}} carácteres.',
    'isLength.max': 'El campo debe contener un máximo de {{max}} carácteres.',
    contains: 'Este campo debe contener el texto "{{option}}".',
    equals: 'Este campo debe ser igual a "{{option}}".',
    isAlpha: 'Este campo debe contener sólo letras.',
    isAlphanumeric: 'Escribe sólo carácteres alfanuméricos por favor.',
    isBoolean: 'Este campo debe ser booleano.',
    isCreditCard: 'Escribe una tarjeta de crédito válida por favor.',
    isCurrency: 'Escribe un valor de monera válida por favor.',
    isDate: 'Escribe una fecha válida por favor.',
    isDecimal: 'Escribe un número decimal válido por favor.',
    isDivisibleBy: 'El número debe ser divisible por {{option}}.',
    isEmail: 'Escribe un correo electrónico válido por favor.',
    isFQDN: 'Escribe un nombre de dominio válido por favor (ej. domain.com).',
    isFloat: 'Escribe un número válido por favor.',
    isHexColor: 'Escribe un color hexadecimal válido por favor.',
    isHexadecimal: 'Escribe un número hexadecimal válido por favor.',
    isIP: 'Escribe un número de IP válido por favor (version 4 ó 6).',
    isISBN: 'Escribe un código ISBN válido por favor (version 10 ó 13).',
    isISIN: 'Escribe un código ISIN válido por favor (International Securities Identification Numbering).',
    isISO8601: 'Escribe una fecha válida por favor.',
    isInt: 'Escribe un número entero válido por favor.',
    isJSON: 'Escribe un string JSON válido por favor.',
    isLowercase: 'Este campo sólo debe contener texto en minúscula.',
    isMobilePhone: 'Escribe un número de teléfono móvil válido por favor.',
    isNumeric: 'Escribe un número válido por favor.',
    isURL: 'Escribe una URL válida por favor.',
    isUppercase: 'Este campo sólo debe contener texto en mayúscula.',
  }
};

browser.install(function () {
  window.vulcanval.extendLocale(lang);
  window.vulcanval.settings.locale = lang.id;
});

module.exports = lang;
