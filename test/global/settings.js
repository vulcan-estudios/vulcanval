require('./pre');

const chai = require('chai');
const extend = require('extend');
const vulcanval = require('../../src/js/main');
const settings = require('../../src/js/settings');
const localeEN = require('../../src/js/localization/en');
const localeES = require('../../src/js/localization/es');


const assert = chai.assert;

const MSG_EMAIL = 'msg email';
const MSG_FLOAT_EN = 'msg float en';
const MSG_FLOAT_ES = 'msg float es';
const MSG_LENGTH_MIN = 'msg length en min';
const MSG_LENGTH_MAX_EN = 'msg length en max';
const MSG_LENGTH_MAX_ES = 'msg length es max';

const customSettings1 = {
  //default locale: en
  msgs: {
    isEmail: MSG_EMAIL,
    isFloat: {
      en: MSG_FLOAT_EN,
      es: MSG_FLOAT_ES
    },
    isLength: {
      min: MSG_LENGTH_MIN,
      max: {
        en: MSG_LENGTH_MAX_EN,
        es: MSG_LENGTH_MAX_ES
      }
    }
  }
};
const customSettings2 = {
  locale: 'es',
  msgs: {
    isEmail: MSG_EMAIL,
    isFloat: {
      en: MSG_FLOAT_EN,
      es: MSG_FLOAT_ES
    },
    isLength: {
      min: MSG_LENGTH_MIN,
      max: {
        en: MSG_LENGTH_MAX_EN,
        es: MSG_LENGTH_MAX_ES
      }
    }
  }
};


describe('Module settings', function () {


  const custom1 = settings.extend(customSettings1);
  const custom2 = settings.extend(customSettings2);


  describe('Method extend()', function () {

    describe('Messages interpolation', function () {

      it('Default message', function () {
        assert.strictEqual(custom1.msgs.en.isEmail, null);
        assert.strictEqual(custom1.msgs.es.isEmail, null);
        assert.strictEqual(custom1.msgs.defaults.isEmail, MSG_EMAIL);
      });

      it('Locale message', function () {
        assert.strictEqual(custom1.msgs.en.isFloat, MSG_FLOAT_EN);
        assert.strictEqual(custom1.msgs.es.isFloat, MSG_FLOAT_ES);
        assert.strictEqual(custom1.msgs.defaults.isFloat, undefined);
      });

      it('Locale message by properties', function () {
        assert.strictEqual(custom1.msgs.defaults['isLength.min'], MSG_LENGTH_MIN);
        assert.strictEqual(custom1.msgs.en['isLength.max'], MSG_LENGTH_MAX_EN);

        assert.strictEqual(custom1.msgs.defaults['isLength.min'], MSG_LENGTH_MIN);
        assert.strictEqual(custom1.msgs.es['isLength.max'], MSG_LENGTH_MAX_ES);

        assert.strictEqual(custom1.msgs.defaults.isLength, undefined);
      });
    });
  });


  describe('Method getMsgTemplate()', function () {

    it('Unknown message', function () {
      assert.strictEqual(custom1.getMsgTemplate('unknownValidator'), localeEN.msgs.general);
      assert.strictEqual(custom2.getMsgTemplate('unknownValidator'), localeES.msgs.general);
    });

    it('Default message', function () {
      assert.strictEqual(custom1.getMsgTemplate('general'), localeEN.msgs.general);
      assert.strictEqual(custom2.getMsgTemplate('general'), localeES.msgs.general);
    });

    it('Default message of unknown validator', function () {
      // validator isMACAddress does not have a message configured yet in localization packages.
      assert.strictEqual(custom1.getMsgTemplate('isMACAddress'), localeEN.msgs.general);
      assert.strictEqual(custom2.getMsgTemplate('isMACAddress'), localeES.msgs.general);
    });

    it('Updated default message', function () {
      assert.strictEqual(custom1.getMsgTemplate('isInt'), localeEN.msgs.isInt);
      assert.strictEqual(custom2.getMsgTemplate('isInt'), localeES.msgs.isInt);
    });

    it('Updated specific message', function () {
      assert.strictEqual(custom1.getMsgTemplate('isEmail'), MSG_EMAIL);
      assert.strictEqual(custom2.getMsgTemplate('isEmail'), MSG_EMAIL);
    });

    it('Updated specific locale message', function () {
      assert.strictEqual(custom1.getMsgTemplate('isFloat'), MSG_FLOAT_EN);
      assert.strictEqual(custom2.getMsgTemplate('isFloat'), MSG_FLOAT_ES);
    });

    it('Updated specific locale message by properties', function () {
      assert.strictEqual(custom1.getMsgTemplate('isLength.min'), MSG_LENGTH_MIN);
      assert.strictEqual(custom1.getMsgTemplate('isLength.max'), MSG_LENGTH_MAX_EN);

      assert.strictEqual(custom2.getMsgTemplate('isLength.min'), MSG_LENGTH_MIN);
      assert.strictEqual(custom2.getMsgTemplate('isLength.max'), MSG_LENGTH_MAX_ES);
    });
  });
});
