require('./pre');

const chai =    require('chai');
const extend =  require('extend');
const vulcanval = require('../../src/js/vulcanval');


const assert = chai.assert;


describe('Method validateMap()', function () {

  describe('Plain map', function () {

    const FIELD0_DISABLED = true;
    const FIELD2_INT_MIN = 18;
    const AGE_VALUE = 22;

    const map = {
      username: 'romelpérez',  // the "é" is important in this test
      age: AGE_VALUE,
      married: false,
      email: 'ronelprhone@gmail.com',
      password: '1234567890'
    };

    const settings = {

      // The order of validators is important in this test
      fields: [{
        name: 'creditcard',
        required: true,
        disabled: FIELD0_DISABLED,
        validators: {
          isCreditCard: true
        }
      }, {
        name: 'username',
        required: true,
        validators: {
          isLength: { min: 6, max: 12 },
          isAlphanumeric: 'es-ES',
          isLowercase: true
        }
      }, {
        name: 'age',
        required: true,
        validators: {
          isInt: {
            min: FIELD2_INT_MIN,
            max: 100
          }
        }
      }, {
        name: 'married',
        required: true,
        onlyIf (value) {
          return this.get('age') >= FIELD2_INT_MIN + 5;
        }
      }, {
        name: 'email',
        required: true,
        validators: {
          isEmail: true,
          contains: 'gmail.com'
        }
      }, {
        name: 'password',
        required: true,
        validators: {
          isLength: { min: 8, max: 32 },
          isInt: true
        }
      }]
    };

    var result;

    it('Should validate a normal form', function () {
      assert.strictEqual(vulcanval.validateMap(map, settings), false);
    });

    it('Should validate fields even though they are not present', function () {
      settings.fields[0].disabled = !FIELD0_DISABLED;
      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result.creditcard);
      assert.lengthOf(Object.keys(result), 1);
      settings.fields[0].disabled = FIELD0_DISABLED;
    });

    it('Should fail at just one item invalid (part1)', function () {
      settings.fields[2].validators.isInt.min = FIELD2_INT_MIN + 10;
      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result.age);
      assert.lengthOf(Object.keys(result), 1);
      settings.fields[2].validators.isInt.min = FIELD2_INT_MIN;
    });

    it('Should fail at just one item invalid (part2)', function () {
      map.age = AGE_VALUE + 10;
      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result.married);
      assert.lengthOf(Object.keys(result), 1);
      map.age = AGE_VALUE;
    });
  });


  describe('Nested map', function () {

    const USER_USERNAME_DISABLED = true;
    const CREDITCARD_CCV = '123';

    const map = {
      user: {
        name: 'Romel Pérez',
        email: 'ronelprhone@gmail.com',
        password: '1234567890'
      },
      creditCard: {
        number: '4012888888881881',
        ccv: CREDITCARD_CCV,
        exp: {
          year: '2020',
          month: '12'
        }
      }
    };

    const settings = {
      enableNestedMaps: true,
      validators: {
        greatOrEqualYear (value) {
          return /^\d{4,4}$/.test(value) && Number(value) >= (new Date()).getFullYear();
        },
        greatOrEqualMonthInYear (value) {
          const year = Number(this.get('creditCard.exp.year'));
          return this.validator.isInt(value, { min: 1, max: 12 }) &&
            this.validator.isAfter(`${year}-${value}-28`);
        }
      },

      // The order of validators is important in this test
      fields: [{
        name: 'user.username',
        required: true,
        disabled: USER_USERNAME_DISABLED,
        validators: {
          isAlphanumeric: true
        }
      }, {
        name: 'user.name',
        required: true,
        validators: {
          isLength: { min: 4, max: 32 }
        }
      }, {
        name: 'user.email',
        required: true,
        validators: {
          isEmail: true
        }
      }, {
        name: 'user.password',
        required: true
      }, {
        name: 'creditCard.number',
        validators: {
          isCreditCard: true
        }
      }, {
        name: 'creditCard.ccv',
        required: true,
        onlyIf (value) { return String(this.get('creditCard.number')).length; },
        validators: {
          matches: /^\d{3,4}$/
        }
      }, {
        name: 'creditCard.exp.year',
        required: true,
        onlyIf (value) { return String(this.get('creditCard.number')).length; },
        validators: {
          greatOrEqualYear: true
        }
      }, {
        name: 'creditCard.exp.month',
        required: true,
        onlyIf (value) { return String(this.get('creditCard.number')).length; },
        validators: {
          greatOrEqualMonthInYear: true
        }
      }]
    };

    var result;

    it('Should validate a normal form', function () {
      assert.strictEqual(vulcanval.validateMap(map, settings), false);
    });

    it('Should validate fields even though they are not present', function () {
      settings.fields[0].disabled = !USER_USERNAME_DISABLED;
      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result['user.username']);
      assert.lengthOf(Object.keys(result), 1);
      settings.fields[0].disabled = USER_USERNAME_DISABLED;
    });

    it('Should fail at just one item invalid (part1)', function () {
      map.creditCard.ccv = 'a';
      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result['creditCard.ccv']);
      assert.lengthOf(Object.keys(result), 1);
      map.creditCard.ccv = CREDITCARD_CCV;
    });

    it('Should fail at just one item invalid (part2)', function () {
      settings.fields[2].validators.contains = 'outlook.com';
      settings.fields[7].validators.equals = 'awesome@mail.com';

      result = vulcanval.validateMap(map, settings);
      assert.isObject(result);
      assert.isString(result['user.email']);
      assert.isString(result['creditCard.exp.month']);
      assert.lengthOf(Object.keys(result), 2);

      delete settings.fields[2].validators.contains;
      delete settings.fields[7].validators.isAlphanumeric;
    });
  });
});
