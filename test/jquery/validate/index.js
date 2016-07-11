fixture.setBase('test/jquery/validate');
$(fixture.load('forms.html')).appendTo('body');


describe('Method validate()', function () {

  const $form = $('#validate1');
  const $input1 = $form.find('[name=name]');
  const $input2 = $form.find('[name=email]');

  $form.vulcanval({
    fields: [{
      name: 'name',
      validators: { isLength: { min: 4 } }
    }, {
      name: 'email',
      required: true,
      validators: { isEmail: true }
    }]
  });

  it('Validate fields (invalid)', function () {
    $form.vulcanval('validate');
  });

  it('Invalid fields (class)', function () {
    assert.isTrue($form.hasClass('vv-form_error'), 'form should have class vv-form_error');
    assert.isFalse($input1.hasClass('vv-field_error'), 'input1 should not have class vv-field_error');
    assert.isTrue($input2.hasClass('vv-field_error'), 'input2 should have class vv-field_error');
  });

  it('Invalid fields (state)', function () {
    assert.isFalse($form.data('vv-valid'));
    assert.isTrue($input1.data('vv-valid'));
    assert.isFalse($input2.data('vv-valid'));
  });

  it('Validate fields (valid)', function () {
    $input2.val('mail@mail.com');
    $form.vulcanval('validate');
  });

  it('Valid fields (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1.hasClass('vv-field_error'));
    assert.isFalse($input2.hasClass('vv-field_error'));
  });

  it('Valid fields (state)', function () {
    assert.isTrue($form.data('vv-valid'));
    assert.isTrue($input1.data('vv-valid'));
    assert.isTrue($input2.data('vv-valid'));
  });
});
