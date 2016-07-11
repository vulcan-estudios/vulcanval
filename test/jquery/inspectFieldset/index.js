fixture.setBase('test/jquery/inspectFieldset');
$(fixture.load('forms.html')).appendTo('body');


describe('Method inspectFieldset()', function () {

  const $form = $('#inspectFieldset1');
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

  let result;

  it('Should validate fieldset name', function () {
    assert.throws(function () {
      $form.vulcanval('inspectFieldset');
    });
    assert.throws(function () {
      $form.vulcanval('inspectFieldset', 'unknown');
    });
  });

  it('Valid fields in fieldset', function () {
    result = $form.vulcanval('inspectFieldset', 'user');
    assert.isFalse(result);
  });

  it('Invalid fields (part1)', function () {
    result = $form.vulcanval('inspectFieldset', 'creditcard');
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 1);
    assert.isString(result['creditcard.number']);
  });

  it('Invalid fields (part2)', function () {
    $form.find('[name="creditcard.cvc"]').val('wrong');
    result = $form.vulcanval('inspectFieldset', 'creditcard');
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 2);
    assert.isString(result['creditcard.number']);
    assert.isString(result['creditcard.cvc']);
  });
});
