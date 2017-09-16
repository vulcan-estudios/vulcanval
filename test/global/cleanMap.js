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

  it('By default data types are conserved', function () {
    const vv = vulcanval({
      fields: [
        { name: 'f0' },
        { name: 'f1' },
        { name: 'f2' },
        { name: 'f3' },
        { name: 'f4' },
        { name: 'f5' },
        { name: 'f6' },
        { name: 'f7' },
        { name: 'f8' },
        { name: 'f9' },
        { name: 'f10' },
        { name: 'f11' },
      ]
    });
    const map = {
      //f0: void 0,
      //f1: void 0,
      f2: null,
      f3: true,
      f4: '',
      f5: -10.57,
      f6: '-10.57',
      f7: 'my-string',
      f8: [],
      f9: {},
      f10: NaN,
      f11: /abc/,
    };
    const actual = vv.cleanMap(map);
    expect(actual).to.eql(map);
  });

  it('Fields with provided converted are converted', function () {
    const vv = vulcanval({
      fields: [
        { name: 'f0', to: Boolean },
        { name: 'f1', to: Number },
        { name: 'f2', to: String },
        { name: 'f3', to: val => +val * 100 },
      ]
    });
    const map = {
      f0: '',
      f1: '-10.57',
      f2: -10.57,
      f3: '57',
    };
    const actual = vv.cleanMap(map);
    const expected = {
      f0: false,
      f1: -10.57,
      f2: '-10.57',
      f3: 5700,
    };
    expect(actual).to.eql(expected);
  });

  it('null and undefined values are excepted from converters', function () {
    const vv = vulcanval({
      fields: [
        { name: 'f0', to: Boolean },
        { name: 'f1', to: Number },
        { name: 'f2', to: String },
        { name: 'f3', to: val => +val * 100 },
      ]
    });
    const map = {
      //f0: void 0,
      f1: void 0,
      f2: null,
      f3: null,
    };
    const actual = vv.cleanMap(map);
    const expected = {
      //f0: void 0,
      //f1: void 0,
      f2: null,
      f3: null,
    };
    expect(actual).to.eql(expected);
  });

});
