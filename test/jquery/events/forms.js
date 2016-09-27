require('./pre');


describe('Events (setEvents, change)', function () {

  describe('Form', function () {

    const $form = $('#events1');
    $form.vulcanval({
      classes: {
        error: { form: 'user-form-err' }
      },
      fields: [{
        name: 'name',
        required: true,
        validators: { isAlphanumeric: true }
      }, {
        name: 'email',
        required: true,
        validators: { isEmail: true }
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
        assert.isString(info.msg, 'msg property as string');
        assert.isString(info.value, 'value property as string');
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
        expect(info).to.be.an.object;
        expect(info).to.have.property('name', 'name');
        expect(info).to.have.property('valid', null);
        expect(info).to.have.property('msg').to.be.falsy;
        expect(info).to.have.property('value').to.exist;
        done();
      });
      $form.trigger('reset');
    });

    it('After reset (class)', function () {
      expect($form.attr('class')).to.equal('vv-form');
    });

    it('Before reset (state)', function () {
      expect($form.data('vv-modified')).to.be.falsy;
      expect($form.data('vv-valid')).to.be.falsy;
    });
  });
});
