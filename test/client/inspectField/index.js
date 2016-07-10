fixture.setBase('test/client/inspectField');
$(fixture.load('forms.html')).appendTo('body');


describe('Method inspectField()', function () {

  const $form = $('#inspectField1');
  $form.vulcanval({
    fields: [{
      name: 'creditcard',
      required: true,
      validators: {
        isCreditCard: true
      }
    }, {
      name: 'email',
      validators: {
        isEmail: true
      }
    }]
  });

  let result;

  it('Should validate field name', function () {
    assert.throws(function () {
      $form.vulcanval('inspectField');
    });
    assert.throws(function () {
      $form.vulcanval('inspectField', 'unknown');
    });
  });

  it('Valid field (part1)', function () {
    result = $form.vulcanval('inspectField', 'email');
    assert.isFalse(result);
  });

  it('Valid field (part2)', function () {
    result = $form.vulcanval('inspectField', 'creditcard');
    assert.isFalse(result);
  });

  it('Invalid field (part1)', function () {
    $form.find('[name=email]').val('invalid mail');
    result = $form.vulcanval('inspectField', 'email');
    assert.isString(result);
  });

  it('Invalid field (part2)', function () {
    $form.find('[name=creditcard]').val('invalid credit card');
    result = $form.vulcanval('inspectField', 'creditcard');
    assert.isString(result);
  });
});
