describe('Plugin', function () {

  fixture.setBase('test/client/plugin');
  $(fixture.load('forms.html')).appendTo('body');

  it('There has to be valid items on instance', function () {
    assert.throws(function () {
      $('#plugin1').vulcanval();
    });
    assert.throws(function () {
      $('#plugin2').vulcanval();
    });
  });

  it('Filter fields on form instance', function () {
    const settings = $('#plugin3').vulcanval().data('vv-settings');
    const currentNames = settings.fields.map(function (f) {return f.name;});
    const expectedNames = ['name', 'email', 'code', 'married', 'list', 'level', 'description', 'custom1', 'custom2'];

    assert.lengthOf(settings.fields, 9);
    assert.sameMembers(currentNames, expectedNames);
  });

  it('Filter fields on field instance', function () {
    const settings = $('#plugin4').vulcanval().data('vv-settings');

    assert.lengthOf(settings.fields, 1);
    assert.equal(settings.fields[0].name, 'custom0');
  });

  it('Do not reinstantiate on already instantiated elements', function () {
    const current = $('#plugin3').data('vv-settings');
    const recent = $('#plugin3').vulcanval().data('vv-settings');
    assert.strictEqual(current, recent);
  });

  it('Disabled form should not be instantiated', function () {
    const settings = $('#plugin5').vulcanval().data('vv-settings');
    assert.isUndefined(settings);
  });
});
