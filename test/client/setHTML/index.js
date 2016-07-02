const setHTML = require('../../../src/js/plugin/_setHTML');

fixture.setBase('test/client/setHTML');
$(fixture.load('forms.html')).appendTo('body');


describe('Set HTML', function () {

  const createSettings = ($form) => {
    return  {
      $form,
      classes: { defaults: {}, error: {} },
      fields: [{
        name: 'name',
        $el: $form.find('input'),
        display: '#'+ $form.attr('id') +'-name-display'
      }]
    };
  };

  describe('Form classes', function () {

    it('Intern enabled', function () {
      const $form = $('#setHTML1');
      const settings = createSettings($form);
      settings.intern = true;
      setHTML(settings);
      assert.isUndefined($form.attr('class'));
      assert.isUndefined($form.find('input').attr('class'));
    });

    it('Default classes', function () {
      const $form = $('#setHTML2');
      const settings = createSettings($form);
      setHTML(settings);
      assert.equal($form.attr('class'), 'vv-form');
    });

    it('User classes', function () {
      const $form = $('#setHTML3');
      const settings = createSettings($form);
      settings.classes.defaults = { form: 'user-form' };
      setHTML(settings);
      assert.equal($form.attr('class'), 'vv-form user-form');
    });
  });

  describe('Field classes', function () {

    it('Disabled enabled', function () {
      const $form = $('#setHTML4');
      const settings = createSettings($form);
      settings.fields[0].disabled = true;
      setHTML(settings);
      assert.isUndefined($form.find('input').attr('class'));
    });

    it('Intern enabled', function () {
      const $form = $('#setHTML5');
      const settings = createSettings($form);
      settings.fields[0].intern = true;
      setHTML(settings);
      assert.isUndefined($form.find('input').attr('class'));
    });

    describe('Default field and related classes', function () {
      const $form = $('#setHTML6');
      const settings = createSettings($form);
      setHTML(settings);

      it('Fields', function () {
        assert.isDefined(settings.fields[0].$el);
        assert.equal(settings.fields[0].$el.attr('class'), 'vv-field');
      });

      it('Labels', function () {
        assert.isDefined(settings.fields[0].$labels);
        assert.equal(settings.fields[0].$labels.attr('class'), 'vv-label');
      });

      it('Display', function () {
        assert.isDefined(settings.fields[0].$display);
        assert.equal(settings.fields[0].$display.attr('class'), 'vv-display');
      });
    });

    describe('Default field and related classes', function () {
      const $form = $('#setHTML7');
      const settings = createSettings($form);
      settings.classes.defaults = {
        field: 'user-field',
        label: 'user-label',
        display: 'user-display'
      };
      setHTML(settings);

      it('Fields', function () {
        assert.isDefined(settings.fields[0].$el);
        assert.equal(settings.fields[0].$el.attr('class'), 'vv-field user-field');
      });

      it('Labels', function () {
        assert.isDefined(settings.fields[0].$labels);
        assert.equal(settings.fields[0].$labels.attr('class'), 'vv-label user-label');
      });

      it('Display', function () {
        assert.isDefined(settings.fields[0].$display);
        assert.equal(settings.fields[0].$display.attr('class'), 'vv-display user-display');
      });
    });
  });
});
