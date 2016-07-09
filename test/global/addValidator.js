require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');


var vv, map;


describe('Method addValidator()', function () {

  it('Simple validator', function () {

    vulcanval.addValidator('isOnlyALetter', function (value) {
      value = String(value);
      return /^[a-zA-Z]$/.test(value);
    });

    map = {};
    vv = vulcanval({
      fields: [{
        name: 'field0',
        validators: {
          isOnlyALetter: true
        }
      }]
    });
    vv.settings.context.get = name => map[name];

    map.field0 = 'n';
    assert.isFalse(vv.rawValidation('field0'));

    map.field0 = 'long';
    assert.isString(vv.rawValidation('field0'));
  });

  it('Custom validator context and options', function () {

    vulcanval.addValidator('isAwesome', function (value, opts) {
      value = String(value);

      if (opts === 'fly') return true;

      return this.validator.isInt(value, { min: 4, max: 8 }) &&
        this.get('tiger') === value &&
        value === '7';
    });

    map = {
      hawk: '-hawk-',
      shark: '7',
      worm: '...',
      tiger: '7'
    };
    vv = vulcanval({
      fields: [{
        name: 'hawk',
        validators: {
          isAwesome: 'fly'
        }
      }, {
        name: 'shark',
        validators: {
          isAwesome: true
        }
      }, {
        name: 'worm',
        validators: {
          isAwesome: { moreOptions: true }
        }
      }]
    });
    vv.settings.context.get = name => map[name];

    assert.isFalse(vv.rawValidation('hawk'));
    assert.isFalse(vv.rawValidation('shark'));
    assert.isString(vv.rawValidation('worm'));
  });
});
