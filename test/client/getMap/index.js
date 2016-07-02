describe('Method getMap()', function () {

  fixture.setBase('test/client/getMap');
  $(fixture.load('forms.html')).appendTo('body');
  const formData = fixture.load('forms.json');

  it('Get form data without instantiating the plugin', function () {
    const $form = $('#getMap1');
    Object.keys(formData).forEach(function (field) {
      $form.find('[name='+ field +']').val(formData[field]);
    });

    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, formData);
  });

  it('Get form data with basic plugin instance', function () {
    const $form = $('#getMap2');
    Object.keys(formData).forEach(function (field) {
      $form.find('[name='+ field +']').val(formData[field]);
    });
    $form.vulcanval();

    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, formData);
  });

  it('Get form data with boolean values and apparent nested maps', function () {
    const $form = $('#getMap3');
    const map = $form.vulcanval('getMap');
    const expected = {
      'user.name': 'romel',
      'user.email': 'mail@mail.com',
      check1: true,
      check2: false,
      check3: true
    };
    assert.deepEqual(map, expected);
  });

  it('Get form data as nested map', function () {
    const $form = $('#getMap4');
    const settings = {
      enableNestedMaps: true
    };
    $form.vulcanval(settings);
    const expected = {
      user: {
        name: 'romel',
        website: 'http://site.com',
        email: 'mail@mail.com',
        age: '22'
      },
      creditcard: {
        number: '123456',
        cvc: '123',
        exp: {
          month: '12',
          year: '1234'
        }
      }
    };
    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, expected);
  });

  it('Get form data with groups fields', function () {
    const $form = $('#getMap5');
    const settings = {
      fields: [{
        name: 'birthdate',
        value: function () {
          const y = this.get('year');
          const m = this.get('month');
          const d = this.get('day');
          return y +'-'+ m +'-'+ d;
        }
      }]
    };
    $form.vulcanval(settings);
    const expected = {
      name: 'romel',
      website: 'http://site.com',
      year: '1900',
      month: '12',
      day: '01',
      birthdate: '1900-12-01'
    };
    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, expected);
  });

  it('Get map with ignored fields', function () {
    const $form = $('#getMap6');
    const settings = {
      fields: [{
        name: 'website',
        ignoreInMap: true
      }, {
        name: 'age',
        ignoreInMap: true
      }]
    };
    $form.vulcanval(settings);
    const expected = {
      name: 'romel',
      email: 'mail@mail.com'
    };
    const map = $form.vulcanval('getMap');
    assert.deepEqual(map, expected);
  });
});
