const chai =    require('chai');
const extend =  require('extend');
const vulcanval = require('../../src/js/vulcanval');


const assert = chai.assert;

// DEBUG:
//vulcanval.debug(true);


describe('Method isMapValid', function () {

  const FIELD0_DISABLED = true;
  const FIELD2_INT_MIN = 18;
  const AGE_VALUE = 22;

  const map = {
    username: 'romelpérez',  // the "é" is important
    age: AGE_VALUE,
    married: false,
    email: 'ronelprhone@gmail.com',
    password: '1234567890'
  };

  const settings = {
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

  it('Should validate a normal form', function () {
    assert.strictEqual(vulcanval.isMapValid(map, settings), true);
  });

  it('Should validate fields even though they are not present', function () {
    settings.fields[0].disabled = !FIELD0_DISABLED;
    assert.strictEqual(vulcanval.isMapValid(map, settings), false);
    settings.fields[0].disabled = FIELD0_DISABLED;
  });

  it('Should fail at just one item invalid (part1)', function () {
    settings.fields[2].validators.isInt.min = FIELD2_INT_MIN + 10;
    assert.strictEqual(vulcanval.isMapValid(map, settings), false);
    settings.fields[2].validators.isInt.min = FIELD2_INT_MIN;
  });

  it('Should fail at just one item invalid (part2)', function () {
    map.age = AGE_VALUE + 10;
    assert.strictEqual(vulcanval.isMapValid(map, settings), false);
    map.age = AGE_VALUE;
  });
});
