require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const vulcanval = require('../../src/js/vulcanval');


describe('Method cleanMap()', function () {

  it('Cleaning a plain map (with disabled and ignored fields)', function () {
    const map = {
      a: 1,
      b: true,
      c: 'str1',
      d: 'str2',
      'fieldset.field1': 'a random value',
      weird: 'MSDG=9(#)=KMDF KKFD=AS=:X") =Z=#!"C_=":V#RO',
      rare: {
        trash: 'trash',
        _1: '12dsf2a48as8da5sdas',
        __private: ')/H=FSDM;S=D8C;5$%;C(W=#"%?":#$"¡#$O:!=()$UV;P")'
      }
    };
    const expected = {
      b: true,
      d: 'str2',
      'fieldset.field1': 'a random value'
    };
    const vv = vulcanval({
      fields: [{
        name: 'a',
        onlyUI: true
      }, {
        name: 'b'
      }, {
        name: 'c',
        disabled: true
      }, {
        name: 'd'
      }, {
        name: 'fieldset.field1'
      }]
    });
    const converted = vv.cleanMap(true, map);
    assert.deepEqual(converted, expected);
  });

  it('Cleaning a nested map (with disabled and ignored fields)', function () {
    const map = {
      set1: {
        field1: 'str1',
        field2: 'str2'
      },
      off: 'this is off',
      set2: {
        set3: {
          field3: true,
          field4: false,
          moreOff: 'Gsdfsd$(=dfsDFUUDFIKMVS#29838594JKIEJT(%#/(/"(&4?"¡")")))',
        },
        field5: 'str3'
      }
    };
    const expected = {
      set1: {
        field2: 'str2'
      },
      set2: {
        set3: {
          field4: false
        },
        field5: 'str3'
      }
    };
    const vv = vulcanval({
      fields: [
        { name: 'set1.field1', disabled: true },
        { name: 'set1.field2' },
        { name: 'set2.set3.field3', onlyUI: true },
        { name: 'set2.set3.field4' },
        { name: 'set2.field5' }
      ]
    });
    const converted = vv.cleanMap(false, map);
    assert.deepEqual(converted, expected);
  });

  it('Clean a map with undefined properties', function () {
    const vv = vulcanval({
      fields: [{
        name: 'name',
        required: true,
      }, {
        name: 'surname',
        required: true,
      }, {
        name: 'email',
        required: true,
      }]
    });
    const actual = vv.cleanMap(true, {
      name: 'string',
      something: true,
      email: null,
      here: {},
    });
    const expected = {
      name: 'string',
      email: null,
    };
    expect(actual).to.eql(expected);
  });

  it('By default it cleans a plain map', function () {
    const vv = vulcanval({
      fields: [{
        name: 'name',
        required: true,
      }, {
        name: 'surname',
        required: true,
      }, {
        name: 'email',
        required: true,
      }, {
        name: 'hash',
        required: true,
      }]
    });
    const actual = vv.cleanMap({
      name: 'string',
      something: true,
      email: null,
      here: {},
    });
    const expected = {
      name: 'string',
      email: null,
      hash: void 0
    };
    expect(actual).to.have.property('name');
    expect(actual).to.have.property('email');
    expect(actual).to.not.have.property('surname');
    expect(actual).to.not.have.property('hash');
  });

});
