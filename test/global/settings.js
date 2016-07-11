require('./pre');

const assert = require('chai').assert;
const expect = require('chai').expect;
const extend = require('extend');
const vulcanval = require('../../src/js/vulcanval');
const settings = require('../../src/js/settings/settings');
const localeEN = require('../../src/js/locale/en');
const localeES = require('../../src/js/locale/es');


const MSG_EMAIL = 'msg email';
const MSG_FLOAT_EN = 'msg float en';
const MSG_FLOAT_ES = 'msg float es';
const MSG_LENGTH_MIN = 'msg length en min';
const MSG_LENGTH_MAX_EN = 'msg length en max';
const MSG_LENGTH_MAX_ES = 'msg length es max';

const customSettings1 = {
  //default locale is 'en' but in client side when we install another language
  //pack, we set it as default so we have to rewrite it
  locale: 'en',
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
  },
  fields: [{name:'a'}]
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
  },
  fields: [{name:'a'}]
};

var ns;


describe('settings{}', function () {


  const custom1 = settings.extend(customSettings1);
  const custom2 = settings.extend(customSettings2);


  describe('Method extend()', function () {

    describe('Validation', function () {

      it('Parameter', function () {
        assert.throws(function () {
          settings.extend(10);
        }, 'a valid object is required to extend');
      });

      it('Fields', function () {
        assert.throws(function () {
          settings.extend({});
        }, 'there are no fields for validation');
      });

      it('Field names', function () {
        assert.throws(function () {
          settings.extend({
            fields: [{
              name: '.err..err.'
            }]
          });
        }, 'field name ".err..err." must be a valid name');
      });

      it('Locale', function () {
        assert.throws(function () {
          settings.extend({ fields: [{name: 'a'}], locale: 'asd' });
        }, 'locale "asd" was not found');
      });
    });

    describe('Process fieldsets', function () {

      it('Validate names', function () {
        assert.throws(function () {
          settings.extend({
            fieldsets: [
              { name: null }
            ],
            fields: [{name: 'a'}]
          });
        }, 'fieldset name "null" is invalid');
      });

      it('Validate fields names', function () {
        assert.throws(function () {
          settings.extend({
            fieldsets: [
              { name: 'a', fields: 'not found' }
            ],
            fields: [{name: 'a'}]
          });
        }, 'fieldset name "a" fields not found');
      });

      describe('RegExp fields', function () {

        it('Fields not found', function () {
          assert.throws(function () {
            settings.extend({
              fieldsets: [
                { name: 'x', fields: /part/ }
              ],
              fields: [
                { name: 'aaa' },
                { name: 'bbb' }
              ]
            });
          }, 'fieldset name "x" fields not found');
        });

        it('Fields found', function () {
          ns = settings.extend({
            fieldsets: [
              { name: 'a', fields: /^aa/ },
              { name: 'c', fields: /^cc/ }
            ],
            fields: [
              { name: 'aa.xx' },
              { name: 'bb.yy' },
              { name: 'cc.ww' }
            ]
          });
          assert.sameMembers(ns.fieldsets[0].fields, ['aa.xx']);
          assert.sameMembers(ns.fieldsets[1].fields, ['cc.ww']);
        });
      });

      describe('String fields', function () {

        it('Fields not found', function () {
          assert.throws(function () {
            settings.extend({
              fieldsets: [
                { name: 'y', fields: 'not found' }
              ],
              fields: [
                { name: 'aaa' },
                { name: 'bbb' }
              ]
            });
          }, 'fieldset name "y" fields not found');
        });

        it('Fields found', function () {
          ns = settings.extend({
            fieldsets: [
              { name: 'a', fields: 'aa' },
              { name: 'c', fields: 'cc' }
            ],
            fields: [
              { name: 'aa.xx' },
              { name: 'bb.yy' },
              { name: 'cc.ww' }
            ]
          });
          assert.sameMembers(ns.fieldsets[0].fields, ['aa.xx']);
          assert.sameMembers(ns.fieldsets[1].fields, ['cc.ww']);
        });
      });

      describe('Array fields', function () {

        it('Fields not found', function () {
          assert.throws(function () {
            settings.extend({
              fieldsets: [
                { name: 'w', fields: ['ccc'] }
              ],
              fields: [
                { name: 'aaa' },
                { name: 'bbb' }
              ]
            });
          }, 'fieldset field "ccc" not found');
        });

        it('Fields found', function () {
          ns = settings.extend({
            fieldsets: [
              { name: 'a', fields: ['aa.xx', 'bb.yy'] },
              { name: 'c', fields: ['cc.ww'] }
            ],
            fields: [
              { name: 'aa.xx' },
              { name: 'bb.yy' },
              { name: 'cc.ww' }
            ]
          });
          assert.sameMembers(ns.fieldsets[0].fields, ['aa.xx', 'bb.yy']);
          assert.sameMembers(ns.fieldsets[1].fields, ['cc.ww']);
        });
      });
    });

    describe('Process fields', function () {

      it('Inherit props from settings', function () {
        ns = settings.extend({
          autostart: true,
          validationEvents: 'change',
          fields: [ {name: 'a'} ]
        });
        assert.isTrue(ns.fields[0].autostart);
        assert.equal(ns.fields[0].validationEvents, 'change');
      });

      it('Inherit props from fieldset settings (over settings)', function () {
        ns = settings.extend({
          autostart: true,
          intern: true,
          firstValidationEvent: 'change',
          fieldsets: [{
            name: 'x',
            fields: ['a'],
            onlyUI: false,
            intern: false,
            firstValidationEvent: 'blur',
            validationEvents: 'input',
          }, {
            name: 'y',
            fields: ['a'],
            onlyUI: true
          }],
          fields: [{
            name: 'a',
          }]
        });
        assert.isTrue(ns.fields[0].autostart);
        assert.isFalse(ns.fields[0].intern);
        assert.isTrue(ns.fields[0].onlyUI);
        assert.equal(ns.fields[0].firstValidationEvent, 'blur');
        assert.equal(ns.fields[0].validationEvents, 'input');
      });

      it('Overwrite inherit properties', function () {
        ns = settings.extend({
          autostart: true,
          firstValidationEvent: 'change',
          fieldsets: [{
            name: 'x',
            fields: ['a'],
            intern: false,
            validationEvents: 'input',
          }],
          fields: [{
            name: 'a',
            autostart: false,
            intern: true,
            firstValidationEvent: 'blur',
            validationEvents: 'change'
          }]
        });
        assert.isFalse(ns.fields[0].autostart, 'autostart should be false');
        assert.isTrue(ns.fields[0].intern, 'intern should be true');
        assert.equal(ns.fields[0].firstValidationEvent, 'blur');
        assert.equal(ns.fields[0].validationEvents, 'change');
      });

      it('Validators', function () {
        ns = settings.extend({
          fieldsets: [{
            name: 'x',
            fields: ['a'],
            validators: { isInt: true, isEmail: true }
          }],
          fields: [{
            name: 'a',
            validators: { isEmail: false, isLength: { min: 4 } }
          }, {
            name: 'b',
            validators: { isBoolean: true }
          }]
        });

        assert.lengthOf(Object.keys(ns.fields[0].validators), 3);
        assert.isTrue(ns.fields[0].validators.isInt);
        assert.isFalse(ns.fields[0].validators.isEmail);
        assert.isObject(ns.fields[0].validators.isLength);

        assert.lengthOf(Object.keys(ns.fields[1].validators), 1);
        assert.isTrue(ns.fields[1].validators.isBoolean);
      });

      it('value()', function () {
        ns = settings.extend({
          fields: [{
            name: 'a',
            $el: '$el',
            value ($el) {
              return $el === '$el' && typeof this.equals === 'function' &&
                typeof this.isByteLength === 'function';
            }
          }, {
            name: 'b',
            value () {
              return 'b value';
            }
          }]
        });
        assert.isTrue(ns.fields[0].value());
        assert.equal(ns.fields[1].value(), 'b value');
      });

      describe('onlyIf()', function () {

        it('Field definition', function () {
          ns = settings.extend({
            fields: [{
              name: 'a',
              onlyIf (value) { return value === 'my value' && this.isIP('100.100.100.100'); },
              value () { return 'my value'; }
            }]
          });
          const map = {
            'a': 'my value'
          };
          ns.context.get = name => map[name];
          assert.isTrue(ns.fields[0].onlyIf());
        });

        it('Fieldset chain definition', function () {
          ns = settings.extend({
            fieldsets: [{
              name: 'x',
              fields: ['a'],
              onlyIf (value) { return false; }
            }, {
              name: 'y',
              fields: ['b'],
              onlyIf (value) { return value === 'VALUE' && this.isUppercase(value); }
            }],
            fields: [{
              name: 'a',
              onlyIf (value) { return value === 'my value' && this.isIP('100.100.100.100'); },
              value () { return 'my value'; }
            }, {
              name: 'b',
              onlyIf (value) { return value === 'VALUE' && this.isIP('100.100.100.100'); },
              value () { return 'VALUE'; }
            }]
          });
          const map = {
            'a': 'my value',
            'b': 'VALUE'
          };
          ns.context.get = name => map[name];
          assert.isFalse(ns.fields[0].onlyIf());
          assert.isTrue(ns.fields[1].onlyIf());
        });
      });
    });

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
