fixture.setBase('test/client/events');
$(fixture.load('forms.html')).appendTo('body');


describe('Events', function () {

  describe('Form', function () {

    const $form = $('#events1');
    $form.vulcanval({
      classes: {
        error: {
          form: 'user-form-err'
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

    it('Before submit (class)', function () {
      assert.equal($form.attr('class'), 'vv-form');
    });

    it('Before submit (state)', function () {
      assert.isUndefined($form.data('vv-modified'));
      assert.isUndefined($form.data('vv-valid'));
    });

    it('Submit (event)', function (done) {
      var tried = false;
      $form.find('[name=name]').on('vv-modify', function (e, info) {
        if (tried) return;
        tried = true;
        assert.isObject(info);
        assert.propertyVal(info, 'name', 'name');
        assert.propertyVal(info, 'valid', false);
        assert.isString(info.msg);
        assert.isString(info.value);
        done();
      });
      $form.trigger('submit');
    });

    it('After submit (class)', function () {
      assert.equal($form.attr('class'), 'vv-form vv-form_error user-form-err');
    });

    it('Before submit (state)', function () {
      assert.isTrue($form.data('vv-modified'));
      assert.isFalse($form.data('vv-valid'));
    });

    it('Reset (event)', function (done) {
      var tried = false;
      $form.find('[name=name]').on('vv-modify', function (e, info) {
        if (tried) return;
        tried = true;
        assert.isObject(info);
        assert.propertyVal(info, 'name', 'name');
        assert.propertyVal(info, 'valid', void 0);
        assert.isUndefined(info.msg);
        assert.isDefined(info.value);
        done();
      });
      $form.trigger('reset');
    });

    it('After reset (class)', function () {
      assert.equal($form.attr('class'), 'vv-form');
    });

    it('Before reset (state)', function () {
      assert.isUndefined($form.data('vv-modified'));
      assert.isUndefined($form.data('vv-valid'));
    });
  });

  describe('Fields', function () {

    const $form = $('#events2');
    $form.vulcanval({
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
    const $labels1 = $form.find('label[for=events2-name]');
    const $display1 = $form.find('#events2-name-dis');

    const $input2 = $form.find('[name=email]');
    const $labels2 = $form.find('label[for=events2-email]');
    const $display2 = $form.find('#events2-email-dis');

    var input1Info;
    var input1Modified = false;
    var input2Modified = false;
    $form.on('vv-modify', function (e, info) {
      if (e.target === $input1[0]) {
        input1Modified = true;
        input1Info = info;
      }
      if (e.target === $input2[0]) {
        input2Modified = true;
      }
    });

    it('Before changes (class)', function () {
      assert.equal($form.attr('class'), 'vv-form');

      assert.equal($input1.attr('class'), 'vv-field');
      assert.equal($labels1.attr('class'), 'vv-label');
      assert.equal($display1.attr('class'), 'vv-display');

      assert.equal($input2.attr('class'), 'vv-field');
      assert.equal($labels2.attr('class'), 'vv-label');
      assert.equal($display2.attr('class'), 'vv-display');
    });

    it('Before changes (state)', function () {
      assert.isUndefined($input1.data('vv-valid'));
      assert.isUndefined($input1.data('vv-modified'));
      assert.isUndefined($input1.data('vv-msg'));

      assert.isUndefined($input2.data('vv-valid'));
      assert.isUndefined($input2.data('vv-modified'));
      assert.isUndefined($input2.data('vv-msg'));
    });

    it('On normal change', function () {
      $input1.trigger('custom2');
    });

    it('On normal change (class)', function () {
      assert.equal($form.attr('class'), 'vv-form');

      assert.equal($input1.attr('class'), 'vv-field');
      assert.equal($labels1.attr('class'), 'vv-label');
      assert.equal($display1.attr('class'), 'vv-display');

      assert.equal($input2.attr('class'), 'vv-field');
      assert.equal($labels2.attr('class'), 'vv-label');
      assert.equal($display2.attr('class'), 'vv-display');
    });

    it('On normal change (state)', function () {
      assert.isUndefined($input1.data('vv-valid'));
      assert.isUndefined($input1.data('vv-modified'));
      assert.isUndefined($input1.data('vv-msg'));

      assert.isUndefined($input2.data('vv-valid'));
      assert.isUndefined($input2.data('vv-modified'));
      assert.isUndefined($input2.data('vv-msg'));
    });

    it('On normal change (event)', function () {
      assert.isFalse(input1Modified);
      assert.isFalse(input2Modified);
    });

    it('On first change (error)', function () {
      $input1.trigger('custom1');
    });

    it('On first change (class - error)', function () {
      assert.equal($form.attr('class'), 'vv-form vv-form_error form-err');

      assert.equal($input1.attr('class'), 'vv-field vv-field_error field-err');
      assert.equal($labels1.attr('class'), 'vv-label vv-label_error label-err');
      assert.equal($display1.attr('class'), 'vv-display vv-display_error display-err');

      assert.equal($input2.attr('class'), 'vv-field');
      assert.equal($labels2.attr('class'), 'vv-label');
      assert.equal($display2.attr('class'), 'vv-display');
    });

    it('On first change (state - error)', function () {
      assert.isFalse($input1.data('vv-valid'));
      assert.isTrue($input1.data('vv-modified'));
      assert.isString($input1.data('vv-msg'));

      assert.isUndefined($input2.data('vv-valid'));
      assert.isUndefined($input2.data('vv-modified'));
      assert.isUndefined($input2.data('vv-msg'));
    });

    it('On first change (event - error)', function () {
      assert.isTrue(input1Modified);
      assert.isObject(input1Info);
      assert.propertyVal(input1Info, 'name', 'name');
      assert.propertyVal(input1Info, 'value', '');
      assert.propertyVal(input1Info, 'valid', false);
      assert.isString(input1Info.msg);

      assert.isFalse(input2Modified);
    });

    it('On normal change', function () {
      $input1.val('validvalue').trigger('custom2');
    });

    it('On normal change (class)', function () {
      assert.equal($form.attr('class'), 'vv-form');

      assert.equal($input1.attr('class'), 'vv-field');
      assert.equal($labels1.attr('class'), 'vv-label');
      assert.equal($display1.attr('class'), 'vv-display');

      assert.equal($input2.attr('class'), 'vv-field');
      assert.equal($labels2.attr('class'), 'vv-label');
      assert.equal($display2.attr('class'), 'vv-display');
    });

    it('On normal change (state)', function () {
      assert.isTrue($input1.data('vv-valid'));
      assert.isTrue($input1.data('vv-modified'));
      assert.isNotOk($input1.data('vv-msg'));

      assert.isUndefined($input2.data('vv-valid'));
      assert.isUndefined($input2.data('vv-modified'));
      assert.isUndefined($input2.data('vv-msg'));
    });

    it('On normal change (event)', function () {
      assert.isTrue(input1Modified);
      assert.isObject(input1Info);
      assert.propertyVal(input1Info, 'name', 'name');
      assert.propertyVal(input1Info, 'value', 'validvalue');
      assert.propertyVal(input1Info, 'valid', true);
      assert.isNotOk(input1Info.msg);

      assert.isFalse(input2Modified);
    });
  });

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

  describe('Field intern enabled', function () {

    const $form = $('#events4');
    $form.vulcanval({
      firstValidationEvent: 'custom1',
      validationEvents: 'custom2',
      fields: [{
        name: 'name',
        intern: true,
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
    const $labels1 = $form.find('label[for=events4-name]');
    const $display1 = $form.find('#events4-name-dis');

    const $input2 = $form.find('[name=email]');
    const $labels2 = $form.find('label[for=events4-email]');
    const $display2 = $form.find('#events4-email-dis');

    it('Element classes before changes', function () {
      assert.isString($form.attr('class'));

      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));

      assert.isString($input2.attr('class'));
      assert.isString($labels2.attr('class'));
      assert.isString($display2.attr('class'));
    });

    it('Normal change unlistened', function () {
      $input1.trigger('custom2');
    });

    it('Element classes after normal change unlistened', function () {
      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));
    });

    it('First change (error)', function () {
      $input1.trigger('custom1');
    });

    it('Element classes after first change (error)', function () {
      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));
    });

    it('Normal change (valid)', function () {
      $input1.val('validvalue').trigger('custom2');
    });

    it('Element classes after normal change (valid)', function () {
      assert.isUndefined($input1.attr('class'));
      assert.isUndefined($labels1.attr('class'));
      assert.isUndefined($display1.attr('class'));
    });
  });
});
