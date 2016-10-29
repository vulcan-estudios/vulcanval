(function () {

  const $form = $('form');
  const formState = {
    current: 'user'
  };

  //
  // VALIDATION CONFIGURATION
  //

  $form.vulcanval({

    disableHTML5Validation: true,  // disable HTML5 form validation, only use the plugin
    enableNestedMaps: true,  // enable data form as a nested object when "getMap" is called

    fieldsets: [{
      name: 'user',    // identifier of fieldset
      fields: 'user',  // all fields with name starting with this, are part of this fieldset
      required: true,  // this will be applyed to all fields in this fieldset
      validators: {    // this will be applyed to all fields in this fieldset, too
        isLength: { max: 255 }
      }
    }, {
      name: 'creditcard',
      fields: 'creditcard',
      required: true,
      validators: {
        isLength: { max: 255 }
      }
    }],

    fields: [{
      name: 'user.name',
      validators: {
        isAlphanumericText: true
      }
    }, {
      name: 'user.email',
      validators: {
        isEmail: true
      }
    }, {
      name: 'user.pass',
      validators: {
        isAlphanumeric: true,
        isLength: { min: 8 }
      }
    }, {
      name: 'creditcard.number',
      validators: {
        isCreditCard: true
      }
    }, {
      name: 'creditcard.cvc',
      validators: {
        matches: {
          pattern: /^[0-9]{3,4}$/,
          msgs: 'A valid security code is required.'
        }
      }
    }, {
      name: 'creditcard.expdate.month',
      validators: {
        isInt: { min: 1, max: 12 }
      }
    }, {
      name: 'creditcard.expdate.year',
      validators: {
        isInt: { min: (new Date()).getFullYear(), max: (new Date()).getFullYear()+10 }
      }
    }]

  });

  //
  // FIELDSETS SWITCHING
  //

  const changeFieldset = function (name) {
    $('.register-fieldset').removeClass('register-fieldset_shown');
    $('.register-fieldset[name='+ name +']').addClass('register-fieldset_shown');
    formState.current = name;
  };

  const resetFieldset = function (id) {
    $form.vulcanval('resetFieldset', id);
  };

  // Inspect and validate only a fieldset
  const validateFieldset = function (id) {
    const invalid = $form.vulcanval('inspectFieldset', id);
    if (invalid) {
      $form.vulcanval('validateFieldset', id);
      return false;
    }
    return true;
  };

  changeFieldset(formState.current);

  $('.register-next').on('click', function (e) {
    const current = $(this).data('current');
    const to = $(this).data('to');
    const isValid = validateFieldset(current);
    if (isValid) {
      changeFieldset(to);
    }
  });

  $('.register-back').on('click', function (e) {
    const to = $(this).data('to');
    changeFieldset(to);
  });

  $('.register-reset').on('click', function (e) {
    const id = $(this).data('id');
    resetFieldset(id);
  });

  //
  // UTILITIES
  //

  $('#inspect').on('click', function (e) {
    const inspection = $('form').vulcanval('inspect');
    console.log('inspection:', inspection);
    $('#inspection').html(JSON.stringify(inspection));
  });

  $('#getMap').on('click', function (e) {
    const map = $('form').vulcanval('getMap');
    console.log('map:', map);
    $('#map').html(JSON.stringify(map));
  });

})();
