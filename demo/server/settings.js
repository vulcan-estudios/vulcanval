module.exports = {
  locale: 'es',  // set language
  enableNestedMaps: true,  // treat data maps as nested objects
  fields: [{
    // the same "user.name" in a nested maps will be in the map as:
    // { user: { name: <value>, ... }, ... }
    // The point is the delimitator
    name: 'user.name',
    required: true,
    validators: {
      isAlphanumericText: 'es-ES',
      isLength: { min: 2, max: 124 }
    }
  }, {
    name: 'user.age',
    validators: {
      isInt: { min: 1, max: 500 }
    }
  }, {
    name: 'user.married',
    validators: {
      isBoolean: true
    }
  }, {
    name: 'creditcard.number',
    validators: {
      isCreditCard: true
    }
  }, {
    name: 'creditcard.ccv',
    required: true,
    onlyIf () {
      // only validate if there is a credit card number
      return !!this.get('creditcard.number');
    },
    validators: {
      matches: {
        pattern: /^[0-9]{3,4}$/,  // match a JavaScript RegExp
        msgs: 'Un número de seguridad de tarjeta de crédito es requerido.'  // with custom message
      }
    }
  }]
};
