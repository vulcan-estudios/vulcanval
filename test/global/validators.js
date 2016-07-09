require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const vulcanval = require('../../src/js/vulcanval');


describe('Validators', function () {


  describe('isLength', function () {

    const map = {};
    const vv1 = vulcanval({
      fields: [{
        name: 'a',
        validators: { isLength: { min: 4 } }
      }, {
        name: 'b',
        validators: { isLength: { max: 6 } }
      }, {
        name: 'c',
        validators: { isLength: { min: 4, max: 6 } }
      }]
    });
    vv1.settings.context.get = name => map[name];

    it('Only min configured', function () {
      map.a = 'xx';
      assert.isString(vv1.rawValidation('a'));
      map.a = 'xxxxxxxx';
      assert.isFalse(vv1.rawValidation('a'));
    });

    it('Only max configured', function () {
      map.b = 'xx';
      assert.isFalse(vv1.rawValidation('b'));
      map.b = 'xxxxxxxx';
      assert.isString(vv1.rawValidation('b'));
    });

    it('min and max configured', function () {
      map.c = 'xx';
      assert.isString(vv1.rawValidation('c'));
      map.c = 'xxxxx';
      assert.isFalse(vv1.rawValidation('c'));
      map.c = 'xxxxxxxx';
      assert.isString(vv1.rawValidation('c'));
    });
  });


  describe('matches', function () {

    const map = {};
    const vv2 = vulcanval({
      fields: [{
        name: 'a',
        validators: { matches: /^abc$/ }
      }, {
        name: 'b',
        validators: { matches: { pattern: /^xyz$/ } }
      }]
    });
    vv2.settings.context.get = name => map[name];

    it('Configured as RegExp', function () {
      map.a = 'random';
      assert.isString(vv2.rawValidation('a'));
      map.a = 'abc';
      assert.isFalse(vv2.rawValidation('a'));
    });

    it('Configured as object with pattern RegExp as property', function () {
      map.b = 'random';
      assert.isString(vv2.rawValidation('b'));
      map.b = 'xyz';
      assert.isFalse(vv2.rawValidation('b'));
    });
  });


  describe('Validators with text options', function () {

    const map = {};
    const vv3 = vulcanval({
      fields: [{
        name: 'contains',
        validators: {
          contains: '.com'
        }
      }, {
        name: 'isAlphanumeric',
        validators: {
          isAlphanumeric: 'es-ES'
        }
      }]
    });
    vv3.settings.context.get = name => map[name];

    it('contains', function () {
      map.contains = 'random';
      assert.isString(vv3.rawValidation('contains'));
      map.contains = 'random.com';
      assert.isFalse(vv3.rawValidation('contains'));
    });

    it('isAlphanumeric', function () {
      map.isAlphanumeric = 'r#nd$m';
      assert.isString(vv3.rawValidation('isAlphanumeric'));
      map.isAlphanumeric = 'random';
      assert.isFalse(vv3.rawValidation('isAlphanumeric'));
    });
  });


  describe('isEqualToField', function () {

    const map = {
      a: 'xxx',
      b: 'yyy',
      c: 'yyy'
    };
    const vv4 = vulcanval({
      fields: [{
        name: 'a',
        required: true,
        validators: {
          isEqualToField: 'b'
        }
      }, {
        name: 'b',
        required: true,
        validators: {
          isEqualToField: 'c'
        }
      }, {
        name: 'c',
        required: true,
        validators: {
          isEqualToField: 'b'
        }
      }]
    });
    vv4.settings.context.get = name => map[name];

    it('Basic use', function () {
      assert.isString(vv4.rawValidation('a'));
      assert.isFalse(vv4.rawValidation('b'));
      assert.isFalse(vv4.rawValidation('c'));
    });
  });


  describe('isAlphanumericText', function () {

    const map = {};
    const vv4 = vulcanval({
      fields: [{
        name: 'a',
        required: true,
        validators: {
          isAlphanumericText: true
        }
      }, {
        name: 'b',
        required: true,
        validators: {
          isAlphanumericText: 'es-ES'
        }
      }]
    });
    vv4.settings.context.get = name => map[name];

    it('Basic use', function () {
      map.a = 'not $alpha#numeric /here/';
      assert.isString(vv4.rawValidation('a'));

      map.a = '0 this 1 is 2 alphanumeric 3 here';
      assert.isFalse(vv4.rawValidation('a'));
    });

    it('Locale as option', function () {
      map.b = ':here: *this* is not alphanumeric.';
      assert.isString(vv4.rawValidation('b'));

      map.b = 'abc ñóñé BÍÉN acá';
      assert.isFalse(vv4.rawValidation('b'));
    });
  });
});
