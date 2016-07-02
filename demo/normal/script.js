(function () {

  const ensureLeadZero = val => {
    if (val.length === 1) return '0'+ val;
    else return val;
  };

  $('form').vulcanval({

    disableHTML5Validation: true,

    validators: {
      isMonth (value) {
        return this.validator.isInt(value, { min: 1, max: 12 });
      },
      isDay (value) {
        return this.validator.isInt(value, { min: 1, max: 31 });
      },
      isYear (value) {
        return this.validator.isInt(value, { min: 1990 });
      },
      isBirthdate (value) {
        const birthdate = this.get('birthdate');
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
      namePattern: 'bd',
      required: true,
      onlyIf () {
        return this.get('bd-mm') || this.get('bd-dd') || this.get('bd-yyyy');
      }
    }],

    groups: [{
      name: 'birthdate',
      fields: ['bd-mm', 'bd-dd', 'bd-yyyy'],
      value (mm, dd, yyyy) {
        return ensureLeadZero(mm) +'-'+ ensureLeadZero(dd) +'-'+ yyyy;
      }
    }],

    fields: [{
      name: 'name',
      required: true,
      validations: {
        isAlphanumeric: true,
        isLength: { min: 4, max: 124 }
      }
    }, {
      name: 'email',
      required: true,
      validations: {
        isEmail: true,
        contains: '@gmail.com',
        isLength: { max: 124 }
      }
    }, {
      name: 'website',
      required: true,
      validations: {
        isURL: true,
        isLength: { max: 124 }
      }
    }, {
      name: 'age',
      disabled: true
    }, {
      name: 'pass',
      required: true,
      validations: {
        matches: /^[a-zA-Z0-9-_]$/,
        isLength: { min: 8, max: 124 }
      }
    }, {
      name: 'pass2',
      required: true,
      ignoreInMap: true,
      validations: {
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
      name: 'bd-mm',
      validators: {
        isMonth: true
      }
    }, {
      name: 'bd-dd',
      validators: {
        isDay: true
      }
    }, {
      name: 'bd-yyyy',
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
