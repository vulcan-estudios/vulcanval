require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');


var result;


describe('Method validate()', function () {


  it('Validation', function () {
    const vv0 = vulcanval({
      fields: [{
        name: 'a'
      }, {
        name: 'b'
      }]
    });
    assert.throws(function () {
      vv0.validate();
    }, 'first parameter (map) must be an object');
  });


  describe('Plain map', function () {

    const map = {
      a: '10.10.10.10',
      c: '-7.4'
    };
    const vv1 = vulcanval({
      fields: [{
        name: 'a',
        required: true,
        validators: { isIP: true }
      }, {
        name: 'b',
        validators: { isEmail: true }
      }, {
        name: 'c',
        required: true,
        validators: { isFloat: true }
      }, {
        name: 'd',
        disabled: true,
        required: true
      }]
    });

    it('Should validate a normal map (even without fields in map)', function () {
      assert.isFalse(vv1.validate(map));
    });

    it('Should fail at just one invalid item', function () {
      map.a = 'wrong';
      result = vv1.validate(map);
      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 1);
      assert.isString(result.a);
    });

    it('Should fail at many invalid items', function () {
      map.a = 'wrong';
      map.b = 'wrong';
      result = vv1.validate(map);
      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 2);
      assert.isString(result.a);
      assert.isString(result.b);
    });
  });


  describe('Nested map', function () {

    const map = {
      a: {
        b: '7.7.7.7'
      },
      d: '7.4',
      e: '2016-07-10 04:20:30'
    };
    const vv2 = vulcanval({
      enableNestedMaps: true,
      fields: [{
        name: 'a.b',
        required: true,
        validators: { isIP: true }
      }, {
        name: 'a.c',
        disabled: true,
        required: true,
        validators: { isEmail: true }
      }, {
        name: 'd',
        required: true,
        validators: { isFloat: true }
      }, {
        name: 'e',
        required: true,
        validators: { isISO8601: true }
      }]
    });

    it('Should validate a normal map (even without fields in map)', function () {
      assert.isFalse(vv2.validate(map));
    });

    it('Should fail at just one invalid item and should return a plain map', function () {
      map.a.b = 'wrong';
      result = vv2.validate(map);
      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 1);
      assert.isString(result['a.b']);
    });

    it('Should fail at many invalid items and should return a plain map', function () {
      map.a.b = 'wrong';
      map.d = 'wrong';
      result = vv2.validate(map);
      assert.isObject(result);
      assert.lengthOf(Object.keys(result), 2);
      assert.isString(result['a.b']);
      assert.isString(result.d);
    });
  });
});
