fixture.setBase('test/client/resetFieldset');
$(fixture.load('forms.html')).appendTo('body');


describe('Method resetFieldset()', function () {

  const $form = $('#resetFieldset1');
  const $input1_1 = $form.find('[name="user.name"]');
  const $input1_2 = $form.find('[name="user.email"]');
  const $input2_1 = $form.find('[name="creditcard.number"]');
  const $input2_2 = $form.find('[name="creditcard.cvc"]');

  $form.vulcanval({
    autostart: true,  // note the autostart
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

  it('Should validate fieldset name', function () {
    assert.throws(function () {
      $form.vulcanval('resetFieldset');
    });
    assert.throws(function () {
      $form.vulcanval('resetFieldset', 'unknown');
    });
  });

  it('Fields initialized with errors (class)', function () {
    assert.isTrue($form.hasClass('vv-form_error'));
    assert.isFalse($input1_1.hasClass('vv-field_error'));
    assert.isFalse($input1_2.hasClass('vv-field_error'));
    assert.isTrue($input2_1.hasClass('vv-field_error'));
    assert.isFalse($input2_2.hasClass('vv-field_error'));
  });

  it('Fields initialized with errors (state)', function () {
    assert.isFalse($form.data('vv-valid'), 'form vv-valid should be false');
    assert.isTrue($input1_1.data('vv-valid'), 'input1_1 vv-valid should be true');
    assert.isTrue($input1_2.data('vv-valid'), 'input1_2 vv-valid should be true');
    assert.isFalse($input2_1.data('vv-valid'), 'input2_1 vv-valid should be false');
    assert.isTrue($input2_2.data('vv-valid'), 'input2_2 vv-valid should be true');
  });

  it('Reset fields (part1)', function () {
    $form.vulcanval('resetFieldset', 'user');
  });

  it('Fieldset 1 reseted (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1_1.hasClass('vv-field_error'));
    assert.isFalse($input1_2.hasClass('vv-field_error'));
    assert.isTrue($input2_1.hasClass('vv-field_error'));
    assert.isFalse($input2_2.hasClass('vv-field_error'));
  });

  it('Fieldset 1 reseted (state)', function () {
    assert.isUndefined($form.data('vv-valid'), 'form vv-valid should be undefined');
    assert.isUndefined($input1_1.data('vv-valid'), 'input1_1 vv-valid should be undefined');
    assert.isUndefined($input1_2.data('vv-valid'), 'input1_2 vv-valid should be undefined');
    assert.isFalse($input2_1.data('vv-valid'), 'input2_1 vv-valid should be false');
    assert.isTrue($input2_2.data('vv-valid'), 'input2_2 vv-valid should be true');
  });

  it('Reset fields (part2)', function () {
    $form.vulcanval('resetFieldset', 'creditcard');
  });

  it('Fieldset 2 reseted (class)', function () {
    assert.isFalse($form.hasClass('vv-form_error'));
    assert.isFalse($input1_1.hasClass('vv-field_error'));
    assert.isFalse($input1_2.hasClass('vv-field_error'));
    assert.isFalse($input2_1.hasClass('vv-field_error'));
    assert.isFalse($input2_2.hasClass('vv-field_error'));
  });

  it('Fieldset 2 reseted (state)', function () {
    assert.isUndefined($form.data('vv-valid'), 'form vv-valid should be undefined');
    assert.isUndefined($input1_1.data('vv-valid'), 'input1_1 vv-valid should be undefined');
    assert.isUndefined($input1_2.data('vv-valid'), 'input1_2 vv-valid should be undefined');
    assert.isUndefined($input2_1.data('vv-valid'), 'input2_1 vv-valid should be undefined');
    assert.isUndefined($input2_2.data('vv-valid'), 'input2_2 vv-valid should be undefined');
  });
});
