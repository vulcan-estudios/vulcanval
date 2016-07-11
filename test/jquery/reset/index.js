fixture.setBase('test/jquery/reset');
$(fixture.load('forms.html')).appendTo('body');


describe('Method reset()', function () {

  const $form = $('#reset1');

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
    $form.vulcanval('reset');
  });

  it('Fields reseted (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isTrue($form.find('input[class*=_error]').length === 0);
  });

  it('Fields reseted (state)', function () {
    assert.isUndefined($form.data('vv-valid'));
    $form.find('input').each((i, inp) => {
      assert.isUndefined($(inp).data('vv-valid'));
    });
  });
});
