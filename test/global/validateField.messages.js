const chai =    require('chai');
const extend =  require('extend');

const vulcanval =   require('../../src/js/vulcanval');
const utils =       require('../../src/js/utils');
const settings =    require('../../src/js/settings');
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

const conf = {};
const fields = {};

vulcanval.extendLocale(localeES);

conf.settings = settings.extend({

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
      en: {
        min: 'Too low {{value}}, at least {{min}}.',
        max: 'Too high {{value}}, at most {{max}}.'
      },
      es: {
        min: MSG_IL_MIN,
        max: MSG_IL_MAX
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
    name: 'field7',
    required: true,
    validators: {
      customVal2: RULE_CUSTOM2
    }
  }, {
    name: 'field6',
    required: true,
    validators: {
      isLength: RULE_ISLENGTH
    }
  }]
});

conf.context = {
  settings: conf.settings,
  get: (fieldName) => {
    return fields[fieldName];
  }
};

var result, msg;


describe('validateField - messages in different locale', function () {


  describe('Mutiples ways to configure an message and formatting', function () {

    it('Built-in validator without custom message', function () {
      conf.field = { name: 'field0', value: 'noNumber' };
      msg = utils.format(localeES.msgs.isInt);
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('Built-in validator with custom default message', function () {
      conf.field = { name: 'field1', value: 'noEmail' };
      msg = utils.format(MSG_EMAIL, conf.field);
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('Built-in validator with locales messages', function () {
      conf.field = { name: 'field3', value: 'notFloat' };
      msg = utils.format(MSG_FLOAT, conf.field);
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('isLength validator with locale messages (min)', function () {
      conf.field = { name: 'field6', value: 'aa' };
      msg = utils.format(MSG_IL_MIN, extend(conf.field, RULE_ISLENGTH));
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('isLength validator with locale messages (max)', function () {
      conf.field = { name: 'field6', value: 'aaaaaaaaaaaaa' };
      msg = utils.format(MSG_IL_MAX, extend(conf.field, RULE_ISLENGTH));
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('Custom validator without custom message', function () {
      conf.field = { name: 'field4', value: 'not custom0' };
      msg = utils.format(localeES.msgs.general, {});
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('Custom validator with custom default message', function () {
      conf.field = { name: 'field5', value: 'not custom1' };
      msg = utils.format(MSG_CUSTOM1, RULE_CUSTOM1);
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('Custom validator with custom locales messages', function () {
      conf.field = { name: 'field7', value: 'not custom2' };
      msg = utils.format(MSG_CUSTOM2, RULE_CUSTOM2);
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });
  });


  describe('format variables', function () {

    it('value variable', function () {
      conf.field = { name: 'field1', value: 'n7' };
      msg = utils.format(MSG_EMAIL, { value: 'n7' });
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });

    it('option variable', function () {
      conf.field = { name: 'field2', value: 'notTheRule' };
      msg = utils.format(MSG_CONTAINS, { value: 'notTheRule', option: RULE_CONTAINS });
      assert.propertyVal(vulcanval.validateField(conf), 'msg', msg);
    });
  });
});
