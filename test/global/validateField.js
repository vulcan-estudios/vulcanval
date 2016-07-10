require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');


const RULE_USERNAME = 'romelperez';
const RULE_NAME = 'Romel Perez';
const RULE_HOBBY = 'reading';
const RULE_OS = 'linux';

const map = {
  username: RULE_USERNAME,
  name: RULE_NAME,
  // age is not present
  info: {
    hobby: RULE_HOBBY,
    os: RULE_OS
  }
};
const vv = vulcanval({
  enableNestedMaps: true,
  validators: {
    valSharedValues1 (value, opts) {
      const name = this.get('name');
      const hobby = this.get('info.hobby');
      return hobby === RULE_HOBBY && name === RULE_NAME;
    },
    valSharedValues2 (value, opts) {
      return this.get('username') === value.replace(/\s/g, '').toLowerCase();
    }
  },
  fields: [{
    name: 'username',
    required: true,
    validators: {
      valSharedValues1: true
    }
  }, {
    name: 'name',
    required: true,
    validators: {
      valSharedValues2: true
    }
  }, {
    name: 'age',
    required: true,
    validators: {
      isInt: true
    }
  }, {
    name: 'info.hobby',
    required: true,
    validators: {
      isLength: { min: 2, max: 10 }
    }
  }, {
    name: 'info.os',
    required: true,
    validators: {
      isUUID: true
    }
  }]
});


describe('Method validateField()', function () {

  it('Validate map', function () {
    assert.throws(function () {
      vv.validateField('name');
    }, 'second parameter (map) must be an object');
  });

  it('Validate field name', function () {
    assert.throws(function () {
      vv.validateField('unknown', {});
    }, 'field "unknown" was not found');
  });

  it('Sharing values', function () {
    assert.isFalse(vv.validateField('username', map), 'username should be valid');
    assert.isFalse(vv.validateField('name', map), 'name should be valid');
    assert.isString(vv.validateField('age', map), 'age should be invalid');
  });

  it('Nested maps', function () {
    assert.isFalse(vv.validateField('info.hobby', map));
    assert.isString(vv.validateField('info.os', map));
  });
});
