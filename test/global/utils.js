const chai = require('chai');
const utils = require('../../src/js/utils');

const assert = chai.assert;

describe('util everyInObject', function () {

  var example = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  };

  var iterations1 = [];
  var result1 = utils.everyInObject(example, function (value, name) {
    iterations1.push(value);
    return true;
  });

  var iterations2 = [];
  var result2 = utils.everyInObject(example, function (value, name) {
    return value % 2 !== 0;
  });

  it('should return true when all iterators return true', function () {
    assert.strictEqual(result1, true);
  });

  it('should return false if one fails', function () {
    assert.strictEqual(result2, false);
  });

  it('should iterate all items', function () {
    assert.sameMembers(iterations1, [1,2,3,4]);
  });

  it('should stop iterations at fail', function () {
    assert.isBelow(iterations2.length, 4);
  });
});

describe('util find', function () {

  it('should return the first item in search as no mutable', function () {
    var search = utils.find([1,2,3,4,5], function (item) {
      return item === 3;
    });
    assert.strictEqual(search, 3);
  });

  it('should return the first item in search as mutable', function () {
    var search = utils.find([{id:1},{id:2},{id:3},{id:4},{id:5}], function (item) {
      return item.id === 2;
    });
    assert.propertyVal(search, 'id', 2);
  });

  it('should return undefined on not found', function () {
    var search = utils.find([{id:1},{id:2},{id:3},{id:4},{id:5}], function (item) {
      return item.id === 500;
    });
    assert.strictEqual(search, undefined);
  });
});

describe('util format', function () {

  it('normal variable', function () {
    const formatted = utils.format('You, {{name}}, are great!', { name: 'right you' });
    assert.equal(formatted, 'You, right you, are great!');
  });

  it('many variables with duplicated names', function () {
    const formatted = utils.format('num {{num}}, str "{{str}}", bool {{bool}}', {
      num: -10.5,
      str: 'an str',
      bool: true
    });
    assert.equal(formatted, 'num -10.5, str "an str", bool true');
  });
});
