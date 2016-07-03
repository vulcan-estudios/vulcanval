const setMethods = require('../../../src/js/plugin/_setMethods');

describe('Set Methods', function () {

  const settings = {
    context: {
      prop: 10
    },
    fields: [{
      name: 'name',
      $el: 'element',
      onlyIf () {
        return this.prop === 10;
      },
      value ($el) {
        return this.prop === 10 && $el === 'element';
      }
    }]
  };
  setMethods(settings);

  it('Field value()', function () {
    assert.isTrue(settings.fields[0].value());
  });

  it('Field onlyIf()', function () {
    assert.isTrue(settings.fields[0].onlyIf());
  });
});
