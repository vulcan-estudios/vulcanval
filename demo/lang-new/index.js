(function () {

  const lang = {
    id: 'de',  // identifier
    msgs: {
      general: 'Bitte füllen Sie dieses Feld aus.',  // default message
      'isLength.min': 'Das Feld sollte mindestens {{min}} Zeichen enthalten.',
      'isLength.max': 'Das Feld sollte höchstens {{max}} Zeichen enthalten.',
      isEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      isInt: 'Bitte geben Sie eine gültige ganze Zahl ist.',
      isFloat: 'Bitte geben Sie eine gültige Nummer.',
      isURL: 'Bitte geben Sie eine gültige URL-Adresse.',
      isDate: 'Bitte geben Sie ein gültiges Datum.',
      // ...
      // the validator names in the package https://www.npmjs.com/package/validator
      // are available and your custom validator names
    }
  };

  // Install the language.
  vulcanval.extendLocale(lang);

  // Set as default language.
  vulcanval.setLocale('de');

  $('form').vulcanval();

})();
