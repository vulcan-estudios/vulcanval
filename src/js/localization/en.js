const utils = require('../utils');

const lang = {
  id: 'en',
  msgs: {
    general: 'Please fill out this field.',
    isEqual: 'The field has to be the same.',
    isLength: {
      min: 'The field should contain at least {{min}} characters.',
      max: 'The field should contain at most {{max}} characters.'
    },
    isEmail: 'Please type a valid email address.',
    isNumeric: 'Please type a valid number.',
    isInt: 'Please type a valid integer number.',
    isURL: 'Please type a valid URL address.',
    isDate: 'Please type a valid date.',
    contains: 'This field should contain the text "{{option}}".',
    isAlphanumeric: 'Please type only alfanumeric characters.',
    isCreditCard: 'Please type a valid credit card number.',
    isLowercase: 'This field should only contain lowercase text.',
    isUppercase: 'This field should only contain uppercase text.',
    isDivisibleBy: 'The number should be divisible by {{option}}.',
  }
};

utils.performInBrowser(true, function () {
  vulcanval.extendLocale(lang);
  vulcanval.setLocale(lang.id);
});

module.exports = lang;
