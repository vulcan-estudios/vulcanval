require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');


const RULE_A = 'wrong';
const RULE_A_VALID = '100';
const RULE_B = 'wrong';
const RULE_B_VALID = '200';

const RULE_D = 'wrong';
const RULE_D_VALID = 'mail1@mail.com';
const RULE_D_ALT = 'alternative';
const RULE_E = 'wrong';
const RULE_E_VALID = 'mail2@mail.com';

const RULE_F = 'wrong';

const map = {
  a: RULE_A,
  b: RULE_B,
  c: {
    d: RULE_D,
    e: RULE_E
  },
  f: RULE_F
};
const vv = vulcanval({

  enableNestedMaps: true,
  validators: {
    hasSharedValues (value, opts) {
      return this.get('a') === RULE_A_VALID && this.get('b') === RULE_B_VALID;
    }
  },
  msgs: {
    hasSharedValues: 'This does not have shared values.'
  },

  // fieldsets
  fieldsets: [{
    name: 'x',
    fields: ['a', 'b'],
    required: true,
    onlyIf (value) { return this.get('c.d') !== RULE_D_ALT; }
  }, {
    name: 'y',
    fields: ['c.d', 'c.e'],
    required: true,
    validators: { isEmail: true }
  }],

  // fields
  fields: [{
    name: 'a',
    validators: { isInt: { min: 10 } }
  }, {
    name: 'b',
    validators: { isInt: { min: 10 } }
  }, {
    name: 'c.d'
  }, {
    name: 'c.e',
    validators: { hasSharedValues: true }
  }, {
    name: 'f',
    required: true,
    validators: { isLength: { min: 10 } }
  }]
});

var result;


describe('Method validateFieldset()', function () {


  describe('Validation', function () {

    it('Validate map', function () {
      assert.throws(function () {
        vv.validateFieldset('name');
      }, 'second parameter (map) must be an object');
    });

    it('Validate fieldset name', function () {
      assert.throws(function () {
        vv.validateFieldset('unknown', {});
      }, 'fieldset "unknown" was not found');
    });
  });


  describe('Conditionals', function () {

    it('Validate invalid fieldset with conditional', function () {
      result = vv.validateFieldset('x', map);

      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 2);
      assert.isString(result.a);
      assert.isString(result.b);
    });

    it('Validate valid fieldset with conditional', function () {
      map.c.d = RULE_D_ALT;
      assert.isFalse(vv.validateFieldset('x', map));
    });
  });


  describe('Shared value', function () {

    it('Validate invalid fieldset with shared values (part1)', function () {
      result = vv.validateFieldset('y', map);

      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 2);
      assert.isString(result['c.d']);
      assert.isString(result['c.e']);
    });

    it('Validate invalid fieldset with shared values (part2)', function () {
      map.a = RULE_A_VALID;
      map.b = RULE_B_VALID;

      result = vv.validateFieldset('y', map);

      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 2);
      assert.isString(result['c.d']);
      assert.isString(result['c.e']);
    });

    it('Validate valid fieldset with shared values', function () {
      map.a = RULE_A_VALID;
      map.b = RULE_B_VALID;
      map.c.d = RULE_D_VALID;
      map.c.e = RULE_E_VALID;

      assert.isFalse(vv.validateFieldset('y', map));
    });
  });
});
