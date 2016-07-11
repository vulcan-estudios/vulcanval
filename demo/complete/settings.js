(function () {

  const settings = {
    disableHTML5Validation: true,
    fields: [{
      name: 'email',
      required: true,
      validators: {
        isEmail: true,
        isLength: { min: 4, max: 124 }
      }
    }, {
      name: 'pass',
      required: true,
      validators: {
        isAlphanumeric: true,
        isLength: { min: 4, max: 124 }
      }
    }]
  };

  // A trick to share this script between client and server side.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = settings;
  } else {
    window.settings = settings;
  }

})();
