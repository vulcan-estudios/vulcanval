require('./pre');


describe('Events (setEvents, change)', function () {

  describe('Autostart', function () {

    describe('Initial values', function () {

      const $form = $('#events5');
      const $input1 = $form.find('[name=email]');
      const $input2 = $form.find('[name=bio]');
      const $input3 = $form.find('[name=job]');

      $form.vulcanval({
        fields: [{
          name: 'email',
          required: true,
          validators: { isEmail: true }
        }, {
          name: 'bio',
          required: true,
          validators: { isLength: { min: 100 } }
        }, {
          name: 'job',
          required: true,
          validators: { isMongoId: true }
        }]
      });

      it('Class', function () {
        assert.isTrue($form.hasClass('vv-form_error'), 'form should have class vv-form_error');
        assert.isTrue($input1.hasClass('vv-field_error'), 'input1 should have class vv-field_error');
        assert.isTrue($input2.hasClass('vv-field_error'), 'input2 should have class vv-field_error');
        assert.isTrue($input3.hasClass('vv-field_error'), 'input3 should have class vv-field_error');
      });

      it('State', function () {
        assert.isFalse($form.data('vv-valid'));
        assert.isFalse($input1.data('vv-valid'));
        assert.isFalse($input2.data('vv-valid'));
        assert.isFalse($input3.data('vv-valid'));
      });
    });

    describe('Configured', function () {

      const $form = $('#events6');
      const $input1 = $form.find('[name=email]');
      const $input2 = $form.find('[name=bio]');
      const $input3 = $form.find('[name=job]');

      $form.vulcanval({
        autostart: true,
        fields: [{
          name: 'email',
          required: true,
          validators: { isEmail: true }
        }, {
          name: 'bio',
          required: true,
          validators: { isLength: { min: 100 } }
        }, {
          name: 'job',
          required: true,
          validators: { isMongoId: true }
        }]
      });

      it('Class', function () {
        assert.isTrue($form.hasClass('vv-form_error'), 'form should have class vv-form_error');
        assert.isTrue($input1.hasClass('vv-field_error'), 'input1 should have class vv-field_error');
        assert.isTrue($input2.hasClass('vv-field_error'), 'input2 should have class vv-field_error');
        assert.isTrue($input3.hasClass('vv-field_error'), 'input3 should have class vv-field_error');
      });

      it('State', function () {
        assert.isFalse($form.data('vv-valid'));
        assert.isFalse($input1.data('vv-valid'));
        assert.isFalse($input2.data('vv-valid'));
        assert.isFalse($input3.data('vv-valid'));
      });
    });
  });
});
