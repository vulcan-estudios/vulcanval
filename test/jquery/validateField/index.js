fixture.setBase('test/jquery/validateField');
$(fixture.load('forms.html')).appendTo('body');


describe('Method validateField()', function () {

  const $form = $('#validateField1');
  const $input1 = $form.find('[name=name]');
  const $input2 = $form.find('[name=email]');

  $form.vulcanval({
    fields: [{
      name: 'name',
      validators: {
        isLength: { min: 4 }
      }
    }, {
      name: 'email',
      required: true,
      validators: {
        isEmail: true
      }
    }]
  });

  it('Validate parameters', function () {
    assert.throws(function () {
      $form.vulcanval('validateField');
    });
    assert.throws(function () {
      $form.vulcanval('validateField', 'unknown');
    });
  });

  it('Validate field (invalid)', function () {
    $input2.val('invalid');
    $form.vulcanval('validateField', 'email');
  });

  it('Invalid field (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1.hasClass('vv-field_error'));
    assert.isTrue($input2.hasClass('vv-field_error'));
  });

  it('Invalid field (state)', function () {
    assert.isUndefined($form.data('vv-valid'));
    assert.isUndefined($input1.data('vv-valid'));
    assert.isFalse($input2.data('vv-valid'));
  });

  it('Validate field (valid)', function () {
    $input2.val('mail@mail.com');
    $form.vulcanval('validateField', 'email');
  });

  it('Valid field (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1.hasClass('vv-field_error'));
    assert.isFalse($input2.hasClass('vv-field_error'));
  });

  it('Valid field (state)', function () {
    assert.isUndefined($form.data('vv-valid'));
    assert.isUndefined($input1.data('vv-valid'));
    assert.isTrue($input2.data('vv-valid'));
  });
});
