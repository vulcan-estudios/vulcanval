const browser = require('../browser');

const lang = {
  id: 'en',
  msgs: {
    general: 'Please fill out this field.',
    isEqualToField: 'The field has to be the same.',
    isAlphanumericText: 'Please type only alphanumeric text.',
    'isLength.min': 'The field should contain at least {{min}} characters.',
    'isLength.max': 'The field should contain at most {{max}} characters.',
    contains: 'This field should contain the text "{{option}}".',
    equals: 'This field should be equal to "{{option}}".',
    isAlpha: 'This field should only contain letters.',
    isAlphanumeric: 'Please type only alphanumeric characters.',
    isBoolean: 'This field should be boolean.',
    isCreditCard: 'Please type a valid credit card number.',
    isCurrency: 'Please type a valid currency amount.',
    isDate: 'Please type a valid date.',
    isDecimal: 'Please type a valid decimal number.',
    isDivisibleBy: 'The number should be divisible by {{option}}.',
    isEmail: 'Please type a valid email address.',
    isFQDN: 'Please type a fully qualified domain name (e.g. domain.com).',
    isFloat: 'Please type a valid number.',
    isHexColor: 'Please type a valid hexadecimal color.',
    isHexadecimal: 'Please type a valid hexadecimal number.',
    isIP: 'Please type a valid IP address (version 4 or 6).',
    isISBN: 'Please type a valid ISBN (version 10 or 13).',
    isISIN: 'Please type a valid ISIN (International Securities Identification Number).',
    isISO8601: 'Please type a valid date.',
    isInt: 'Please type a valid integer number.',
    isJSON: 'Please type a valid JSON string.',
    isLowercase: 'This field should only contain lowercase text.',
    isMobilePhone: 'Please type a valid mobile phone number.',
    isNumeric: 'Please type a valid number.',
    isURL: 'Please type a valid URL address.',
    isUppercase: 'This field should only contain uppercase text.',
  }
};

module.exports = lang;