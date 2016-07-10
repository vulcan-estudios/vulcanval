require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const vulcanval = require('../../src/js/vulcanval');


var vv;


describe('Module vulcanval', function () {

  it('Has global properties and methods', function () {
    assert.isString(vulcanval.version);
    assert.isObject(vulcanval.log);
    assert.isObject(vulcanval.utils);
    assert.isObject(vulcanval.validator);
    assert.isObject(vulcanval.settings);
    assert.isFunction(vulcanval.extendLocale);
    assert.isFunction(vulcanval.addValidator);
    assert.isFunction(vulcanval.convertMapTo);
  });

  it('Instantiate vulcan validator', function () {

    vv = vulcanval({
      fields: [{name: 'a'}]
    });

    assert.isObject(vv);
    assert.isObject(vv.settings, '.settings should be an object');
    assert.isFunction(vv.rawValidation, '.rawValidation should be a function');
    assert.isFunction(vv.validate, '.validate should be a function');
    assert.isFunction(vv.validateFieldset, '.validateFieldset should be a function');
    assert.isFunction(vv.validateField, '.validateField should be a function');
    assert.isFunction(vv.cleanMap, '.cleanMap should be a function');
  });
});
