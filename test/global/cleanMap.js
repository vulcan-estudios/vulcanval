require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const vulcanval = require('../../src/js/vulcanval');


var vv, map, converted, expected;


describe('Method cleanMap()', function () {

  it('Cleaning a plain map (with disabled and ignored fields)', function () {
    map = {
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
    expected = {
      b: true,
      d: 'str2',
      'fieldset.field1': 'a random value'
    };
    vv = vulcanval({
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
    converted = vv.cleanMap(true, map);
    assert.deepEqual(converted, expected);
  });

  it('Cleaning a nested map (with disabled and ignored fields)', function () {
    map = {
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
    expected = {
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
    vv = vulcanval({
      fields: [
        { name: 'set1.field1', disabled: true },
        { name: 'set1.field2' },
        { name: 'set2.set3.field3', onlyUI: true },
        { name: 'set2.set3.field4' },
        { name: 'set2.field5' }
      ]
    });
    converted = vv.cleanMap(false, map);
    assert.deepEqual(converted, expected);
  });
});
