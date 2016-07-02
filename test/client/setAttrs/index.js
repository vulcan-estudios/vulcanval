const setAttrs = require('../../../src/js/plugin/_setAttrs');

fixture.setBase('test/client/setAttrs');
$(fixture.load('forms.html')).appendTo('body');


describe('Set Attrs', function () {

  it('Form settings by default', function () {
    const $form = $('#setAttrs1');
    const $item = $('<div>');

    $item.appendTo('body');
    $item.html($form.clone());
    const raw = $item.html().replace(/\s{2,}/g, ' ').replace(/\n/g, '');

    const settings = { $form, fields: [] };
    setAttrs(settings);
    $item.html($form.clone());
    const edited = $item.html().replace(/\s{2,}/g, ' ').replace(/\n/g, '');

    assert.equal(edited, raw);
  });

  it('Form settings', function () {
    const $form = $('#setAttrs2');
    const settings = { $form, fields: [], disableHTML5Validation: true, disabled: true };
    setAttrs(settings);
    assert.isDefined($form.attr('disabled'));
    assert.isDefined($form.attr('novalidate'));
  });

  it('Field booleans', function () {
    const $form = $('#setAttrs3');
    const settings = {
      $form,
      fields: [{
        name: 'name',
        $el: $form.find('[name=name]'),
        disabled: true,
        required: true
      }]
    };
    setAttrs(settings);
    assert.isDefined($form.find('[name=name]').attr('required'));
    assert.isDefined($form.find('[name=name]').attr('disabled'));
  });

  it('Field lengths', function () {
    const $form = $('#setAttrs4');
    const settings = {
      $form,
      fields: [{
        name: 'name',
        $el: $form.find('[name=name]'),
        validators: { isLength: { min: 10, max: 20 } }
      }]
    };
    setAttrs(settings);
    assert.equal($form.find('[name=name]').attr('minlength'), '10');
    assert.equal($form.find('[name=name]').attr('maxlength'), '20');
  });

  it('Field matches', function () {
    const $form = $('#setAttrs5');
    const settings = {
      $form,
      fields: [{
        name: 'name',
        $el: $form.find('[name=name]'),
        validators: { matches: /ab[a-z]{1,4}cd/gi }  // regexp flags not supported
      }]
    };
    setAttrs(settings);
    assert.equal($form.find('[name=name]').attr('pattern'), 'ab[a-z]{1,4}cd');
  });

  it('Field min and max', function () {
    const $form = $('#setAttrs6');
    const settings = {
      $form,
      fields: [{
        name: 'name',
        $el: $form.find('[name=name]'),
        validators: { isFloat: { min: 2, max: 4 } }
      }]
    };
    setAttrs(settings);
    assert.equal($form.find('[name=name]').attr('min'), '2');
    assert.equal($form.find('[name=name]').attr('max'), '4');
  });
});
