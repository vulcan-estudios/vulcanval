fixture.setBase('test/client/reset');
$(fixture.load('forms.html')).appendTo('body');


describe('Reset', function () {

  describe('All fields', function () {

    const $form = $('#reset1');
    $form.vulcanval({
      fields: [{
        name: 'name',
        required: true
      }, {
        name: 'email',
        required: true
      }]
    });
    $form.vulcanval('validate');

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

  describe('Specific field', function () {

    const $form = $('#reset2');
    const $input1 = $form.find('[name=name]');
    const $input2 = $form.find('[name=email]');
    $form.vulcanval({
      fields: [{
        name: 'name',
        required: true
      }, {
        name: 'email',
        required: true
      }]
    });
    $form.vulcanval('validate');

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
      $form.vulcanval('reset', 'email');
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
});
