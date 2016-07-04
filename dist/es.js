(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var browser = {

  isNodejs: function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch (e) {}
    return isNodejs;
  }(),

  perform: function perform(isNeeded, fn) {
    if (!browser.isNodejs) {
      if (window.jQuery) {
        fn();
      } else if (isNeeded) {
        throw new Error('jQuery is required to perform operations');
      }
    }
  }
};

module.exports = browser;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

var browser = require('../browser');

var lang = {
  id: 'es',
  msgs: {
    general: 'Completa este campo por favor.',
    isEqualToField: 'Este campo debe ser igual.',
    isAlphanumericText: 'Escribe sólo texto alfanumérico por favor.',
    'isLength.min': 'El campo debe contener al menos {{min}} carácteres.',
    'isLength.max': 'El campo debe contener un máximo de {{max}} carácteres.',
    isEmail: 'Escribe un correo electrónico válido por favor.',
    isNumeric: 'Escribe un número positivo válido por favor.',
    isFloat: 'Escribe un número válido por favor.',
    isInt: 'Escribe un número entero válido por favor.',
    isURL: 'Escribe una URL válida por favor.',
    isDate: 'Escribe una fecha válida por favor.',
    contains: 'Este campo debe contener el texto "{{option}}".',
    isAlphanumeric: 'Escribe sólo carácteres alfanuméricos por favor.',
    isCreditCard: 'Escribe una tarjeta de crédito válida por favor.',
    isLowercase: 'Este campo sólo debe contener texto en minúscula.',
    isUppercase: 'Este campo sólo debe contener texto en mayúscula.',
    isDivisibleBy: 'El número debe ser divisible por {{option}}.',
    isBoolean: 'Este campo debe ser booleano.'
  }
};

browser.perform(false, function () {
  window.vulcanval.extendLocale(lang);
  window.vulcanval.setLocale(lang.id);
});

module.exports = lang;

},{"../browser":1}]},{},[2]);
