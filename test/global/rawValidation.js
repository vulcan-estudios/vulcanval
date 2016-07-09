require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const vulcanval = require('../../src/js/vulcanval');
const browser = require('../../src/js/browser');


const map = {};
const vv1 = vulcanval({
  fields: [{
    name: 'wrongValidators',
    required: true,
    validators: { wrong1: true }
  }, {
    name: 'disabledField',
    disabled: true,
    required: true,
    validators: { isLength: { min: 100 } }
  }, {
    name: 'disabledInUI',
    onlyUI: true,
    required: true,
    validators: { isLength: { min: 100 } }
  }, {
    name: 'condition',
    required: true,
    onlyIf (value) { return value === 'disableCondition' ? false : true; },
    validators: { isEmail: true }
  }, {
    name: 'requiredNoVals',
    required: true
  }, {
    name: 'noRequiredNoVals',
    required: false
  }, {
    name: 'requiredVals',
    required: true,
    validators: {
      isEmail: true
    }
  }, {
    name: 'requiredValsMulti',
    required: true,
    validators: {
      isInt: true,
      isAlphanumeric: true,
      isLength: { min: 10, max: 20 }
    }
  }, {
    name: 'noRequiredVals',
    required: false,
    validators: {
      isEmail: true,
      contains: '@gmail.com'
    }
  }]
});
vv1.settings.context.get = name => map[name];


describe('Method validateField()', function () {

  describe('General', function () {

    it('Field without validators', function () {
      assert.isFalse(vv1.rawValidation('notFoundField'));
    });

    it('Field with a wrong validator should throw error', function () {
      assert.throws(function () {
        map.wrongValidators = 'random';
        vv1.rawValidation('wrongValidators');
      });
    });

    it('A disabled field should not be validated', function () {
      map.disabledField = 'random';
      assert.isFalse(vv1.rawValidation('disabledField'));
    });

    it('A disabled in UI should not be validated', function () {
      map.disabledInUI = 'random';
      if (browser.isNodejs) {
        assert.isFalse(vv1.rawValidation('disabledInUI'));
      } else {
        assert.isString(vv1.rawValidation('disabledInUI'));
      }
    });

    describe('Conditions', function () {

      it('Condition disabled', function () {
        map.condition = 'disableCondition';
        assert.isFalse(vv1.rawValidation('condition'));
      });

      it('Condition enabled and invalid', function () {
        map.condition = 'not valid';
        assert.isString(vv1.rawValidation('condition'));
      });

      it('Condition enabled and valid', function () {
        map.condition = 'user@mail.com';
        assert.isFalse(vv1.rawValidation('condition'));
      });
    });
  });


  describe('Required', function () {

    describe('With no validators', function () {

      it('String with length', function () {
        map.requiredNoVals = 'random';
        assert.isFalse(vv1.rawValidation('requiredNoVals'));
      });

      it('Number', function () {
        map.requiredNoVals = -157.978;
        assert.isFalse(vv1.rawValidation('requiredNoVals'));
      });

      it('Boolean true', function () {
        map.requiredNoVals = true;
        assert.isFalse(vv1.rawValidation('requiredNoVals'));
      });

      it('Boolean false', function () {
        map.requiredNoVals = false;
        assert.isString(vv1.rawValidation('requiredNoVals'));
      });

      it('Empty string', function () {
        map.requiredNoVals = '';
        assert.isString(vv1.rawValidation('requiredNoVals'));
      });
    });

    describe('Booleans', function () {

      it('Required with true', function () {
        map.requiredNoVals = true;
        assert.isFalse(vv1.rawValidation('requiredNoVals'));
      });

      it('Required with false', function () {
        map.requiredNoVals = false;
        assert.isString(vv1.rawValidation('requiredNoVals'));
      });

      it('No required with true', function () {
        map.noRequiredNoVals = true;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('No required with false', function () {
        map.noRequiredNoVals = false;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });
    });

    describe('No required with no validators', function () {

      it('Undefined', function () {
        map.noRequiredNoVals = undefined;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('Empty string', function () {
        map.noRequiredNoVals = '';
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('String with length', function () {
        map.noRequiredNoVals = 'random';
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('Number', function () {
        map.noRequiredNoVals = -157.978;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('Boolean true', function () {
        map.noRequiredNoVals = true;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });

      it('Boolean false', function () {
        map.noRequiredNoVals = false;
        assert.isFalse(vv1.rawValidation('noRequiredNoVals'));
      });
    });
  });


  describe('Validators', function () {

    describe('Is required with validators', function () {

      it('Undefined', function () {
        map.requiredVals = undefined;
        assert.isString(vv1.rawValidation('requiredVals'));
      });

      it('Empty string', function () {
        map.requiredVals = '';
        assert.isString(vv1.rawValidation('requiredVals'));
      });

      it('Wrong value', function () {
        map.requiredVals = 'wrong mail';
        assert.isString(vv1.rawValidation('requiredVals'));
      });

      it('One validator and valid', function () {
        map.requiredVals = 'mail@mail.com';
        assert.isFalse(vv1.rawValidation('requiredVals'));
      });

      it('Multiples validators and invalid (part1)', function () {
        map.requiredValsMulti = '10';
        assert.isString(vv1.rawValidation('requiredValsMulti'));
      });

      it('Multiples validators and invalid (part2)', function () {
        map.requiredValsMulti = '10#54$415457';
        assert.isString(vv1.rawValidation('requiredValsMulti'));
      });

      it('Multiples validators and valid', function () {
        map.requiredValsMulti = '100000000000';
        assert.isFalse(vv1.rawValidation('requiredValsMulti'));
      });
    });

    describe('No required with validators', function () {

      it('Undefined', function () {
        map.noRequiredVals = undefined;
        assert.isFalse(vv1.rawValidation('noRequiredVals'));
      });

      it('Empty string', function () {
        map.noRequiredVals = '';
        assert.isFalse(vv1.rawValidation('noRequiredVals'));
      });

      it('Invalid value (part2)', function () {
        map.noRequiredVals = 'wrong';
        assert.isString(vv1.rawValidation('noRequiredVals'));
      });

      it('Invalid value (part2)', function () {
        map.noRequiredVals = 'mail@mail.com';
        assert.isString(vv1.rawValidation('noRequiredVals'));
      });

      it('Valid value', function () {
        map.noRequiredVals = 'mail@gmail.com';
        assert.isFalse(vv1.rawValidation('noRequiredVals'));
      });
    });
  });
});
