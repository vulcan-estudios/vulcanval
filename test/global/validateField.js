// @NOTE: JavaScript engines are not obligated to provide the object properties
// in the same order as they were added. There are some issues too. For
// alfanumeric starting object keys in webkit engines this seems to work.
// Even if this does not work in that way for some browsers, for the validateField()
// method, it does not matter.

const chai =    require('chai');
const extend =  require('extend');

const vulcanval =   require('../../src/js/vulcanval');
const utils =       require('../../src/js/utils');
const settings =    require('../../src/js/settings');
const localeEN =    require('../../src/js/localization/en');

const assert = chai.assert;

const RULE_EMAIL_CONTAINS = 'gmail';
const RULE_USERNAME = 'romel';
const RULE_AGE = 22;
const RULE_IS_LENGTH_MIN = 8;
const RULE_IS_LENGTH_MAX = 16;
const RULE_PASSWORD = '12345678910';
const RULE_PATTERN_MSG = 'The field should contain double AA.';

const conf = {};
const fields = {
  username: RULE_USERNAME,
  age: RULE_AGE,
  email: 'ronelprhone@gmail.com',
  password: RULE_PASSWORD
};

conf.settings = settings.extend({
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
    isEqual: 'The password must the the same.',
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
    name: 'doubleA',
    required: true,
    validators: {
      matches: {
        pattern: /AA/,
        msgs: RULE_PATTERN_MSG
      }
    }
  }, {
    name: 'repeatPassword',
    required: true,
    validators: {
      isEqual: 'password'
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
});

conf.context = {
  settings: conf.settings,
  get: (fieldName) => {
    return fields[fieldName];
  }
};

const msgs = id => conf.settings.getMsgTemplate(id);

var result, msg;


describe('validateField', function () {

  describe('general', function () {

    it('field without validators', function () {
      conf.field = { name: 'notFoundField', value: '' };
      assert.strictEqual(vulcanval.validateField(conf), true);
    });

    it('field with a wrong validator should throw error', function () {
      conf.field = { name: 'wrongValidators', value: 'wrong value' };
      assert.throws(function () {
        vulcanval.validateField(conf);
      });
    });

    it('a disabled field should not be validated', function () {
      conf.field = { name: 'bio', value: 'whatever' };
      assert.strictEqual(vulcanval.validateField(conf), true);
    });

    it('sharing values', function () {
      conf.field = { name: 'shared', value: 'whatever' };
      assert.strictEqual(vulcanval.validateField(conf), true);
    });

    it('condition disabled', function () {
      conf.field = { name: 'withCondition', value: RULE_USERNAME };
      assert.strictEqual(vulcanval.validateField(conf), true);
    });

    it('condition enabled', function () {

      conf.field = { name: 'withCondition', value: 'oh whatever' };
      msg = msgs('isEmail');
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'this must be invalid');

      conf.field = { name: 'withCondition', value: 'romel@mail.com' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this must be valid');
    });
  });


  describe('required', function () {

    it('with no validators', function () {

      conf.field = { name: 'username', value: 'a random value' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'string with length');

      conf.field = { name: 'username', value: -157.978 };
      assert.strictEqual(vulcanval.validateField(conf), true, 'number');

      conf.field = { name: 'username', value: true };
      assert.strictEqual(vulcanval.validateField(conf), true, 'boolean true');

      conf.field = { name: 'username', value: '' };
      msg = msgs('general');
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'empty string');

      conf.field = { name: 'username', value: false };
      result = extend({}, conf.field, { msg: msgs('general') });
      assert.deepEqual(vulcanval.validateField(conf), result, 'boolean false');
    });

    it('booleans', function () {

      conf.field = { name: 'username', value: true };
      assert.strictEqual(vulcanval.validateField(conf), true, 'required with true');

      conf.field = { name: 'username', value: false };
      msg = msgs('general');
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'required with false');

      conf.field = { name: 'age', value: true };
      assert.strictEqual(vulcanval.validateField(conf), true, 'no required with true');

      conf.field = { name: 'age', value: false };
      assert.strictEqual(vulcanval.validateField(conf), true, 'no required with false');
    });

    it('no required with no validators', function () {

      conf.field = { name: 'lastName', value: '' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'empty string');

      conf.field = { name: 'lastName', value: 'a random value' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'string with length');

      conf.field = { name: 'lastName', value: -157.978 };
      assert.strictEqual(vulcanval.validateField(conf), true, 'number');

      conf.field = { name: 'lastName', value: true };
      assert.strictEqual(vulcanval.validateField(conf), true, 'boolean true');

      conf.field = { name: 'lastName', value: false };
      assert.strictEqual(vulcanval.validateField(conf), true, 'boolean false');
    });
  });


  describe('validators', function () {

    it('required | isEmail', function () {

      conf.field = { name: 'email', value: '' };
      result = extend({}, conf.field, { msg: msgs('general') });
      assert.deepEqual(vulcanval.validateField(conf), result, 'no provided value should return error');

      conf.field = { name: 'email', value: 'wrong mail' };
      result = extend({}, conf.field, { msg: msgs('isEmail') });
      assert.deepEqual(vulcanval.validateField(conf), result, 'invalid email should return error');

      conf.field = { name: 'email', value: 'ronelprhone@gmail.com' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'the email is valid');
    });

    it('required | message {{option}} | contains', function () {

      conf.field = { name: 'email', value: 'goodbutno@mail.com' };
      msg = utils.format(msgs('contains'), { option: RULE_EMAIL_CONTAINS });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'email valid but not contains string should return error');
    });

    it('no required | isLength | isInt', function () {

      conf.field = { name: 'password', value: '' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this is not required so empty string is valid');

      conf.field = { name: 'password', value: 'wrong' };
      msg = utils.format(msgs('isLength.min'), { min: RULE_IS_LENGTH_MIN });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'value too short should fail');

      conf.field = { name: 'password', value: 'this is a really long field value' };
      msg = utils.format(msgs('isLength.max'), { max: RULE_IS_LENGTH_MAX });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'value too long should fail');

      conf.field = { name: 'password', value: 'nowItPass' };
      msg = utils.format(msgs('isInt'), {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'the value is not a proper integer so should fail');

      conf.field = { name: 'password', value: '715458484847' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'the value is valid');
    });

    it('matches', function () {

      conf.field = { name: 'doubleA', value: 'something AA here' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this value must be valid');

      conf.field = { name: 'doubleA', value: 'something without that' };
      msg = utils.format(RULE_PATTERN_MSG, {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'this should fail');
    });
  });


  describe('built-in validators', function () {

    it('isEqual', function () {

      conf.field = { name: 'repeatPassword', value: 'notEqual123' };
      msg = utils.format(msgs('isEqual'), {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result);

      conf.field = { name: 'repeatPassword', value: RULE_PASSWORD };
      assert.strictEqual(vulcanval.validateField(conf), true);
    });
  });


  describe('custom validators', function () {

    it('part 1', function () {

      conf.field = { name: 'fieldUC', value: 'notUpperCase' };
      msg = utils.format(msgs('isTheFieldUpperCase'), {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'this must be invalid');

      conf.field = { name: 'fieldUC', value: 'UPPERCASE' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this must be valid');
    });

    it('part 2', function () {

      conf.field = { name: 'first4lc', value: 'NotLowerCase' };
      msg = utils.format(msgs('areTheFirst4LettersLC'), {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'this must be invalid');

      conf.field = { name: 'first4lc', value: 'lowerCASE' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this must be valid');
    });
  });
});
