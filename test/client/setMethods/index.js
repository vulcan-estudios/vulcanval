const setMethods = require('../../../src/js/plugin/_setMethods');

describe('Set Methods', function () {

  const settings = {
    context: {
      prop: 10
    },
    fields: [{
      name: 'name',
      $el: 'element',
      onlyIf (value) {
        if (this.prop === 10 && value === 'good') return 'good';
        return 'bad';
      },
      value ($el) {
        if (this.prop === 10 && $el === 'element') return 'good';
        return 'bad';
      }
    }]
  };
  setMethods(settings);

  it('Field value()', function () {
    assert.equal(settings.fields[0].value(), 'good');
  });

  it('Field onlyIf()', function () {
    assert.equal(settings.fields[0].onlyIf(), 'good');
  });
});
