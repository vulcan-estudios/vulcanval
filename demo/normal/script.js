(function () {

  const ensureLeadZero = val => {
    if (val.length === 1) return '0'+ val;
    return val;
  };

  const validateBirthdate = function () {
    return this.get('birthdate.mm') || this.get('birthdate.dd') || this.get('birthdate.yyyy');
  };

  $('form').vulcanval({

    enableNestedMaps: true,
    disableHTML5Validation: true,

    validators: {
      isMonth (value) {
        return this.validator.isInt(value, { min: 1, max: 12 });
      },
      isDay (value) {
        return this.validator.isInt(value, { min: 1, max: 31 });
      },
      isYear (value) {
        const max = (new Date()).getFullYear();
        return this.validator.isInt(value, { min: 1990, max });
      },
      isBirthdate (value) {
        const yyyy = this.get('birthdate.yyyy');
        const mm = this.get('birthdate.mm');
        const dd = this.get('birthdate.dd');
        const birthdate = yyyy +'-'+ mm +'-'+ dd;
        return this.validator.isDate(birthdate) && this.validator.isBefore(birthdate);
      }
    },

    msgs: {
      isMonth: 'A valid month is required.',
      isDay: 'A valid day of month is required.',
      isYear: 'A valid year is required.',
      isBirthdate: 'The birthdate has to be previous the current date.'
    },

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
      required: true,
      validators: {
        isURL: true,
        isLength: { max: 124 }
      }
    }, {
      name: 'age',
      disabled: true
    }, {
      name: 'pass',
      required: true,
      validators: {
        matches: {
          pattern: /^[a-z0-9-_]*$/i,
          msgs: 'A valid password is required.'
        },
        isLength: { min: 8, max: 124 }
      }
    }, {
      name: 'pass2',
      onlyUI: true,
      required: true,
      validators: {
        isEqualToField: 'pass'
      }
    }, {
      name: 'job'
    }, {
      name: 'bio',
      validators: {
        isAlphanumeric: true,
        isLength: { max: 255 }
      }
    }, {
      name: 'birthdate.mm',
      required: true,
      onlyIf: validateBirthdate,
      validators: {
        isMonth: true
      }
    }, {
      name: 'birthdate.dd',
      required: true,
      onlyIf: validateBirthdate,
      validators: {
        isDay: true
      }
    }, {
      name: 'birthdate.yyyy',
      required: true,
      onlyIf: validateBirthdate,
      validators: {
        isYear: true,
        isBirthdate: true
      }
    }, {
      name: 'terms',
      required: true
    }]
  });

})();
