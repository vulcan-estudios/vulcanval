require('./pre');

const chai = require('chai');
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');
const utils = require('../../src/js/utils');


const assert = chai.assert;

const RULE_EMAIL_CONTAINS = 'gmail';
const RULE_USERNAME = 'romel';
const RULE_AGE = 22;
const RULE_IS_LENGTH_MIN = 8;
const RULE_IS_LENGTH_MAX = 16;
const RULE_PASSWORD = '12345678910';
const RULE_PATTERN_MSG = 'The field should contain double AA.';

const fields = {
  username: RULE_USERNAME,
  age: RULE_AGE,
  email: 'ronelprhone@gmail.com',
  password: RULE_PASSWORD
};

const settings = {
  validators: {
    isTheFieldUpperCase (value, opts) {
      return String(value).toUpperCase() === value;
    },
    areTheFirst4LettersLC (value, opts) {
      return String(value).substring(0, 4).toLowerCase() === String(value).substring(0, 4);
    },
    valSharedValues (value, opts) {
      const username = this.get('username');
      const age = this.get('age');
      return age === RULE_AGE && username === RULE_USERNAME;
    }
  },
  msgs: {
    isEqualToField: 'The password must the the same.',
    isTheFieldUpperCase: 'The field has to be in upper case.',
    areTheFirst4LettersLC: {
      en: 'The first four letters have to be lower case.',
      es: 'Las primeras 4 letras tienen que estar en minúscula.'
    }
  },
  fields: [{
    name: 'username',
    required: true
  }, {
    name: 'age',
    required: false
  }, {
    name: 'email',
    required: true,
    validators: {
      isEmail: true,
      contains: RULE_EMAIL_CONTAINS
    }
  }, {
    name: 'bio',
    disabled: true,
    required: true,
    validators: {
      isEmail: true,
      isFloat: true
    }
  }, {
    name: 'password',
    required: false,
    validators: {
      isLength: {
        min: RULE_IS_LENGTH_MIN,
        max: RULE_IS_LENGTH_MAX
      },
      isInt: {
        min: 100,
        max: 1000000000000
      }
    }
  }, {
    name: 'isLengthFail',
    required: true,
    validators: {
      isLength: true
    }
  }, {
    name: 'doubleA',
    required: true,
    validators: {
      matches: {
        pattern: /AA/,
        msgs: RULE_PATTERN_MSG
      }
    }
  }, {
    name: 'matchesFail',
    required: true,
    validators: {
      matches: /abc/
    }
  }, {
    name: 'hasManyDisabledValidators',
    validators: {
      contains: false,
      isInt: false,
      isHexColor: false,
      isFQDN: false
    }
  }, {
    name: 'repeatPassword',
    required: true,
    validators: {
      isEqualToField: 'password'
    }
  }, {
    name: 'wrongValidators',
    required: true,
    validators: {
      wrong: {},
      anotherWrong: true
    }
  }, {
    name: 'fieldUC',
    validators: {
      isTheFieldUpperCase: true
    }
  }, {
    name: 'first4lc',
    validators: {
      areTheFirst4LettersLC: true
    }
  }, {
    name: 'shared',
    validators: {
      valSharedValues: true
    }
  }, {
    name: 'withCondition',
    required: true,
    onlyIf (value) {
      return this.get('username') !== value;
    },
    validators: {
      isEmail: true,
      isLength: {
        min: 8,
        max: 32
      }
    }
  }]
};

var field;


