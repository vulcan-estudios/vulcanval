require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const utils = require('../../src/js/utils');


describe('utils{}', function () {

  describe('walkObject()', function () {

    it('walk properties in object', function () {
      const records = [];
      const obj = {a:1,b:true,c:-10.75,d:false,e:undefined,f:null};
      utils.walkObject(obj, function (item, index) {
        records.push(item);
      });
      assert.sameMembers(records, [1,true,-10.75,false,undefined,null]);
      assert.lengthOf(records, 6);
    });
  });

  describe('everyInObject()', function () {

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

  describe('find()', function () {

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

  describe('format()', function () {

    it('normal variable', function () {
      const formatted = utils.format('You, {{name}}, are great!', { name: 'right you' });
      assert.equal(formatted, 'You, right you, are great!');
    });

    it('many variables with equal names outside as text', function () {
      const formatted = utils.format('num {{num}}, str "{{str}}", bool {{bool}}', {
        num: -10.5,
        str: 'an str',
        bool: true
      });
      assert.equal(formatted, 'num -10.5, str "an str", bool true');
    });

    it('nested variables in objects', function () {
      const formatted = utils.format('a.b {{a.b}} a.c "{{a.c}}" and d {{d}}.', {
        a: { b: 'great', c: 'good' },
        d: 'excellent'
      });
      assert.equal(formatted, 'a.b great a.c "good" and d excellent.');
    });

    it('duplicated variables', function () {
      const formatted = utils.format(
        '1 {{a.b}} 2 {{d}} 3 {{a.b}} 4 {{d}} 5 {{d}}',
        { a: { b: 'AB' }, d: 'D' }
      );
      assert.equal(formatted, '1 AB 2 D 3 AB 4 D 5 D');
    });
  });

  describe('mergeCollections()', function () {

    it('Empty arrays should return empty array', function () {
      const merged = utils.mergeCollections('id', [], []);
      assert.sameDeepMembers(merged, []);
    });

    it('Merge unique items', function () {
      const col1 = [{ id:1, v:'a' }];
      const col2 = [{ id:2, v:'b' }];
      const merged = utils.mergeCollections('id', col1, col2);
      const expected = [
        { id:1, v:'a' },
        { id:2, v:'b' }
      ];
      assert.sameDeepMembers(merged, expected);
    });

    it('Shared items', function () {
      const col1 = [
        { id:1, v:'a' },
        { id:2, v:'b' },
        { id:3, v:'c' }
      ];
      const col2 = [
        { id:1, v:'x' },
        { id:2, v:'y' },
        { id:4, v:'d' }
      ];
      const merged = utils.mergeCollections('id', col1, col2);
      const expected = [
        { id:1, v:'x' },
        { id:2, v:'y' },
        { id:3, v:'c' },
        { id:4, v:'d' }
      ];
      assert.sameDeepMembers(merged, expected);
    });

    it('Shared deep items', function () {
      const col1 = [
        { id:1, v:{p:1,q:2} },
        { id:2, v:{p:3,q:4} },
        { id:3, v:{p:5,q:6} }
      ];
      const col2 = [
        { id:2, v:{p:7} },
        { id:3, v:{q:10} }
      ];
      const merged = utils.mergeCollections('id', col1, col2);
      const expected = [
        { id:1, v:{p:1,q:2} },
        { id:2, v:{p:7,q:4} },
        { id:3, v:{p:5,q:10} }
      ];
      assert.sameDeepMembers(merged, expected);
    });

    it('Repeated items', function () {
      const col1 = [
        { id:1, v:'a' },
        { id:1, v:'m' },
        { id:2, v:'b' },
        { id:2, v:'n' },
      ];
      const col2 = [
        { id:2, v:'x' },
        { id:3, v:'y' }
      ];
      const merged = utils.mergeCollections('id', col1, col2);
      const expected = [
        { id:1, v:'m' },
        { id:2, v:'x' },
        { id:3, v:'y' }
      ];
      assert.sameDeepMembers(merged, expected);
    });
  });
});
