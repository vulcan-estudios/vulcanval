fixture.setBase('test/client/resetField');
$(fixture.load('forms.html')).appendTo('body');


describe('Method resetField()', function () {

  const $form = $('#resetField1');
  const $input1 = $form.find('[name=name]');
  const $input2 = $form.find('[name=email]');

  $form.vulcanval({
    autostart: true,  // note the autostart
    fields: [{
      name: 'name',
      required: true
    }, {
      name: 'email',
      required: true
    }]
  });

  it('Should validate field name', function () {
    assert.throws(function () {
      $form.vulcanval('resetField');
    });
    assert.throws(function () {
      $form.vulcanval('resetField', 'unknown');
    });
  });

  it('Fields initialized with errors (class)', function () {
    assert.isTrue($form.hasClass('vv-form_error'));
    $form.find('input').each((i, inp) => {
      assert.isTrue($(inp).hasClass('vv-field_error'));
    });
  });

  it('Fields initialized with errors (state)', function () {
    assert.isFalse($form.data('vv-valid'));
    $form.find('input').each((i, inp) => {
      assert.isFalse($(inp).data('vv-valid'));
    });
  });

  it('Reset fields', function () {
    $form.vulcanval('resetField', 'email');
  });

  it('Fields reseted (class)', function () {
    assert.isTrue($form.hasClass('vv-form_error'));
    assert.isTrue($input1.hasClass('vv-field_error'));
    assert.isFalse($input2.hasClass('vv-field_error'));
  });

  it('Fields reseted (state)', function () {
    assert.isFalse($form.data('vv-valid'));
    assert.isFalse($input1.data('vv-valid'));
    assert.isUndefined($input2.data('vv-valid'));
  });
});
