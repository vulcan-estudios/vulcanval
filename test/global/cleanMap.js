require('./pre');

const chai = require('chai');
const vulcanval = require('../../src/js/vulcanval');


const assert = chai.assert;

var map, converted, expected, settings;


describe('Method cleanMap()', function () {

  it('Cleaning a plain map', function () {
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
    settings = {
      fields: [{
        name: 'b'
      }, {
        name: 'd'
      }, {
        name: 'fieldset.field1'
      }]
    };
    converted = vulcanval.cleanMap(true, map, settings);
    assert.deepEqual(converted, expected);
  });

  it('Cleaning a nested map', function () {
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
        field1: 'str1',
        field2: 'str2'
      },
      set2: {
        set3: {
          field3: true,
          field4: false
        },
        field5: 'str3'
      }
    };
    settings = {
      fields: [
        { name: 'set1.field1' },
        { name: 'set1.field2' },
        { name: 'set2.set3.field3' },
        { name: 'set2.set3.field4' },
        { name: 'set2.field5' }
      ]
    };
    converted = vulcanval.cleanMap(false, map, settings);
    assert.deepEqual(converted, expected);
  });
});
