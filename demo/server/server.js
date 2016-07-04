const vulcanval = require('../../src/js/main');
const es = require('../../src/js/locale/es');

const settings = require('./settings');

vulcanval.extendLocale(es);
vulcanval.setLocale('es');

const dirtyMap = {
  hack1: 'DROP TABLE Users;',
  user: {
    name: 'Romel Pérez',
    age: 'SELECT * FROM Users WHERE UserId = 123;',
    married: 'haha, i am not a boolean',
    hack2: 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=',
  },
  creditcard: {
    number: '4111 1111 1111 1111',
    ccv: '123'
  }
};

const map = vulcanval.cleanMap(false, dirtyMap, settings);
console.log(map);
// { user:
//    { name: 'Romel Pérez',
//      age: 'SELECT * FROM Users WHERE UserId = 123',
//      married: false },
//   creditcard: {
//     number: '4111 1111 1111 1111',
//     ccv: '123' } }

const result = vulcanval.validateMap(map, settings);
console.log(result);
// { 'user.age': 'Escribe un número entero válido por favor.',
//   'user.married': 'Este campo debe ser booleano.' }

const result2 = vulcanval.validateField('user.age', map, settings);
console.log(result2);
// 'Escribe un número entero válido por favor.'

const result3 = vulcanval.validateField('creditcard.number', map, settings);
console.log(result3);
// false
