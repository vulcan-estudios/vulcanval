require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');


describe('Method addMethod()', function () {

  it('A valid name and a valid function should be provided', function () {
    expect(function () {
      vulcanval.addMethod();
    }, 'no params provided').to.throw();
    expect(function () {
      vulcanval.addMethod('name');
    }, 'no function provided').to.throw();
    expect(function () {
      vulcanval.addMethod('name', function () {});
    }).to.not.throw();
  });

  it('A basic method can be added', function () {

    vulcanval.addMethod('extra', function () {
      return 10;
    });

    const map = {};
    const vv = vulcanval({
      fields: [
        { name: 'field0' },
        { name: 'field1' },
        { name: 'field2' }
      ]
    });

    expect(vv.extra).to.be.a('function');
    expect(vv.extra()).to.equal(10);
  });

  it('New methods have access to context', function () {

    vulcanval.addMethod('validateExtra', function () {
      return this.settings.fields.length;
    });

    const map = {};
    const vv = vulcanval({
      fields: [
        { name: 'field0' },
        { name: 'field1' },
        { name: 'field2' }
      ]
    });

    expect(vv.validateExtra).to.be.a('function');
    expect(vv.validateExtra()).to.equal(3);
  });

});
