const vulcanval = require('../../src/js/vulcanval');
const es = require('../../src/js/locale/es');
const settings = require('./settings');

// In server, we need to install the language and set it as default manually.
vulcanval.extendLocale(es);
vulcanval.settings.locale = 'es';

const vv = vulcanval(settings);

// This is an example of data we can get from client-side.
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

// Leave the object with only the data we care about.
const map = vv.cleanMap(false, dirtyMap);
console.log(map);
// { user:
//    { name: 'Romel Pérez',
//      age: 'SELECT * FROM Users WHERE UserId = 123',
//      married: false },
//   creditcard: {
//     number: '4111 1111 1111 1111',
//     ccv: '123' } }

const result = vv.validate(map);
console.log(result);
// { 'user.age': 'Escribe un número entero válido por favor.',
//   'user.married': 'Este campo debe ser booleano.' }

const result2 = vv.validateField('user.age', map);
console.log(result2);
// 'Escribe un número entero válido por favor.'

const result3 = vv.validateField('creditcard.number', map);
console.log(result3);
// false
