require('./pre');

const chai =        require('chai');
const extend =      require('extend');
const vulcanval =   require('../../src/js/main');
const utils =       require('../../src/js/utils');
const localeEN =    require('../../src/js/localization/en');
const localeES =    require('../../src/js/localization/es');


const assert = chai.assert;

const MSG_EMAIL = 'Mal email: {{value}}.';
const MSG_CONTAINS = 'Tenemos "{{value}}" y debe ser "{{option}}".';
const MSG_IL_MIN = 'Muy bajo {{value}}, al menos {{min}}.';
const MSG_IL_MAX = 'Muy alto {{value}}, máximo {{max}}.';
const MSG_FLOAT = 'Debe ser flotante.';
const MSG_CUSTOM1 = 'Para customVal1 {{a}} {{b}}.';
const MSG_CUSTOM2 = 'Para customVal2 {{a}} {{b}}.';

const RULE_CONTAINS = 'romel';
const RULE_ISLENGTH = { min: 4, max: 8 };
const RULE_CUSTOM1 = { a: 1, b: 2 };
const RULE_CUSTOM2 = { a: true, b: false };
const RULE_DIVISIBLEBY = 2;

const fields = {};
const settings = {

  validators: {
    customVal0 (value, opts) {
      return value === opts;
    },
    customVal1 (value, opts) {
      return value === opts;
    },
    customVal2 (value, opts) {
      return value === opts;
    }
  },

  locale: 'es',

  msgs: {
    isEmail: MSG_EMAIL,
    contains: MSG_CONTAINS,
    isFloat: {
      en: 'Must be float.',
      es: MSG_FLOAT
    },
    isLength: {
      min: {
        en: 'Too low {{value}}, at least {{min}}.',
        es: MSG_IL_MIN
      },
      max: {
        en: 'Too high {{value}}, at most {{max}}.',
        es: MSG_IL_MAX
      }
    },
    customVal1: MSG_CUSTOM1,
    customVal2: {
      en: 'For customVal2 {{a}} {{b}}.',
      es: MSG_CUSTOM2
    }
  },

  fields: [{
    name: 'field0',
    required: true,
    validators: {
      isInt: true
    }
  }, {
    name: 'field1',
    required: true,
    validators: {
      isEmail: true
    }
  }, {
    name: 'field2',
    required: true,
    validators: {
      contains: RULE_CONTAINS
    }
  }, {
    name: 'field3',
    required: true,
    validators: {
      isFloat: true
    }
  }, {
    name: 'field4',
    required: true,
    validators: {
      customVal0: 'custom0'
    }
  }, {
    name: 'field5',
    required: true,
    validators: {
      customVal1: RULE_CUSTOM1
    }
  }, {
    name: 'field6',
    required: true,
    validators: {
      isLength: RULE_ISLENGTH
    }
  }, {
    name: 'field7',
    required: true,
    validators: {
      customVal2: RULE_CUSTOM2
    }
  }, {
    name: 'field8',
    required: true,
    validators: {
      isNumeric: true,
      isDivisibleBy: RULE_DIVISIBLEBY,
      isLength: RULE_ISLENGTH
    }
  }]
};

var field;
var msg;


describe('Method validateField() - messages in different locale with many formats', function () {

  describe('Mutiples ways to configure an message and formatting', function () {

    it('Built-in validator without custom message', function () {
      field = 'field0';
      fields[field] = 'noNumber';
      msg = utils.format(localeES.msgs.isInt);
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Built-in validator with custom default message', function () {
      field = 'field1';
      fields[field] = 'noEmail';
      msg = utils.format(MSG_EMAIL, {value: fields[field]});
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Built-in validator with locales messages', function () {
      field = 'field3';
      fields[field] = 'notFloat';
      msg = utils.format(MSG_FLOAT, {value: fields[field]});
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('isLength validator with locale messages (min)', function () {
      field = 'field6';
      fields[field] = 'aa';
      msg = utils.format(MSG_IL_MIN, extend({value: fields[field]}, RULE_ISLENGTH));
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('isLength validator with locale messages (max)', function () {
      field = 'field6';
      fields[field] = 'aaaaaaaaaaaaa';
      msg = utils.format(MSG_IL_MAX, extend({value: fields[field]}, RULE_ISLENGTH));
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Custom validator without custom message', function () {
      field = 'field4';
      fields[field] = 'not custom0';
      msg = utils.format(localeES.msgs.general);
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Custom validator with custom default message', function () {
      field = 'field5';
      fields[field] = 'not custom1';
      msg = utils.format(MSG_CUSTOM1, RULE_CUSTOM1);
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Custom validator with custom locales messages', function () {
      field = 'field7';
      fields[field] = 'not custom2';
      msg = utils.format(MSG_CUSTOM2, RULE_CUSTOM2);
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    // @NOTE: JavaScript engines are not obligated to provide the object properties
    // in the same order as they were added. There are some issues too. For
    // alfanumeric starting object keys in webkit engines this seems to work.
    // Even if this does not work in that way for some browsers, for the validateField()
    // method, it does not matter.
    describe('Validator with multiples messages', function () {

      it('Validator with multiples messages (part1)', function () {
        field = 'field8';
        fields[field] = 'notNumber';
        assert.strictEqual(vulcanval.validateField(field, fields, settings), localeES.msgs.isNumeric);
      });

      it('Validator with multiples messages (part2)', function () {
        field = 'field8';
        fields[field] = '15151515153';
        msg = utils.format(localeES.msgs.isDivisibleBy, {option: RULE_DIVISIBLEBY});
        assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
      });

      it('Validator with multiples messages (part3)', function () {
        field = 'field8';
        fields[field] = '70';
        msg = utils.format(MSG_IL_MIN, extend({value: fields[field]}, RULE_ISLENGTH));
        assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
      });

      it('Validator with multiples messages (part4)', function () {
        field = 'field8';
        fields[field] = '7515050154215051512';
        msg = utils.format(MSG_IL_MAX, extend({value: fields[field]}, RULE_ISLENGTH));
        assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
      });
    });
  });


  describe('Format variables', function () {

    it('Value variable', function () {
      field = 'field1';
      fields[field] = 'n7';
      msg = utils.format(MSG_EMAIL, {value: fields[field]});
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });

    it('Option variable', function () {
      field = 'field2';
      fields[field] = 'notTheRule';
      msg = utils.format(MSG_CONTAINS, { value: fields[field], option: RULE_CONTAINS });
      assert.strictEqual(vulcanval.validateField(field, fields, settings), msg);
    });
  });
});
