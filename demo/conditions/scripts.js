(function () {

  $('form').vulcanval({
    disableHTML5Validation: true,
    fields: [{
      name: 'email',
      required: true,
      validators: {
        isEmail: true
      }
    }, {
      name: 'pass',
      required: true,
      // If this function returns true, the validation continues,
      // otherwise it halts.
      onlyIf: function () {
        // If the email is different than this one,
        // the validation is made.
        return this.get('email') !== 'admin@gmail.com';
      },
      validators: {
        isAlphanumeric: true,
        isLength: { min: 8, max: 16 }
      }
    }]
  });

})();
