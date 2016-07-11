const fetchUISettings = require('../../../src/js/jquery/_fetchUISettings');

fixture.setBase('test/jquery/fetchUISettings');
$(fixture.load('forms.html')).appendTo('body');


describe('Fetch UI Settings', function () {

  it('Extract form by default', function () {
    const $el = $('#fetchUISettings1');
    const $fields = $el.find('input');
    const settings = fetchUISettings($el, $fields);
    const expected = {};

    delete settings.fields;
    assert.deepEqual(expected, settings);
  });

  it('Extract form boolean settings (part1)', function () {
    const $el = $('#fetchUISettings2');
    const $fields = $el.find('input');
    const settings = fetchUISettings($el, $fields);
    const expected = {
      disabled: true,
      disableHTML5Validation: true
    };

    delete settings.fields;
    assert.deepEqual(expected, settings);
  });

  it('Extract form boolean settings (part2)', function () {
    const $el = $('#fetchUISettings3');
    const $fields = $el.find('input');
    const settings = fetchUISettings($el, $fields);
    const expected = {
      intern: true,
      autostart: true
    };

    delete settings.fields;
    assert.deepEqual(expected, settings);
  });

  it('Extract form locale', function () {
    const $el = $('#fetchUISettings4');
    const $fields = $el.find('input');
    const settings = fetchUISettings($el, $fields);
    const expected = {
      locale: 'es'
    };

    delete settings.fields;
    assert.deepEqual(expected, settings);
  });

  describe('Extract field settings', function () {

    it('Field without settings', function () {
      const $el = $('#fetchUISettings5');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const expected = {};

      assert.isArray(settings.fields);
      assert.lengthOf(settings.fields, 1);
      delete settings.fields[0].name;
      delete settings.fields[0].$el;
      assert.deepEqual(expected, settings.fields[0]);
    });

    it('Boolean properties (part1)', function () {
      const $el = $('#fetchUISettings6');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);

      assert.isTrue(settings.fields[0].disabled);
      assert.isTrue(settings.fields[0].required);
    });

    it('Boolean properties (part2)', function () {
      const $el = $('#fetchUISettings7');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);

      assert.isTrue(settings.fields[0].intern);
      assert.isTrue(settings.fields[0].autostart);
    });

    it('Display property', function () {
      const $el = $('#fetchUISettings8');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);

      assert.equal(settings.fields[0].display, '#selector');
    });

    it('minlength', function () {
      const $el = $('#fetchUISettings9');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isLength: { min: 10 } });
    });

    it('maxlength', function () {
      const $el = $('#fetchUISettings10');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isLength: { max: 70 } });
    });

    it('Input type number', function () {
      const $el = $('#fetchUISettings11');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isFloat: true });
    });

    it('Input type number, min and max', function () {
      const $el = $('#fetchUISettings12');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isFloat: { min: 4, max: 8 } });
    });

    it('Input type email', function () {
      const $el = $('#fetchUISettings13');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isEmail: true });
    });

    it('Input type url', function () {
      const $el = $('#fetchUISettings14');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isURL: true });
    });

    it('Input type datetime', function () {
      const $el = $('#fetchUISettings15');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.deepEqual(validators, { isDate: true });
    });

    it('Input pattern', function () {
      const $el = $('#fetchUISettings16');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.instanceOf(validators.matches, RegExp);
    });

    it('Input pattern with message', function () {
      const $el = $('#fetchUISettings17');
      const $fields = $el.find('input');
      const settings = fetchUISettings($el, $fields);
      const validators = settings.fields[0].validators;

      assert.instanceOf(validators.matches.pattern, RegExp);
      assert.isString(validators.matches.msgs);
    });
  });
});
