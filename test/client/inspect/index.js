fixture.setBase('test/client/inspect');
$(fixture.load('forms.html')).appendTo('body');


describe('Inspect', function () {

  const $form = $('#inspect1');
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

  it('Invalid fields (part1)', function () {
    result = $form.vulcanval('inspect');
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 1);
    assert.isString(result.creditcard);
  });

  it('Invalid fields (part2)', function () {
    $form.find('[name=email]').val('not email');
    result = $form.vulcanval('inspect');
    assert.isObject(result);
    assert.lengthOf(Object.keys(result), 2);
    assert.isString(result.creditcard);
    assert.isString(result.email);
  });

  it('Valid fields', function () {
    $form.find('[name=creditcard]').val('5486402460560345');
    $form.find('[name=email]').val('mail@mail.com');
    result = $form.vulcanval('inspect');
    assert.isFalse(result);
  });

  it('Valid field (part1)', function () {
    result = $form.vulcanval('inspect', 'email');
    assert.isFalse(result);
  });

  it('Valid field (part2)', function () {
    result = $form.vulcanval('inspect', 'creditcard');
    assert.isFalse(result);
  });

  it('Invalid field (part1)', function () {
    $form.find('[name=email]').val('invalid mail');
    result = $form.vulcanval('inspect', 'email');
    assert.isString(result);
  });

  it('Invalid field (part2)', function () {
    $form.find('[name=creditcard]').val('invalid credit card');
    result = $form.vulcanval('inspect', 'creditcard');
    assert.isString(result);
  });
});
