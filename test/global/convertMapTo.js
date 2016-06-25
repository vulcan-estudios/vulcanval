require('./pre');

const chai = require('chai');
const vulcanval = require('../../src/js/vulcanval');


const assert = chai.assert;

var map, converted, expected;


describe('Method convertMapTo()', function () {

  it('Unknown convertion (result must be the same)', function () {
    map = {
      a: 'str1',
      b: 150,
      c: {
        x: 'str2',
        y: {
          k: 'str3',
          l: {
            p: 'str4',
            q: 'str5'
          }
        }
      },
      d: {
        n: true
      }
    };
    assert.deepEqual(vulcanval.convertMapTo('unknown', map), map);
  });

  describe('To plain map', function () {

    it('Empty object', function () {
      map = {};
      converted = vulcanval.convertMapTo('plain', map);
      assert.deepEqual(map, converted);
    });

    it('Plain object with strings', function () {
      map = {a:'a', b:'b', c:'c'};
      converted = vulcanval.convertMapTo('plain', map);
      assert.deepEqual(map, converted);
    });

    it('Plain object with many value types', function () {
      map = {a:'str', b:-17.45, c:true};
      converted = vulcanval.convertMapTo('plain', map);
      assert.deepEqual(map, converted);
    });

    it('Deep object', function () {
      map = {
        a: 'str',
        b: -17.45,
        c: true,
        d: {
          x: true,
          y: 'another',
          z: 308
        }
      };
      expected = {
        a: 'str',
        b: -17.45,
        c: true,
        'd.x': true,
        'd.y': 'another',
        'd.z': 308
      };
      converted = vulcanval.convertMapTo('plain', map);
      assert.deepEqual(converted, expected);
    });

    it('Three levels deep object', function () {
      map = {
        a: 'str',
        b: -17.45,
        c: true,
        d: {
          x: {
            n: 1,
            m: 'great'
          },
          y: 'another',
          z: 308
        }
      };
      expected = {
        a: 'str',
        b: -17.45,
        c: true,
        'd.x.n': 1,
        'd.x.m': 'great',
        'd.y': 'another',
        'd.z': 308
      };
      converted = vulcanval.convertMapTo('plain', map);
      assert.deepEqual(converted, expected);
    });

    it('Name error (part1)', function () {
      map = { a: 'str1', 'b.': 'str2' };
      assert.throws(function () {
        vulcanval.convertMapTo('plain', map);
      });
    });

    it('Name error (part2)', function () {
      map = { a: 'str1', '.b': 'str2' };
      assert.throws(function () {
        vulcanval.convertMapTo('plain', map);
      });
    });
  });

  describe('To nested map', function () {

    it('Empty object', function () {
      map = {};
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(map, converted);
    });

    it('Plain object with strings', function () {
      map = {a:'a', b:'b', c:'c'};
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(map, converted);
    });

    it('Plain object with many value types', function () {
      map = {a:'str', b:-17.45, c:true};
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(map, converted);
    });

    it('Already nested object', function () {
      map = {
        a: 'str1',
        b: 150,
        c: {
          x: 'str2',
          y: 'str3'
        },
        d: {
          n: true
        }
      };
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(map, converted);
    });

    it('Plain with one level of deep', function () {
      map = {
        a: 'str1',
        b: 150,
        'c.x': 'str2',
        'c.y': 'str3',
        'd.n': true
      };
      expected = {
        a: 'str1',
        b: 150,
        c: {
          x: 'str2',
          y: 'str3'
        },
        d: {
          n: true
        }
      };
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(converted, expected);
    });

    it('Plain with two level of deep', function () {
      map = {
        a: 'str1',
        b: 150,
        'c.x': 'str2',
        'c.y.k': 'str3',
        'c.y.l.p': 'str4',
        'c.y.l.q': 'str5',
        'd.n': true
      };
      expected = {
        a: 'str1',
        b: 150,
        c: {
          x: 'str2',
          y: {
            k: 'str3',
            l: {
              p: 'str4',
              q: 'str5'
            }
          }
        },
        d: {
          n: true
        }
      };
      converted = vulcanval.convertMapTo('nested', map);
      assert.deepEqual(converted, expected);
    });

    it('Detect deep properties incoherents', function () {
      map = {
        a: 'str1',
        b: 150,
        'c': 'this is not supposed to be here',
        'c.x': 'str2',
        'c.y': 'str3',
        'd.n': true
      };
      assert.throws(function () {
        vulcanval.convertMapTo('nested', map);
      });
    });

    it('Name error (part1)', function () {
      map = { a: 'str1', 'b.': 'str2' };
      assert.throws(function () {
        vulcanval.convertMapTo('nested', map);
      });
    });

    it('Name error (part1)', function () {
      map = { a: 'str1', '.b': 'str2' };
      assert.throws(function () {
        vulcanval.convertMapTo('nested', map);
      });
    });
  });
});
