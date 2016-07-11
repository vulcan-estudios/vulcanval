(function () {

  const ensureLeadZero = val => {
    if (val.length === 1) return '0'+ val;
    return val;
  };

  $('form').vulcanval({

    enableNestedMaps: true,  // enable maps with nested objects
    disableHTML5Validation: true,  // adds "novalidate" attribute to form

    validators: {
      isMonth (value) {
        return this.validator.isInt(value, { min: 1, max: 12 });
      },
      isDay (value) {
        return this.validator.isInt(value, { min: 1, max: 31 });
      },
      isYear (value) {
        const max = (new Date()).getFullYear();
        return this.validator.isInt(value, { min: 1900, max });
      },
      isBirthdate (value) {
        const yyyy = this.get('birthdate.yyyy');
        const mm = this.get('birthdate.mm');
        const dd = this.get('birthdate.dd');
        const birthdate = yyyy +'-'+ ensureLeadZero(mm) +'-'+ ensureLeadZero(dd);
        return this.validator.isDate(birthdate) && this.validator.isBefore(birthdate);
      }
    },

    msgs: {
      isMonth: 'A valid month is required.',
      isDay: 'A valid day of month is required.',
      isYear: 'A valid year is required.',
      isBirthdate: 'The birthdate has to be previous the current date.'
    },

    fieldsets: [{
      name: 'birthdate',
      fields: 'birthdate',  // fields names start with this
      required: true,
      onlyIf: function () {
        // Only validate all of the birthdate fields if any of them has value
        return this.get('birthdate.mm') || this.get('birthdate.dd') || this.get('birthdate.yyyy');
      }
    }],

    fields: [{
      name: 'name',
      required: true,
      validators: {
        isAlphanumericText: true,
        isLength: { min: 4, max: 124 }
      }
    }, {
      name: 'email',
      required: true,
      validators: {
        isEmail: true,
        contains: '@gmail.com',
        isLength: { max: 124 }
      }
    }, {
      name: 'website',
      validators: {
        isURL: true,
        isLength: { max: 124 }
      }
    }, {
      name: 'age',
      disabled: true  // this won't be used at all
    }, {
      name: 'pass',
      required: true,
      validators: {
        matches: {  // matches a JavaScript RegExp
          pattern: /^[a-z0-9-_]*$/i,
          msgs: 'A valid password is required.'  // They need a custom message
        },
        isLength: { min: 8, max: 124 }
      }
    }, {
      name: 'pass2',
      onlyUI: true,  // this field won't be retrieved when "getMap" is called
      required: true,
      validators: {
        isEqualToField: 'pass'
      }
    }, {
      name: 'job',
      required: true
    }, {
      name: 'cooking'  // this will only be used to retrieve data from "getMap"
    }, {
      name: 'bio',
      validators: {
        isAlphanumericText: true,
        isLength: { max: 255 }
      }
    }, {
      name: 'birthdate.mm',
      validators: {
        isMonth: true
      }
    }, {
      name: 'birthdate.dd',
      validators: {
        isDay: true
      }
    }, {
      name: 'birthdate.yyyy',
      validators: {
        isYear: true,
        isBirthdate: true
      }
    }, {
      name: 'terms',
      required: true
    }]
  });

  $('#forceValidation').on('click', function (e) {
    $('form').vulcanval('validate');
  });

  $('#forceReset').on('click', function (e) {
    $('form').vulcanval('reset');
  });

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
