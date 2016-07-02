describe('Method getMap()', function () {

  fixture.setBase('test/client/getMap');

  it('Get form data without instantiating the plugin', function () {

    const formHTML = fixture.load('form.html');
    const formData = fixture.load('form.json');

    $(formHTML).appendTo('body');
    const $form = $('#getMap1');
    Object.keys(formData).forEach(function (field) {
      $form.find('[name='+ field +']').val(formData[field]);
    });

    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, formData);
  });

  it('Get form data with basic plugin instance', function () {
    //
  });

  it('Get form data with boolean values', function () {
    //
  });

  it('Get form data as nested map', function () {
    //
  });

  it('Get form data with groups fields', function () {
    //
  });
});
