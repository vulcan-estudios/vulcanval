describe('Method getMap()', function () {

  fixture.setBase('test/client/getMap');
  const formHTML = fixture.load('form.html');
  const formData = fixture.load('form.json');

  $(formHTML).appendTo('body');

  it('Get form data without instantiating the plugin', function () {

    const $form = $('#form1');

    Object.keys(formData).forEach(function (field) {
      $form.find('[name='+ field +']').val(formData[field]);
    });

    const map = $form.vulcanval('getMap');

    assert.deepEqual(map, formData);
  });
});
