require('./pre');

const chai = require('chai');
const extend = require('extend');
const vulcanval = require('../../src/js/main');


const assert = chai.assert;

var map, settings, result;


describe('Main module', function () {

  describe('addValidator()', function () {

    it('Simple validator', function () {

      vulcanval.addValidator('isOnlyALetter', function (value) {
        value = String(value);
        return /^[a-zA-Z]$/.test(value);
      });

      map = { field0: 'n' };
      settings = {
        fields: [{
          name: 'field0',
          validators: {
            isOnlyALetter: true
          }
        }]
      };

      result = vulcanval.validateField('field0', map, settings);
      assert.isFalse(result);

      map = { field0: 'long' };
      result = vulcanval.validateField('field0', map, settings);
      assert.isString(result);
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
      settings = {
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
      };

      result = vulcanval.validateField('hawk', map, settings);
      assert.isFalse(result);

      result = vulcanval.validateField('shark', map, settings);
      assert.isFalse(result);

      result = vulcanval.validateField('worm', map, settings);
      assert.isString(result);
    });
  });
});