describe('Method validateField()', function () {

  describe('General', function () {

    it('Field with an invalid validation definition should throw error', function () {
      assert.throws(function () {
        vulcanval.validateField('fieldName', {
          fieldName: 'a value'
        }, {
          fields: [
            {
              name: 'aProperField',
              required: true
            },
            'this will trigger the error'
          ]
        });
      });
    });

    it('Field without validators', function () {
      field = 'notFoundField';
      fields[field] = '';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    it('Field with a wrong validator should throw error', function () {
      field = 'wrongValidators';
      fields[field] = 'wrong value';
      assert.throws(function () {
        vulcanval.validateField(field, fields, settings);
      });
    });

    it('A disabled field should not be validated', function () {
      field = 'bio';
      fields[field] = 'whatever';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    it('Sharing values', function () {
      field = 'shared';
      fields[field] = 'whatever';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    it('Condition disabled', function () {
      field = 'withCondition';
      fields[field] = RULE_USERNAME;
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    it('Condition enabled', function () {

      field = 'withCondition';
      fields[field] = 'oh whatever';
      assert.isString(vulcanval.validateField(field, fields, settings));

      field = 'withCondition';
      fields[field] = 'romel@mail.com';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });
  });


  describe('Required', function () {

    describe('With no validators', function () {

      it('String with length', function () {
        field = 'username';
        fields[field] = 'A random value';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Number', function () {
        field = 'username';
        fields[field] = -157.978;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Boolean true', function () {
        field = 'username';
        fields[field] = true;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Empty string', function () {
        field = 'username';
        fields[field] = '';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Boolean false', function () {
        field = 'username';
        fields[field] = false;
        assert.isString(vulcanval.validateField(field, fields, settings));
      });
    });

    describe('Booleans', function () {

      it('Required with true', function () {
        field = 'username';
        fields[field] = true;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Required with false', function () {
        field = 'username';
        fields[field] = false;
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('No required with true', function () {
        field = 'age';
        fields[field] = true;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('No required with false', function () {
        field = 'age';
        fields[field] = false;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });
    });

    describe('No required with no validators', function () {

      it('Empty string', function () {
        field = 'lastName';
        fields[field] = '';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('String with length', function () {
        field = 'lastName';
        fields[field] = 'a random value';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Number', function () {
        field = 'lastName';
        fields[field] = -157.978;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Boolean true', function () {
        field = 'lastName';
        fields[field] = true;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Boolean false', function () {
        field = 'lastName';
        fields[field] = false;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });
    });
  });


  describe('Validators', function () {

    it('Validator "isLength"', function () {
      field = 'isLengthFail';
      fields[field] = 'whatever';
      assert.throws(function () {
        vulcanval.validateField(field, fields, settings);
      });
    });

    it('Validator "matches"', function () {

      field = 'doubleA';
      fields[field] = 'something AA here';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);

      field = 'doubleA';
      fields[field] = 'something without that';
      assert.isString(vulcanval.validateField(field, fields, settings));
    });

    it('Many validators but disabled', function () {
      field = 'hasManyDisabledValidators';
      fields[field] = 'whatever';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    describe('Is required with validators', function () {

      it('Empty string', function () {
        field = 'email';
        fields[field] = '';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Wrong value', function () {
        field = 'email';
        fields[field] = 'wrong mail';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Multiples validators and partially valid', function () {
        field = 'email';
        fields[field] = 'goodbutno@mail.com';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Multiples validators and valid', function () {
        field = 'email';
        fields[field] = 'ronelprhone@gmail.com';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });
    });

    it('No required with validators | Validator "isLength"', function () {

      it('Empty string', function () {
        field = 'password';
        fields[field] = '';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });

      it('Value too short should fail', function () {
        field = 'password';
        fields[field] = 'wrong';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Value too long should fail', function () {
        field = 'password';
        fields[field] = 'this is a really long field value';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('The value is not a proper integer so should fail', function () {
        field = 'password';
        fields[field] = 'almostPass';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Valid', function () {
        field = 'password';
        fields[field] = '715458484847';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });
    });
  });


  describe('Built-in validators', function () {

    describe('Validator "isEqualToField"', function () {

      it('Invalid', function () {
        field = 'repeatPassword';
        fields[field] = 'notEqual123';
        assert.isString(vulcanval.validateField(field, fields, settings));
      });

      it('Valid', function () {
        field = 'repeatPassword';
        fields[field] = RULE_PASSWORD;
        assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
      });
    });
  });


  describe('Custom validators', function () {

    it('Part 1', function () {

      field = 'fieldUC';
      fields[field] = 'notUpperCase';
      assert.isString(vulcanval.validateField(field, fields, settings));

      field = 'fieldUC';
      fields[field] = 'UPPERCASE';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });

    it('Part 2', function () {

      field = 'first4lc';
      fields[field] = 'NotLowerCase';
      assert.isString(vulcanval.validateField(field, fields, settings));

      field = 'first4lc';
      fields[field] = 'lowerCASE';
      assert.strictEqual(vulcanval.validateField(field, fields, settings), false);
    });
  });
});
