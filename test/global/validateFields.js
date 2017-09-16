require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');

describe('Method validateFields()', function () {

  it('Validation of one field', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true }
      ]
    });
    const map = { f0: '', f1: '' };
    const actual = vv.validateFields('f0', map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
    });
  });

  it('Validation of one valid field', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true }
      ]
    });
    const map = { f0: '1', f1: '1' };
    const actual = vv.validateFields('f0', map);
    expect(actual).to.eql({
      f0: false,
    });
  });

  it('Validation of list of fields', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true },
        { name: 'f2', required: true },
        { name: 'f3', required: true }
      ]
    });
    const map = { f0: '', f1: '', f2: '', f3: '' };
    const actual = vv.validateFields(['f0', 'f2'], map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
      f2: 'Please fill out this field.',
    });
  });

  it('Validation of a list of valid fields', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true },
        { name: 'f2', required: true },
        { name: 'f3', required: true }
      ]
    });
    const map = { f0: '1', f1: '1', f2: '1', f3: '1' };
    const actual = vv.validateFields(['f0', 'f2'], map);
    expect(actual).to.eql({
      f0: false,
      f2: false,
    });
  });

  it('Validation of affected fields', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true, listenTo: ['f0', 'f3'] },
        { name: 'f2', required: true, listenTo: ['f0'] },
        { name: 'f3', required: true },
        { name: 'f4', required: true }
      ]
    });
    const map = { f0: '', f1: '', f2: '', f3: '', f4: '' };
    const actual = vv.validateFields(['f0', 'f1'], map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
      f1: 'Please fill out this field.',
      f2: 'Please fill out this field.',
    });
  });

  it('Validation of extended affected fields', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true, listenTo: 'f0' },
        { name: 'f2', required: true, listenTo: 'f0' },
        { name: 'f3', required: true, listenTo: ['f2', 'f4'] },
        { name: 'f4', required: true, listenTo: 'f3' },
        { name: 'f5', required: true, listenTo: 'f6' },
        { name: 'f6', required: true }
      ]
    });
    const map = { f0: '', f1: '', f2: '', f3: '', f4: '' };
    const actual = vv.validateFields(['f0', 'f1'], map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
      f1: 'Please fill out this field.',
      f2: 'Please fill out this field.',
      f3: 'Please fill out this field.',
      f4: 'Please fill out this field.',
    });
  });

  it('Validation of valid/invalid fields', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true },
        { name: 'f1', required: true },
        { name: 'f2', required: true, listenTo: 'f1' }
      ]
    });
    const map = { f0: '', f1: '1', f2: '1', f3: '', f4: '' };
    const actual = vv.validateFields(['f0', 'f1'], map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
      f1: false,
      f2: false,
    });
  });

  it('Validation of a nested map', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true, listenTo: 's0.f1' },
        { name: 's0.f1', required: true, listenTo: 'f0' },
        { name: 's0.f2', required: true },
        { name: 's1.f3', required: true },
        { name: 's1.f4', required: true, listenTo: ['s0.f1', 's1.f3'] }
      ]
    });
    const map = {
      f0: '1',
      s0: { f1: '', f2: '' },
      s1: { f3: '', f4: '' }
    };
    const actual = vv.validateFields(['s0.f1', 's0.f2'], map);
    expect(actual).to.eql({
      'f0': false,
      's0.f1': 'Please fill out this field.',
      's0.f2': 'Please fill out this field.',
      's1.f4': 'Please fill out this field.',
    });
  });

  it('Pointing at the same fields works as expected', function () {
    const vv = vulcanval({
      locale: 'en',
      fields: [
        { name: 'f0', required: true, listenTo: ['f0', 'f1'] },
        { name: 'f1', required: true, listenTo: 'f1' },
        { name: 'f2', required: true, listenTo: 'f1' }
      ]
    });
    const map = { f0: '', f1: '1', f2: '1' };
    const actual = vv.validateFields(['f0', 'f1'], map);
    expect(actual).to.eql({
      f0: 'Please fill out this field.',
      f1: false,
      f2: false,
    });
  });

});
