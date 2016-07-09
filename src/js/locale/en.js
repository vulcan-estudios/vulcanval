const browser = require('../browser');

const lang = {
  id: 'en',
  msgs: {
    general: 'Please fill out this field.',
    isEqualToField: 'The field has to be the same.',
    isAlphanumericText: 'Please type only alphanumeric text.',
    'isLength.min': 'The field should contain at least {{min}} characters.',
    'isLength.max': 'The field should contain at most {{max}} characters.',
    isEmail: 'Please type a valid email address.',
    isNumeric: 'Please type a valid number.',
    isFloat: 'Please type a valid number.',
    isInt: 'Please type a valid integer number.',
    isURL: 'Please type a valid URL address.',
    isDate: 'Please type a valid date.',
    contains: 'This field should contain the text "{{option}}".',
    isAlphanumeric: 'Please type only alphanumeric characters.',
    isCreditCard: 'Please type a valid credit card number.',
    isLowercase: 'This field should only contain lowercase text.',
    isUppercase: 'This field should only contain uppercase text.',
    isDivisibleBy: 'The number should be divisible by {{option}}.',
    isBoolean: 'This field should be boolean.',
  }
};

module.exports = lang;
