fixture.setBase('test/jquery/validateFieldset');
$(fixture.load('forms.html')).appendTo('body');


describe('Method validateFieldset()', function () {

  const $form = $('#validateFieldset1');
  const $input1_1 = $form.find('[name="user.name"]');
  const $input1_2 = $form.find('[name="user.email"]');
  const $input2_1 = $form.find('[name="creditcard.number"]');
  const $input2_2 = $form.find('[name="creditcard.cvc"]');

  $form.vulcanval({
    fieldsets: [{
      name: 'user',
      required: true,
      fields: ['user.name', 'user.email']
    }, {
      name: 'creditcard',
      required: true,
      fields: ['creditcard.number', 'creditcard.cvc']
    }],
    fields: [{
      name: 'user.name',
      validators: { isLength: { min: 4 } }
    }, {
      name: 'user.email',
      validators: { isEmail: true }
    }, {
      name: 'creditcard.number',
      validators: { isCreditCard: true }
    }, {
      name: 'creditcard.cvc',
      validators: { matches: /^[0-9]{3,4}$/ }
    }]
  });

  it('Validate parameters', function () {
    assert.throws(function () {
      $form.vulcanval('validateFieldset');
    });
    assert.throws(function () {
      $form.vulcanval('validateFieldset', 'unknown');
    });
  });

  it('Validate fields (valid)', function () {
    $input1_1.val('user name');
    $input1_2.val('mail@mail.com');
    $input2_2.val('123');
    $form.vulcanval('validateFieldset', 'user');
  });

  it('Valid fields (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1_1.hasClass('vv-field_error'));
    assert.isFalse($input1_2.hasClass('vv-field_error'));
    assert.isFalse($input2_1.hasClass('vv-field_error'));
    assert.isFalse($input2_2.hasClass('vv-field_error'));
  });

  it('Valid fields (state)', function () {
    assert.isUndefined($form.data('vv-valid'), 'form vv-valid should be undefined');
    assert.isTrue($input1_1.data('vv-valid'), 'input1_1 vv-valid should be true');
    assert.isTrue($input1_2.data('vv-valid'), 'input1_2 vv-valid should be true');
    assert.isUndefined($input2_1.data('vv-valid'), 'input2_1 vv-valid should be undefined');
    assert.isUndefined($input2_2.data('vv-valid'), 'input2_2 vv-valid should be undefined');
  });

  it('Validate fields (invalid)', function () {
    $input2_2.val('123');
    $form.vulcanval('validateFieldset', 'creditcard');
  });

  it('Invalid fields (class)', function () {
    assert.isTrue($form.hasClass('vv-form_error'));
    assert.isFalse($input1_1.hasClass('vv-field_error'));
    assert.isFalse($input1_2.hasClass('vv-field_error'));
    assert.isTrue($input2_1.hasClass('vv-field_error'));
    assert.isFalse($input2_2.hasClass('vv-field_error'));
  });

  it('Invalid fields (state)', function () {
    assert.isFalse($form.data('vv-valid'), 'form vv-valid should be false');
    assert.isTrue($input1_1.data('vv-valid'), 'input1_1 vv-valid should be true');
    assert.isTrue($input1_2.data('vv-valid'), 'input1_2 vv-valid should be true');
    assert.isFalse($input2_1.data('vv-valid'), 'input2_1 vv-valid should be false');
    assert.isTrue($input2_2.data('vv-valid'), 'input2_2 vv-valid should be true');
  });
});
