(function () {

  $('form').vulcanval({
    disableHTML5Validation: true,
    fields: [{
      name: 'email',
      required: true,
      validators: {
        isEmail: true,
        isLength: { min: 4, max: 32 }
      }
    }, {
      name: 'pass',
      required: true,
      validators: {
        isAlphanumeric: true,
        isLength: { min: 4, max: 32 }
      }
    }]
  });

  // The display elements are where we show error messages and in this example,
  // for each field they are configured as HTML attributes.

})();
