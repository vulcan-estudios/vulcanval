// @NOTE: JavaScript engines are not obligated to provide the object properties
// in the same order as they were added. There are some issues too. For
// alfanumeric starting object keys in webkit engines this seems to work.
// Even if this does not work in that way for some browsers, for the validateField()
// method, it does not matter.

const chai = require('chai');
const extend = require('extend');

const vulcanval = require('../../src/js/vulcanval');
const utils = require('../../src/js/utils');
const settings = require('../../src/js/settings');
const localeEN = require('../../src/js/localization/en');

const assert = chai.assert;


describe('validateField', function () {

  const RULE_EMAIL_CONTAINS = 'gmail';
  const RULE_IS_LENGTH_MIN = 8;
  const RULE_IS_LENGTH_MAX = 16;
  const conf = {};
  const fields = {
    username: 'romel',
    age: 22,
    email: 'ronelprhone@gmail.com',
    password: '12345678910'
  };

  conf.settings = extend(true, {}, settings, {
    /*validators: {
      isTheFieldUpperCase: {
        msgs: 'A custom message: {{value}}.',
        validator (value, opts) {
          return String(value).toUpperCase() === value;
        }
      },
      areTheFirst4LettersLC: {
        msgs: {
          en: 'A custom message: {{value}}.',
          es: 'Un campo personalizado: {{value}}.'
        },
        validator (value, opts) {
          return String(value).substring(0, 4).toLowerCase() === value;
        }
      },
      equalPasswords: {
        msgs: 'The password should be the same.',
        validator (value, opts) {
          return value === this.get('password');
        }
      },
    },*/
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
      name: 'repeatPassword',
      required: true,
      validators: {
        //
      }
    }, {
      name: 'wrongValidators',
      required: true,
      validators: {
        wrong: {},
        anotherWrong: true
      }
    }]
  });

  conf.context = {
    settings: conf.settings,
    get: (fieldName) => {
      return fields[fieldName];
    }
  };

  const msgs = conf.settings.msgs[conf.settings.locale];

  var result, msg;


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
      conf.field = { name: 'bio', value: 'weird' };
      assert.strictEqual(vulcanval.validateField(conf), true);
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
      result = extend({}, conf.field, { msg: msgs.general });
      assert.deepEqual(vulcanval.validateField(conf), result, 'empty string');

      conf.field = { name: 'username', value: false };
      result = extend({}, conf.field, { msg: msgs.general });
      assert.deepEqual(vulcanval.validateField(conf), result, 'boolean false');
    });

    it('booleans', function () {

      conf.field = { name: 'username', value: true };
      assert.strictEqual(vulcanval.validateField(conf), true, 'required with true');

      conf.field = { name: 'username', value: false };
      msg = settings.msgs[settings.locale].general;
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

    it('required | message {{option}} | contains | isEmail', function () {

      conf.field = { name: 'email', value: '' };
      result = extend({}, conf.field, { msg: msgs.general });
      assert.deepEqual(vulcanval.validateField(conf), result, 'no provided value should return error');

      conf.field = { name: 'email', value: 'wrong mail' };
      result = extend({}, conf.field, { msg: msgs.isEmail });
      assert.deepEqual(vulcanval.validateField(conf), result, 'invalid email should return error');

      conf.field = { name: 'email', value: 'goodbutno@mail.com' };
      msg = utils.format(msgs.contains, { option: RULE_EMAIL_CONTAINS });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'email valid but not contains string should return error');

      conf.field = { name: 'email', value: 'ronelprhone@gmail.com' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'the email is valid');
    });

    it('no required | isLength | isInt', function () {

      conf.field = { name: 'password', value: '' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'this is not required so empty string is valid');

      conf.field = { name: 'password', value: 'wrong' };
      msg = utils.format(msgs.isLength.min, { min: RULE_IS_LENGTH_MIN });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'value too short should fail');

      conf.field = { name: 'password', value: 'this is a really long field value' };
      msg = utils.format(msgs.isLength.max, { max: RULE_IS_LENGTH_MAX });
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'value too long should fail');

      conf.field = { name: 'password', value: 'nowItPass' };
      msg = utils.format(msgs.isInt, {});
      result = extend({}, conf.field, { msg });
      assert.deepEqual(vulcanval.validateField(conf), result, 'the value is not a proper integer so should fail');

      conf.field = { name: 'password', value: '715458484847' };
      assert.strictEqual(vulcanval.validateField(conf), true, 'the value is valid');
    });
  });


  // TODO:
  // custom validators
  // sharing values
  // conditions
  // messages
  // change locale
});
