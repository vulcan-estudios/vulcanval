require('./pre');


describe('Events (setEvents, change)', function () {

  describe('Form intern enabled', function () {

    const $form = $('#events3');
    $form.vulcanval({
      intern: true,
      firstValidationEvent: 'custom1',
      validationEvents: 'custom2',
      classes: {
        error: {
          form: 'form-err',
          field: 'field-err',
          label: 'label-err',
          display: 'display-err'
        }
      },
      fields: [{
        name: 'name',
        required: true,
        validators: {
          isAlphanumeric: true
        }
      }, {
        name: 'email',
        required: true,
        validators: {
          isEmail: true
        }
      }]
    });

    const $input1 = $form.find('[name=name]');
    const $labels1 = $form.find('label[for=events3-name]');
    const $display1 = $form.find('#events3-name-dis');

    const $input2 = $form.find('[name=email]');
    const $labels2 = $form.find('label[for=events3-email]');
    const $display2 = $form.find('#events3-email-dis');

    it('Element classes before changes', function () {
      assert.isUndefined($form.attr('class'));

      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));

      assert.isUndefined($input2.attr('class'));
      assert.isUndefined($labels2.attr('class'));
      assert.isUndefined($display2.attr('class'));
    });

    it('Normal change unlistened', function () {
      $input1.trigger('custom2');
    });

    it('Element classes after normal change unlistened', function () {
      assert.isUndefined($form.attr('class'));

      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));

      assert.isUndefined($input2.attr('class'));
      assert.isUndefined($labels2.attr('class'));
      assert.isUndefined($display2.attr('class'));
    });

    it('First change (error)', function () {
      $input1.trigger('custom1');
    });

    it('Element classes after first change (error)', function () {
      assert.isUndefined($form.attr('class'));

      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));

      assert.isUndefined($input2.attr('class'));
      assert.isUndefined($labels2.attr('class'));
      assert.isUndefined($display2.attr('class'));
    });

    it('Normal change (valid)', function () {
      $input1.val('validvalue').trigger('custom2');
    });

    it('Element classes after normal change (valid)', function () {
      assert.isUndefined($form.attr('class'));

      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));

      assert.isUndefined($input2.attr('class'));
      assert.isUndefined($labels2.attr('class'));
      assert.isUndefined($display2.attr('class'));
    });
  });
});
