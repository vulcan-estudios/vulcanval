fixture.setBase('test/client/setEvents');
$(fixture.load('forms.html')).appendTo('body');


describe('Set Events', function () {

  describe('Form', function () {

    const $form = $('#setEvents1');
    $form.vulcanval({
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

    it('Submit', function (done) {
      var tried = false;
      $form.find('[name=name]').on('vv-modify', function (e, info) {
        if (tried) return;
        tried = true;
        assert.isObject(info);
        assert.propertyVal(info, 'name', 'name');
        assert.propertyVal(info, 'valid', false);
        assert.isDefined(info.msg);
        assert.isDefined(info.value);
        done();
      });
      $form.trigger('submit');
    });

    // After trying to submit.
    it('Reset', function (done) {
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
  });

  describe('Fields', function () {

    const $form = $('#setEvents2');
    $form.vulcanval({
      firstValidationEvent: 'blur',
      validationEvents: 'change',
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
    const $input = $form.find('[name=name]');

    it('On first change event not enabled', function () {
      assert.isUndefined($input.data('vv-valid'));
      assert.isUndefined($input.data('vv-modified'));
      $input.trigger('change');
      assert.isUndefined($input.data('vv-valid'));
      assert.isUndefined($input.data('vv-modified'));
    });

    it('On first change event', function () {
      $input.trigger('blur');
      assert.isFalse($input.data('vv-valid'));
      assert.isTrue($input.data('vv-modified'));
    });

    it('On normal change', function () {
      $input.val('validvalue');
      $input.trigger('change');
      assert.isTrue($input.data('vv-valid'));
      assert.isTrue($input.data('vv-modified'));
    });
  });
});
