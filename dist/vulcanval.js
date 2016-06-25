(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["prhone-log"], function () {
      return factory();
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrhoneLog = factory();
  }
}(this, function () {

  /**
   * Simple extend object. Receives many objects.
   * @param  {Object} obj - The object to extend.
   * @return {Object} - `obj` extended.
   */
  var extend = function (obj) {
    obj = obj || {};
    var exts = Array.prototype.slice.call(arguments, 1);
    for (var k=0; k<exts.length; k++) {
      for (var i in exts[k]) {
        if (exts[k].hasOwnProperty(i)) {
          obj[i] = exts[k][i];
        }
      }
    }
    return obj;
  };

  /**
   * Log levels. Each level is a log method.
   * @type {Array}
   */
  const levels = [
    {
      name: 'DEBUG',
      scale: 4,
      method: 'debug',
      'console': 'debug'
    },
    {
      name: 'INFO',
      scale: 3,
      method: 'info',
      'console': 'info'
    },
    {
      name: 'WARN',
      scale: 2,
      method: 'warn',
      'console': 'warn'
    },
    {
      name: 'ERROR',
      scale: 1,
      method: 'error',
      'console': 'error'
    }
  ];

  /**
   * The logger class.
   * @param {String} namespace - A namespace to identify the logger.
   * @param {Object} [settings] - An optional configuration to overwrite defaults.
   */
  var Log = function (namespace, settings) {
    this.namespace = namespace;
    this.history = [];
    this.settings = extend({}, Log.defaults, settings);
  };

  /**
   * Default config.
   * @type {Object}
   */
  Log.defaults = {
    history: true,  // Keep a record of all messages.
    scale: 4,  // Scale to display messages.
    throwErrors: false,  // Throw errors in methods scale 1 or below.
    display: true,  // Display messages in console.
    displayTime: false,  // Display the time in messages.
    displayLevel: true,  // Display the level in messages.
    displayNamespace: true  // Display the namespace in messages.
  };

  /**
   * Add a new method level.
   * @param {Object} level - Level description.
   * @param {String} level.name - Level name.
   * @param {Number} [level.scale] - Number scale. Default to 0.
   * @param {String} [level.method] - The method logger. Default to 'log'.
   * @param {String} [level.console] - The console method used to display. Default 'log'.
   */
  Log.addLevel = function (level) {

    if (!level || typeof level !== 'object') {
      throw new Error('The first parameter must be an object describing the level');
    }
    if (typeof level.name !== 'string') {
      throw new Error('The level object must have a name property');
    }

    level = extend({
      name: null,
      scale: 0,
      method: 'log',
      'console': 'log'
    }, level);

    this.prototype[level.method] = function () {
      this._exec(level, arguments);
    };
  };

  /**
   * Record a log in logger history if configured.
   * @private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} text - The raw message.
   * @param  {String} msg - The parsed message.
   */
  Log.prototype._record = function (date, level, text, msg) {
    if (this.settings.history) {
      this.history.push({
        date: date.getTime(),
        level: level,
        text: text,
        msg: msg
      });
    }
  };

  /**
   * Create the log message with the logger configuration.
   * @private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} text - The raw message.
   * @return {String} - The parsed message.
   */
  Log.prototype._msg = function (date, level, text) {

    var dtime = '';
    var dlevel = '';
    var dnamespace = '';

    if (this.settings.displayTime) {
      var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      var ms = date.getMilliseconds() < 10 ?
        '00' + date.getMilliseconds() :
        date.getMilliseconds() < 100 ?
          '0' + date.getMilliseconds() :
          date.getMilliseconds();
      dtime = hh + ':' + mm + ':' + ss + '.' + ms + ' ';
    }

    if (this.settings.displayLevel) {
      dlevel = level.name + ' ';
    }

    if (this.settings.displayNamespace) {
      dnamespace = this.namespace + ' ';
    }

    var dmsg = (dtime + dlevel + dnamespace).trim();
    dmsg = dmsg.length ? dmsg + ': ' + text : text;

    return dmsg;
  };

  /**
   * Log the message in the console.
   * @private
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} msg - The parsed message.
   */
  Log.prototype._log = function (level, msg) {
    if (this.settings.display) {
      if (console && console.log) {
        if (console[level.console] && typeof console[level.console] === 'function') {
          console[level.console](msg);
        } else {
          console.log(msg);
        }
      }
    }
  };

  /**
   * Log method definition.
   * @private
   * @param  {Object} level - Reference to the level definition.
   * @param  {Array} args - The arguments received by the log method.
   */
  Log.prototype._exec = function (level, args) {

    var date = new Date();
    var text = '';

    args = Array.prototype.slice.call(args, 0);
    for (var i=0; i<args.length; i++) {
      if (typeof args[i] === 'object') {
        text += ' '+ JSON.stringify(args[i]);
      } else {
        text += ' '+ args[i];
      }
    }
    text = text.trim();

    var msg = this._msg(date, level, text);

    this._record(date, level, text, msg);

    if (this.settings.throwErrors && level.scale <= 1) {
      throw new Error(msg);
    }

    if (level.scale <= this.settings.scale) {
      this._log(level, msg);
    }
  };

  // Initialize default levels.
  for (var l=0; l<levels.length; l++) {
    Log.addLevel(levels[l]);
  }

  return Log;
}));

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toDate = require('./lib/toDate');

var _toDate2 = _interopRequireDefault(_toDate);

var _toFloat = require('./lib/toFloat');

var _toFloat2 = _interopRequireDefault(_toFloat);

var _toInt = require('./lib/toInt');

var _toInt2 = _interopRequireDefault(_toInt);

var _toBoolean = require('./lib/toBoolean');

var _toBoolean2 = _interopRequireDefault(_toBoolean);

var _equals = require('./lib/equals');

var _equals2 = _interopRequireDefault(_equals);

var _contains = require('./lib/contains');

var _contains2 = _interopRequireDefault(_contains);

var _matches = require('./lib/matches');

var _matches2 = _interopRequireDefault(_matches);

var _isEmail = require('./lib/isEmail');

var _isEmail2 = _interopRequireDefault(_isEmail);

var _isURL = require('./lib/isURL');

var _isURL2 = _interopRequireDefault(_isURL);

var _isMACAddress = require('./lib/isMACAddress');

var _isMACAddress2 = _interopRequireDefault(_isMACAddress);

var _isIP = require('./lib/isIP');

var _isIP2 = _interopRequireDefault(_isIP);

var _isFQDN = require('./lib/isFQDN');

var _isFQDN2 = _interopRequireDefault(_isFQDN);

var _isBoolean = require('./lib/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _isAlpha = require('./lib/isAlpha');

var _isAlpha2 = _interopRequireDefault(_isAlpha);

var _isAlphanumeric = require('./lib/isAlphanumeric');

var _isAlphanumeric2 = _interopRequireDefault(_isAlphanumeric);

var _isNumeric = require('./lib/isNumeric');

var _isNumeric2 = _interopRequireDefault(_isNumeric);

var _isLowercase = require('./lib/isLowercase');

var _isLowercase2 = _interopRequireDefault(_isLowercase);

var _isUppercase = require('./lib/isUppercase');

var _isUppercase2 = _interopRequireDefault(_isUppercase);

var _isAscii = require('./lib/isAscii');

var _isAscii2 = _interopRequireDefault(_isAscii);

var _isFullWidth = require('./lib/isFullWidth');

var _isFullWidth2 = _interopRequireDefault(_isFullWidth);

var _isHalfWidth = require('./lib/isHalfWidth');

var _isHalfWidth2 = _interopRequireDefault(_isHalfWidth);

var _isVariableWidth = require('./lib/isVariableWidth');

var _isVariableWidth2 = _interopRequireDefault(_isVariableWidth);

var _isMultibyte = require('./lib/isMultibyte');

var _isMultibyte2 = _interopRequireDefault(_isMultibyte);

var _isSurrogatePair = require('./lib/isSurrogatePair');

var _isSurrogatePair2 = _interopRequireDefault(_isSurrogatePair);

var _isInt = require('./lib/isInt');

var _isInt2 = _interopRequireDefault(_isInt);

var _isFloat = require('./lib/isFloat');

var _isFloat2 = _interopRequireDefault(_isFloat);

var _isDecimal = require('./lib/isDecimal');

var _isDecimal2 = _interopRequireDefault(_isDecimal);

var _isHexadecimal = require('./lib/isHexadecimal');

var _isHexadecimal2 = _interopRequireDefault(_isHexadecimal);

var _isDivisibleBy = require('./lib/isDivisibleBy');

var _isDivisibleBy2 = _interopRequireDefault(_isDivisibleBy);

var _isHexColor = require('./lib/isHexColor');

var _isHexColor2 = _interopRequireDefault(_isHexColor);

var _isJSON = require('./lib/isJSON');

var _isJSON2 = _interopRequireDefault(_isJSON);

var _isNull = require('./lib/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _isLength = require('./lib/isLength');

var _isLength2 = _interopRequireDefault(_isLength);

var _isByteLength = require('./lib/isByteLength');

var _isByteLength2 = _interopRequireDefault(_isByteLength);

var _isUUID = require('./lib/isUUID');

var _isUUID2 = _interopRequireDefault(_isUUID);

var _isMongoId = require('./lib/isMongoId');

var _isMongoId2 = _interopRequireDefault(_isMongoId);

var _isDate = require('./lib/isDate');

var _isDate2 = _interopRequireDefault(_isDate);

var _isAfter = require('./lib/isAfter');

var _isAfter2 = _interopRequireDefault(_isAfter);

var _isBefore = require('./lib/isBefore');

var _isBefore2 = _interopRequireDefault(_isBefore);

var _isIn = require('./lib/isIn');

var _isIn2 = _interopRequireDefault(_isIn);

var _isCreditCard = require('./lib/isCreditCard');

var _isCreditCard2 = _interopRequireDefault(_isCreditCard);

var _isISIN = require('./lib/isISIN');

var _isISIN2 = _interopRequireDefault(_isISIN);

var _isISBN = require('./lib/isISBN');

var _isISBN2 = _interopRequireDefault(_isISBN);

var _isMobilePhone = require('./lib/isMobilePhone');

var _isMobilePhone2 = _interopRequireDefault(_isMobilePhone);

var _isCurrency = require('./lib/isCurrency');

var _isCurrency2 = _interopRequireDefault(_isCurrency);

var _isISO = require('./lib/isISO8601');

var _isISO2 = _interopRequireDefault(_isISO);

var _isBase = require('./lib/isBase64');

var _isBase2 = _interopRequireDefault(_isBase);

var _isDataURI = require('./lib/isDataURI');

var _isDataURI2 = _interopRequireDefault(_isDataURI);

var _ltrim = require('./lib/ltrim');

var _ltrim2 = _interopRequireDefault(_ltrim);

var _rtrim = require('./lib/rtrim');

var _rtrim2 = _interopRequireDefault(_rtrim);

var _trim = require('./lib/trim');

var _trim2 = _interopRequireDefault(_trim);

var _escape = require('./lib/escape');

var _escape2 = _interopRequireDefault(_escape);

var _unescape = require('./lib/unescape');

var _unescape2 = _interopRequireDefault(_unescape);

var _stripLow = require('./lib/stripLow');

var _stripLow2 = _interopRequireDefault(_stripLow);

var _whitelist = require('./lib/whitelist');

var _whitelist2 = _interopRequireDefault(_whitelist);

var _blacklist = require('./lib/blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

var _isWhitelisted = require('./lib/isWhitelisted');

var _isWhitelisted2 = _interopRequireDefault(_isWhitelisted);

var _normalizeEmail = require('./lib/normalizeEmail');

var _normalizeEmail2 = _interopRequireDefault(_normalizeEmail);

var _toString = require('./lib/util/toString');

var _toString2 = _interopRequireDefault(_toString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '5.4.0';

var validator = {
  version: version,
  toDate: _toDate2.default,
  toFloat: _toFloat2.default, toInt: _toInt2.default,
  toBoolean: _toBoolean2.default,
  equals: _equals2.default, contains: _contains2.default, matches: _matches2.default,
  isEmail: _isEmail2.default, isURL: _isURL2.default, isMACAddress: _isMACAddress2.default, isIP: _isIP2.default, isFQDN: _isFQDN2.default,
  isBoolean: _isBoolean2.default,
  isAlpha: _isAlpha2.default, isAlphanumeric: _isAlphanumeric2.default, isNumeric: _isNumeric2.default, isLowercase: _isLowercase2.default, isUppercase: _isUppercase2.default,
  isAscii: _isAscii2.default, isFullWidth: _isFullWidth2.default, isHalfWidth: _isHalfWidth2.default, isVariableWidth: _isVariableWidth2.default,
  isMultibyte: _isMultibyte2.default, isSurrogatePair: _isSurrogatePair2.default,
  isInt: _isInt2.default, isFloat: _isFloat2.default, isDecimal: _isDecimal2.default, isHexadecimal: _isHexadecimal2.default, isDivisibleBy: _isDivisibleBy2.default,
  isHexColor: _isHexColor2.default,
  isJSON: _isJSON2.default,
  isNull: _isNull2.default,
  isLength: _isLength2.default, isByteLength: _isByteLength2.default,
  isUUID: _isUUID2.default, isMongoId: _isMongoId2.default,
  isDate: _isDate2.default, isAfter: _isAfter2.default, isBefore: _isBefore2.default,
  isIn: _isIn2.default,
  isCreditCard: _isCreditCard2.default,
  isISIN: _isISIN2.default, isISBN: _isISBN2.default,
  isMobilePhone: _isMobilePhone2.default,
  isCurrency: _isCurrency2.default,
  isISO8601: _isISO2.default,
  isBase64: _isBase2.default, isDataURI: _isDataURI2.default,
  ltrim: _ltrim2.default, rtrim: _rtrim2.default, trim: _trim2.default,
  escape: _escape2.default, unescape: _unescape2.default, stripLow: _stripLow2.default,
  whitelist: _whitelist2.default, blacklist: _blacklist2.default,
  isWhitelisted: _isWhitelisted2.default,
  normalizeEmail: _normalizeEmail2.default,
  toString: _toString2.default
};

exports.default = validator;
module.exports = exports['default'];
},{"./lib/blacklist":5,"./lib/contains":6,"./lib/equals":7,"./lib/escape":8,"./lib/isAfter":9,"./lib/isAlpha":10,"./lib/isAlphanumeric":11,"./lib/isAscii":12,"./lib/isBase64":13,"./lib/isBefore":14,"./lib/isBoolean":15,"./lib/isByteLength":16,"./lib/isCreditCard":17,"./lib/isCurrency":18,"./lib/isDataURI":19,"./lib/isDate":20,"./lib/isDecimal":21,"./lib/isDivisibleBy":22,"./lib/isEmail":23,"./lib/isFQDN":24,"./lib/isFloat":25,"./lib/isFullWidth":26,"./lib/isHalfWidth":27,"./lib/isHexColor":28,"./lib/isHexadecimal":29,"./lib/isIP":30,"./lib/isISBN":31,"./lib/isISIN":32,"./lib/isISO8601":33,"./lib/isIn":34,"./lib/isInt":35,"./lib/isJSON":36,"./lib/isLength":37,"./lib/isLowercase":38,"./lib/isMACAddress":39,"./lib/isMobilePhone":40,"./lib/isMongoId":41,"./lib/isMultibyte":42,"./lib/isNull":43,"./lib/isNumeric":44,"./lib/isSurrogatePair":45,"./lib/isURL":46,"./lib/isUUID":47,"./lib/isUppercase":48,"./lib/isVariableWidth":49,"./lib/isWhitelisted":50,"./lib/ltrim":51,"./lib/matches":52,"./lib/normalizeEmail":53,"./lib/rtrim":54,"./lib/stripLow":55,"./lib/toBoolean":56,"./lib/toDate":57,"./lib/toFloat":58,"./lib/toInt":59,"./lib/trim":60,"./lib/unescape":61,"./lib/util/toString":64,"./lib/whitelist":65}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var alpha = exports.alpha = {
  'en-US': /^[A-Z]+$/i,
  'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'nl-NL': /^[A-ZÉËÏÓÖÜ]+$/i,
  'hu-HU': /^[A-ZÁÉÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁа-яё]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};

var alphanumeric = exports.alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÓÖŐÚÜŰ]+$/i,
  'nl-NL': /^[0-9A-ZÉËÏÓÖÜ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁа-яё]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};

var englishLocales = exports.englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];

for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = 'en-' + englishLocales[i];
  alpha[locale] = alpha['en-US'];
  alphanumeric[locale] = alphanumeric['en-US'];
}

// Source: http://www.localeplanet.com/java/
var arabicLocales = exports.arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];

for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
  _locale = 'ar-' + arabicLocales[_i];
  alpha[_locale] = alpha.ar;
  alphanumeric[_locale] = alphanumeric.ar;
}
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = blacklist;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function blacklist(str, chars) {
  (0, _assertString2.default)(str);
  return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
}
module.exports = exports['default'];
},{"./util/assertString":62}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _toString = require('./util/toString');

var _toString2 = _interopRequireDefault(_toString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function contains(str, elem) {
  (0, _assertString2.default)(str);
  return str.indexOf((0, _toString2.default)(elem)) >= 0;
}
module.exports = exports['default'];
},{"./util/assertString":62,"./util/toString":64}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = equals;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function equals(str, comparison) {
  (0, _assertString2.default)(str);
  return str === comparison;
}
module.exports = exports['default'];
},{"./util/assertString":62}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.default = escape;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escape(str) {
      (0, _assertString2.default)(str);
      return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\`/g, '&#96;');
}
module.exports = exports['default'];
},{"./util/assertString":62}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAfter;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _toDate = require('./toDate');

var _toDate2 = _interopRequireDefault(_toDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAfter(str) {
  var date = arguments.length <= 1 || arguments[1] === undefined ? String(new Date()) : arguments[1];

  (0, _assertString2.default)(str);
  var comparison = (0, _toDate2.default)(date);
  var original = (0, _toDate2.default)(str);
  return !!(original && comparison && original > comparison);
}
module.exports = exports['default'];
},{"./toDate":57,"./util/assertString":62}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAlpha;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _alpha = require('./alpha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAlpha(str) {
  var locale = arguments.length <= 1 || arguments[1] === undefined ? 'en-US' : arguments[1];

  (0, _assertString2.default)(str);
  if (locale in _alpha.alpha) {
    return _alpha.alpha[locale].test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];
},{"./alpha":4,"./util/assertString":62}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAlphanumeric;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _alpha = require('./alpha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAlphanumeric(str) {
  var locale = arguments.length <= 1 || arguments[1] === undefined ? 'en-US' : arguments[1];

  (0, _assertString2.default)(str);
  if (locale in _alpha.alphanumeric) {
    return _alpha.alphanumeric[locale].test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];
},{"./alpha":4,"./util/assertString":62}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAscii;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-control-regex */
var ascii = /^[\x00-\x7F]+$/;
/* eslint-enable no-control-regex */

function isAscii(str) {
  (0, _assertString2.default)(str);
  return ascii.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase64;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notBase64 = /[^A-Z0-9+\/=]/i;

function isBase64(str) {
  (0, _assertString2.default)(str);
  var len = str.length;
  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }
  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}
module.exports = exports['default'];
},{"./util/assertString":62}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBefore;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _toDate = require('./toDate');

var _toDate2 = _interopRequireDefault(_toDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBefore(str) {
  var date = arguments.length <= 1 || arguments[1] === undefined ? String(new Date()) : arguments[1];

  (0, _assertString2.default)(str);
  var comparison = (0, _toDate2.default)(date);
  var original = (0, _toDate2.default)(str);
  return !!(original && comparison && original < comparison);
}
module.exports = exports['default'];
},{"./toDate":57,"./util/assertString":62}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBoolean;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBoolean(str) {
  (0, _assertString2.default)(str);
  return ['true', 'false', '1', '0'].indexOf(str) >= 0;
}
module.exports = exports['default'];
},{"./util/assertString":62}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isByteLength;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString2.default)(str);
  var min = void 0;
  var max = void 0;
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports['default'];
},{"./util/assertString":62}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString2.default)(str);
  var sanitized = str.replace(/[^0-9]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  var sum = 0;
  var digit = void 0;
  var tmpNum = void 0;
  var shouldDouble = void 0;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
}
module.exports = exports['default'];
},{"./util/assertString":62}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCurrency;

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function currencyRegex(options) {
  var symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?'),
      negative = '-?',
      whole_dollar_amount_without_sep = '[1-9]\\d*',
      whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*',
      valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
      whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?',
      decimal_amount = '(\\' + options.decimal_separator + '\\d{2})?';
  var pattern = whole_dollar_amount + decimal_amount;

  // default is negative sign before symbol, but there are two other options (besides parens)
  if (options.allow_negatives && !options.parens_for_negatives) {
    if (options.negative_sign_after_digits) {
      pattern += negative;
    } else if (options.negative_sign_before_digits) {
      pattern = negative + pattern;
    }
  }

  // South African Rand, for example, uses R 123 (space) and R-123 (no space)
  if (options.allow_negative_sign_placeholder) {
    pattern = '( (?!\\-))?' + pattern;
  } else if (options.allow_space_after_symbol) {
    pattern = ' ?' + pattern;
  } else if (options.allow_space_after_digits) {
    pattern += '( (?!$))?';
  }

  if (options.symbol_after_digits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }

  if (options.allow_negatives) {
    if (options.parens_for_negatives) {
      pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
    } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
      pattern = negative + pattern;
    }
  }

  /* eslint-disable prefer-template */
  return new RegExp('^' +
  // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space
  '(?!-? )(?=.*\\d)' + pattern + '$');
  /* eslint-enable prefer-template */
}

var default_currency_options = {
  symbol: '$',
  require_symbol: false,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_space_after_digits: false
};

function isCurrency(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_currency_options);
  return currencyRegex(options).test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62,"./util/merge":63}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDataURI;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataURI = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; // eslint-disable-line max-len

function isDataURI(str) {
  (0, _assertString2.default)(str);
  return dataURI.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDate;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isISO = require('./isISO8601');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTimezoneOffset(str) {
  var iso8601Parts = str.match(_isISO.iso8601);
  var timezone = void 0,
      sign = void 0,
      hours = void 0,
      minutes = void 0;
  if (!iso8601Parts) {
    str = str.toLowerCase();
    timezone = str.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/);
    if (!timezone) {
      return str.indexOf('gmt') !== -1 ? 0 : null;
    }
    sign = timezone[1];
    var offset = timezone[2];
    if (offset.length === 3) {
      offset = '0' + offset;
    }
    if (offset.length <= 2) {
      hours = 0;
      minutes = parseInt(offset, 10);
    } else {
      hours = parseInt(offset.slice(0, 2), 10);
      minutes = parseInt(offset.slice(2, 4), 10);
    }
  } else {
    timezone = iso8601Parts[21];
    if (!timezone) {
      // if no hour/minute was provided, the date is GMT
      return !iso8601Parts[12] ? 0 : null;
    }
    if (timezone === 'z' || timezone === 'Z') {
      return 0;
    }
    sign = iso8601Parts[22];
    if (timezone.indexOf(':') !== -1) {
      hours = parseInt(iso8601Parts[23], 10);
      minutes = parseInt(iso8601Parts[24], 10);
    } else {
      hours = 0;
      minutes = parseInt(iso8601Parts[23], 10);
    }
  }
  return (hours * 60 + minutes) * (sign === '-' ? 1 : -1);
}

function isDate(str) {
  (0, _assertString2.default)(str);
  var normalizedDate = new Date(Date.parse(str));
  if (isNaN(normalizedDate)) {
    return false;
  }

  // normalizedDate is in the user's timezone. Apply the input
  // timezone offset to the date so that the year and day match
  // the input
  var timezoneOffset = getTimezoneOffset(str);
  if (timezoneOffset !== null) {
    var timezoneDifference = normalizedDate.getTimezoneOffset() - timezoneOffset;
    normalizedDate = new Date(normalizedDate.getTime() + 60000 * timezoneDifference);
  }

  var day = String(normalizedDate.getDate());
  var dayOrYear = void 0,
      dayOrYearMatches = void 0,
      year = void 0;
  // check for valid double digits that could be late days
  // check for all matches since a string like '12/23' is a valid date
  // ignore everything with nearby colons
  dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g);
  if (!dayOrYearMatches) {
    return true;
  }
  dayOrYear = dayOrYearMatches.map(function (digitString) {
    return digitString.match(/\d+/g)[0];
  }).join('/');

  year = String(normalizedDate.getFullYear()).slice(-2);
  if (dayOrYear === day || dayOrYear === year) {
    return true;
  } else if (dayOrYear === '' + day / year || dayOrYear === '' + year / day) {
    return true;
  }
  return false;
}
module.exports = exports['default'];
},{"./isISO8601":33,"./util/assertString":62}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDecimal;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;

function isDecimal(str) {
  (0, _assertString2.default)(str);
  return str !== '' && decimal.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDivisibleBy;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _toFloat = require('./toFloat');

var _toFloat2 = _interopRequireDefault(_toFloat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDivisibleBy(str, num) {
  (0, _assertString2.default)(str);
  return (0, _toFloat2.default)(str) % parseInt(num, 10) === 0;
}
module.exports = exports['default'];
},{"./toFloat":58,"./util/assertString":62}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

var _isByteLength = require('./isByteLength');

var _isByteLength2 = _interopRequireDefault(_isByteLength);

var _isFQDN = require('./isFQDN');

var _isFQDN2 = _interopRequireDefault(_isFQDN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

function isEmail(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_email_options);

  if (options.allow_display_name) {
    var display_email = str.match(displayName);
    if (display_email) {
      str = display_email[1];
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lower_domain = domain.toLowerCase();
  if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 256 })) {
    return false;
  }

  if (!(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

  var user_parts = user.split('.');
  for (var i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}
module.exports = exports['default'];
},{"./isByteLength":16,"./isFQDN":24,"./util/assertString":62,"./util/merge":63}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFDQN(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  var parts = str.split('.');
  if (options.require_tld) {
    var tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (/[\uff01-\uff5e]/.test(part)) {
      // disallow full-width chars
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
},{"./util/assertString":62,"./util/merge":63}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFloat;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;

function isFloat(str, options) {
  (0, _assertString2.default)(str);
  options = options || {};
  if (str === '' || str === '.') {
    return false;
  }
  return float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
}
module.exports = exports['default'];
},{"./util/assertString":62}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fullWidth = undefined;
exports.default = isFullWidth;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fullWidth = exports.fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

function isFullWidth(str) {
  (0, _assertString2.default)(str);
  return fullWidth.test(str);
}
},{"./util/assertString":62}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.halfWidth = undefined;
exports.default = isHalfWidth;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var halfWidth = exports.halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

function isHalfWidth(str) {
  (0, _assertString2.default)(str);
  return halfWidth.test(str);
}
},{"./util/assertString":62}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexColor;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

function isHexColor(str) {
  (0, _assertString2.default)(str);
  return hexcolor.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexadecimal;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexadecimal = /^[0-9A-F]+$/i;

function isHexadecimal(str) {
  (0, _assertString2.default)(str);
  return hexadecimal.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

function isIP(str) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  } else if (version === '6') {
    var blocks = str.split(':');
    var foundOmissionBlock = false; // marker to indicate ::

    // At least some OS accept the last 32 bits of an IPv6 address
    // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
    // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
    // and '::a.b.c.d' is deprecated, but also valid.
    var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
    var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    // initial or final ::
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (var i = 0; i < blocks.length; ++i) {
      // test for a :: which can not be at the string start/end
      // since those cases have been handled above
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        // it has been checked before that the last
        // block is a valid IPv4 address
      } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":62}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISBN;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
var isbn13Maybe = /^(?:[0-9]{13})$/;
var factor = [1, 3];

function isISBN(str) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isISBN(str, 10) || isISBN(str, 13);
  }
  var sanitized = str.replace(/[\s-]+/g, '');
  var checksum = 0;
  var i = void 0;
  if (version === '10') {
    if (!isbn10Maybe.test(sanitized)) {
      return false;
    }
    for (i = 0; i < 9; i++) {
      checksum += (i + 1) * sanitized.charAt(i);
    }
    if (sanitized.charAt(9) === 'X') {
      checksum += 10 * 10;
    } else {
      checksum += 10 * sanitized.charAt(9);
    }
    if (checksum % 11 === 0) {
      return !!sanitized;
    }
  } else if (version === '13') {
    if (!isbn13Maybe.test(sanitized)) {
      return false;
    }
    for (i = 0; i < 12; i++) {
      checksum += factor[i % 2] * sanitized.charAt(i);
    }
    if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) {
      return !!sanitized;
    }
  }
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":62}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISIN;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

function isISIN(str) {
  (0, _assertString2.default)(str);
  if (!isin.test(str)) {
    return false;
  }

  var checksumStr = str.replace(/[A-Z]/g, function (character) {
    return parseInt(character, 36);
  });

  var sum = 0;
  var digit = void 0;
  var tmpNum = void 0;
  var shouldDouble = true;
  for (var i = checksumStr.length - 2; i >= 0; i--) {
    digit = checksumStr.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }

  return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
}
module.exports = exports['default'];
},{"./util/assertString":62}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iso8601 = undefined;

exports.default = function (str) {
  (0, _assertString2.default)(str);
  return iso8601.test(str);
};

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
var iso8601 = exports.iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
/* eslint-enable max-len */
},{"./util/assertString":62}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isIn;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _toString = require('./util/toString');

var _toString2 = _interopRequireDefault(_toString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isIn(str, options) {
  (0, _assertString2.default)(str);
  var i = void 0;
  if (Object.prototype.toString.call(options) === '[object Array]') {
    var array = [];
    for (i in options) {
      if ({}.hasOwnProperty.call(options, i)) {
        array[i] = (0, _toString2.default)(options[i]);
      }
    }
    return array.indexOf(str) >= 0;
  } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    return options.hasOwnProperty(str);
  } else if (options && typeof options.indexOf === 'function') {
    return options.indexOf(str) >= 0;
  }
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":62,"./util/toString":64}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInt;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
var intLeadingZeroes = /^[-+]?[0-9]+$/;

function isInt(str, options) {
  (0, _assertString2.default)(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  var regex = options.hasOwnProperty('allow_leading_zeroes') && options.allow_leading_zeroes ? intLeadingZeroes : int;

  // Check min/max
  var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
  var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;

  return regex.test(str) && minCheckPassed && maxCheckPassed;
}
module.exports = exports['default'];
},{"./util/assertString":62}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isJSON;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isJSON(str) {
  (0, _assertString2.default)(str);
  try {
    var obj = JSON.parse(str);
    return !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  } catch (e) {/* ignore */}
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":62}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isLength;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-rest-params */
function isLength(str, options) {
  (0, _assertString2.default)(str);
  var min = void 0;
  var max = void 0;
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  var len = str.length - surrogatePairs.length;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports['default'];
},{"./util/assertString":62}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLowercase;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isLowercase(str) {
  (0, _assertString2.default)(str);
  return str === str.toLowerCase();
}
module.exports = exports['default'];
},{"./util/assertString":62}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMACAddress;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

function isMACAddress(str) {
  (0, _assertString2.default)(str);
  return macAddress.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMobilePhone;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var phones = {
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
  'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
  'da-DK': /^(\+?45)?(\d{8})$/,
  'el-GR': /^(\+?30)?(69\d{8})$/,
  'en-AU': /^(\+?61|0)4\d{8}$/,
  'en-GB': /^(\+?44|0)7\d{9}$/,
  'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
  'en-IN': /^(\+?91|0)?[789]\d{9}$/,
  'en-NZ': /^(\+?64|0)2\d{7,9}$/,
  'en-ZA': /^(\+?27|0)\d{9}$/,
  'en-ZM': /^(\+?26)?09[567]\d{7}$/,
  'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
  'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
  'fr-FR': /^(\+?33|0)[67]\d{8}$/,
  'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
  'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
  'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
};
/* eslint-enable max-len */

// aliases
phones['en-CA'] = phones['en-US'];

function isMobilePhone(str, locale) {
  (0, _assertString2.default)(str);
  if (locale in phones) {
    return phones[locale].test(str);
  }
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":62}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMongoId;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isHexadecimal = require('./isHexadecimal');

var _isHexadecimal2 = _interopRequireDefault(_isHexadecimal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMongoId(str) {
  (0, _assertString2.default)(str);
  return (0, _isHexadecimal2.default)(str) && str.length === 24;
}
module.exports = exports['default'];
},{"./isHexadecimal":29,"./util/assertString":62}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMultibyte;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-control-regex */
var multibyte = /[^\x00-\x7F]/;
/* eslint-enable no-control-regex */

function isMultibyte(str) {
  (0, _assertString2.default)(str);
  return multibyte.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNull;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNull(str) {
  (0, _assertString2.default)(str);
  return str.length === 0;
}
module.exports = exports['default'];
},{"./util/assertString":62}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumeric;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numeric = /^[-+]?[0-9]+$/;

function isNumeric(str) {
  (0, _assertString2.default)(str);
  return numeric.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSurrogatePair;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

function isSurrogatePair(str) {
  (0, _assertString2.default)(str);
  return surrogatePair.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isFQDN = require('./isFQDN');

var _isFQDN2 = _interopRequireDefault(_isFQDN);

var _isIP = require('./isIP');

var _isIP2 = _interopRequireDefault(_isIP);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

function isURL(url, options) {
  (0, _assertString2.default)(url);
  if (!url || url.length >= 2083 || /\s/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge2.default)(options, default_url_options);
  var protocol = void 0,
      auth = void 0,
      host = void 0,
      hostname = void 0,
      port = void 0,
      port_str = void 0,
      split = void 0;

  split = url.split('#');
  url = split.shift();

  split = url.split('?');
  url = split.shift();

  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
    split[0] = url.substr(2);
  }
  url = split.join('://');

  split = url.split('/');
  url = split.shift();
  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');
  split = hostname.split(':');
  host = split.shift();
  if (split.length) {
    port_str = split.join(':');
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }
  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && host !== 'localhost') {
    return false;
  }
  if (options.host_whitelist && options.host_whitelist.indexOf(host) === -1) {
    return false;
  }
  if (options.host_blacklist && options.host_blacklist.indexOf(host) !== -1) {
    return false;
  }
  return true;
}
module.exports = exports['default'];
},{"./isFQDN":24,"./isIP":30,"./util/assertString":62,"./util/merge":63}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUUID;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

function isUUID(str) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

  (0, _assertString2.default)(str);
  var pattern = uuid[version];
  return pattern && pattern.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUppercase;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isUppercase(str) {
  (0, _assertString2.default)(str);
  return str === str.toUpperCase();
}
module.exports = exports['default'];
},{"./util/assertString":62}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isVariableWidth;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _isFullWidth = require('./isFullWidth');

var _isHalfWidth = require('./isHalfWidth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isVariableWidth(str) {
  (0, _assertString2.default)(str);
  return _isFullWidth.fullWidth.test(str) && _isHalfWidth.halfWidth.test(str);
}
module.exports = exports['default'];
},{"./isFullWidth":26,"./isHalfWidth":27,"./util/assertString":62}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isWhitelisted;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isWhitelisted(str, chars) {
  (0, _assertString2.default)(str);
  for (var i = str.length - 1; i >= 0; i--) {
    if (chars.indexOf(str[i]) === -1) {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
},{"./util/assertString":62}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ltrim;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ltrim(str, chars) {
  (0, _assertString2.default)(str);
  var pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
  return str.replace(pattern, '');
}
module.exports = exports['default'];
},{"./util/assertString":62}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matches;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matches(str, pattern, modifiers) {
  (0, _assertString2.default)(str);
  if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
    pattern = new RegExp(pattern, modifiers);
  }
  return pattern.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeEmail;

var _isEmail = require('./isEmail');

var _isEmail2 = _interopRequireDefault(_isEmail);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_normalize_email_options = {
  lowercase: true,
  remove_dots: true,
  remove_extension: true
};

function normalizeEmail(email, options) {
  options = (0, _merge2.default)(options, default_normalize_email_options);
  if (!(0, _isEmail2.default)(email)) {
    return false;
  }
  var parts = email.split('@', 2);
  parts[1] = parts[1].toLowerCase();
  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    if (options.remove_extension) {
      parts[0] = parts[0].split('+')[0];
    }
    if (options.remove_dots) {
      parts[0] = parts[0].replace(/\./g, '');
    }
    if (!parts[0].length) {
      return false;
    }
    parts[0] = parts[0].toLowerCase();
    parts[1] = 'gmail.com';
  } else if (options.lowercase) {
    parts[0] = parts[0].toLowerCase();
  }
  return parts.join('@');
}
module.exports = exports['default'];
},{"./isEmail":23,"./util/merge":63}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rtrim;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rtrim(str, chars) {
  (0, _assertString2.default)(str);
  var pattern = chars ? new RegExp('[' + chars + ']+$', 'g') : /\s+$/g;
  return str.replace(pattern, '');
}
module.exports = exports['default'];
},{"./util/assertString":62}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stripLow;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _blacklist = require('./blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stripLow(str, keep_new_lines) {
  (0, _assertString2.default)(str);
  var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
  return (0, _blacklist2.default)(str, chars);
}
module.exports = exports['default'];
},{"./blacklist":5,"./util/assertString":62}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toBoolean;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toBoolean(str, strict) {
  (0, _assertString2.default)(str);
  if (strict) {
    return str === '1' || str === 'true';
  }
  return str !== '0' && str !== 'false' && str !== '';
}
module.exports = exports['default'];
},{"./util/assertString":62}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toDate;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toDate(date) {
  (0, _assertString2.default)(date);
  date = Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
}
module.exports = exports['default'];
},{"./util/assertString":62}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toFloat;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toFloat(str) {
  (0, _assertString2.default)(str);
  return parseFloat(str);
}
module.exports = exports['default'];
},{"./util/assertString":62}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toInt;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toInt(str, radix) {
  (0, _assertString2.default)(str);
  return parseInt(str, radix || 10);
}
module.exports = exports['default'];
},{"./util/assertString":62}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = trim;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function trim(str, chars) {
  (0, _assertString2.default)(str);
  var pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
  return str.replace(pattern, '');
}
module.exports = exports['default'];
},{"./util/assertString":62}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.default = unescape;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unescape(str) {
      (0, _assertString2.default)(str);
      return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '\/').replace(/&#96;/g, '\`');
}
module.exports = exports['default'];
},{"./util/assertString":62}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];
},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];
},{}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = toString;
function toString(input) {
  if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null) {
    if (typeof input.toString === 'function') {
      input = input.toString();
    } else {
      input = '[object Object]';
    }
  } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
    input = '';
  }
  return String(input);
}
module.exports = exports['default'];
},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = whitelist;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function whitelist(str, chars) {
  (0, _assertString2.default)(str);
  return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
}
module.exports = exports['default'];
},{"./util/assertString":62}],66:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');

/**
 * @namespace map
 * @type {Object}
 *
 * @description
 * A plain object as a data map extracted from a `<form>`.
 *
 * This is basically an plain object with keys as form fields names and values
 * as their respective values.
 *
 * The values can be strings, numbers or booleans. Currently there is no support
 * for arrays.
 *
 * The keys can be simple alphanumeric values but can be used to describe a nested
 * or deep map if they are dots in the string in plain maps. The dots are to describe
 * `<fieldset>`s in the form and improve the structure of complex forms.
 *
 * If the map is plain and its keys have dots in the strings, it can be converted
 * to a nested map. The inverse is the same, if the map is nested and has possibly
 * many levels of deep objects, it can be converted to a plain map with dots
 * in the keys describing the deep fields.
 *
 * @example
 * // Plain map.
 * const plainMap = {
 *   normal: 'value0',
 *   another: true,
 *   'using.dots.inside': 100
 * };
 *
 * // Nested map.
 * const nestedMap = {
 *   name: 'Romel Pérez',
 *   age: 22,
 *   like: {
 *     apple: true,
 *     watermelon: true,
 *     pumpkin: false
 *   },
 *   favourite: {
 *     fruit: 'Cantaloupe',
 *     book: 'Spice and Wolf',
 *     game: 'World of Warcraft'
 *   }
 * };
 *
 * @see The {@link settings.enableNestedMaps} which is used in the validation
 * methods to determine how to treat the data map. Mainly used in server-side.
 *
 * @see The {@link external:"jQuery.fn".vulcanval jQuery.fn.vulcanval} `getMap`
 * method which extracts a data map from the form or fields used in validation.
 * Used in client-side.
 */

// Plain to nested.
var toNested = function toNested(map) {

  var split, first, last;
  utils.walkObject(map, function (val, prop1) {

    split = prop1.split('.');

    split.forEach(function (str) {
      if (!str.length) {
        log.error('map field name "' + prop1 + '" is invalid');
      }
    });

    last = split[split.length - 1];
    first = prop1.replace('.' + last, '');

    utils.walkObject(map, function (val2, prop2) {
      if (prop1 !== prop2 && first === prop2) {
        log.error('map field name "' + prop2 + '" is invalid');
      }
    });
  });

  var form = {};
  var names = [];

  utils.walkObject(map, function (val, prop) {
    names.push({ keys: prop.split('.'), value: val });
  });

  var obj;
  names.forEach(function (name) {
    obj = form;
    name.keys.forEach(function (key, index) {
      if (index === name.keys.length - 1) {
        obj[key] = name.value;
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    });
  });

  return form;
};

// Nested to plain.
var toPlain = function toPlain(map) {

  var split;

  var form = {};
  var throwErr = function throwErr(key) {
    return log.error('map field name "' + key + '" is invalid');
  };
  var isInvalidKey = function isInvalidKey(str) {
    return str.split('.').length > 1;
  };
  var run = function run(n, o, p) {
    if (o.hasOwnProperty(p)) {
      n += '.' + p;
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean') {
        n = n.substring(1);
        form[n] = o[p];
      } else {
        for (var k in o[p]) {
          if (isInvalidKey(k)) throwErr(k);
          run(n, o[p], k);
        }
      }
    }
  };

  for (var p in map) {
    if (isInvalidKey(p)) throwErr(p);
    run('', map, p);
  }

  return form;
};

/**
 * Convert a map from nested to plain and viceversa.
 *
 * @static
 * @method module:vulcanval.convertMapTo
 *
 * @param  {String} to - It can have two values: `plain` or `nested`.
 * @param  {map} map - The object to convert.
 * @return {Object} The converted object.
 */
module.exports = function (to, map) {

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('second parameter (map) must be an object');
  }

  to = to.toLowerCase();

  switch (to) {
    case 'nested':
      return toNested(map);
    case 'plain':
      return toPlain(map);
    default:
      return map;
  }
};

},{"./log":68,"./utils":78}],67:[function(require,module,exports){
'use strict';

var lang = {
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
    isDivisibleBy: 'The number should be divisible by {{option}}.'
  }
};

module.exports = lang;

},{}],68:[function(require,module,exports){
'use strict';

var Log = require('prhone-log');

module.exports = new Log('vulcanval', {
  scale: 2,
  throwErrors: true
});

},{"prhone-log":2}],69:[function(require,module,exports){
'use strict';

var extend = require('extend');
var validator = require('validator');
var settings = require('./settings');
var log = require('./log');
var utils = require('./utils');
var rawValidation = require('./rawValidation');
var convertMapTo = require('./convertMapTo');
var validateMap = require('./validateMap');
var validateField = require('./validateField');

/**
 * This is a reference to the {@link module:vulcanval}.
 *
 * @name vulcanval
 * @memberof external:jQuery
 * @type {Object}
 * @see {@link module:vulcanval}
 */

/**
 * The vulcan validator (vulcanval) object.
 *
 * This module exposes some static methods to validate data maps extracted maybe
 * extracted from client-side form elements. The data maps are simple plain JavaScript
 * objects with each element name and value in form. The validations configurations
 * are extended from the {@link settings}.
 *
 * In Node.js environments use like:
 *
 * ```js
 * const vulcanval = require('vulcanval');
 * ```
 *
 * In browser environments this object is available in {@link external:jQuery.vulcanval jQuery.vulcanval}.
 *
 * @module vulcanval
 */
module.exports = {

  validator: validator,
  rawValidation: rawValidation,
  convertMapTo: convertMapTo,
  validateField: validateField,
  validateMap: validateMap,

  /**
   * Extend validators messages in an specific localization. If it does not exist,
   * it will be created.
   *
   * @param  {Object} locale - A plain object describing the locale.
   * @param  {String} locale.id - The identifier of the locale. It should be like:
   * `'en'`, `'es'`, `'jp'` or similar.
   * @param  {Object} locale.msgs - A plain object with validators names as keys
   * and messages formats as values. It should have a default value with the key
   * `general`, which will be used when there is no message for an specific validator
   * on error.
   *
   * @example
   * const locale = {
   *   id: 'jp',
   *   msgs: {
   *
   *     // Default error message: "Invalid form field error".
   *     general: '無効なフォームフィールド。',
   *
   *     // Message: "Form field has to be alphanumeric error message."
   *     isAlphanumeric: 'フォームフィールドは、英数字である必要があります。'
   *   }
   * };
   *
   * vulcanval.extendLocale(locale);
   */
  extendLocale: function extendLocale(locale) {
    settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
  },


  /**
   * Set an specific locale as default in validations. The locale has to be
   * already installed with the {@link module:vulcanval.extendLocale vulcanval.extendLocale}
   * method.
   *
   * @param {String} locale - The locale identifier.
   *
   * @example
   * // Configuring messages in Japanese.
   * vulcanval.setLocale('jp');
   */
  setLocale: function setLocale(locale) {
    if (!settings.msgs[locale]) {
      return log.error('the locale "' + locale + '" does not exist');
    }
    settings.locale = locale;
  },


  /**
   * Add a custom validator.
   *
   * All validators in the package {@link https://www.npmjs.com/package/validator validator}
   * are installed and ready to use.
   *
   * @param {String} name - An alphanumeric validator name.
   * @param {Function} validator - The validator function. Receives as a first parameter
   * the value of the field and has to return a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value}.
   * This function will have the {@link utilityContext utility context} as
   * function context. Don't pass
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}
   * or it won't be available.
   *
   * @example
   * vulcanval.addValidator('isGreat', function (value) {
   *   return value.length > 4 && value.indexOf('great') >= 0;
   * });
   *
   * const map = {
   *   field0: 'normal value'
   * };
   *
   * const settings = {
   *   msgs: {
   *     isGreat: 'This field needs to be great!'
   *   },
   *   fields: [{
   *     name: 'field0',
   *     validators: {
   *       isGreat: true
   *     }
   *   }]
   * };
   *
   * const field0Valid = vulcanval.validateField('field0', map, settings);
   * console.log(field0Valid); // 'This field needs to be great!'
   *
   * @see In the example is used the {@link module:vulcanval.validateField vulcanval.validateField}
   * static method to test the new validator.
   */
  addValidator: function addValidator(name, validator) {
    settings.validators[name] = validator;
  },


  /**
   * Change the debug level.
   *
   * @param  {Boolean|Number} isDebug - A `true` value to display all messages.
   * A number to describe the scale of debug logs using the
   * {@link https://github.com/romelperez/prhone-log prhone-log} module to log
   * events. By default the log scale is `2`.
   */
  debug: function debug(isDebug) {
    if (isDebug !== undefined) {
      log.settings.scale = typeof isDebug === 'number' ? isDebug : isDebug ? 10 : 1;
    }
  }
};

},{"./convertMapTo":66,"./log":68,"./rawValidation":76,"./settings":77,"./utils":78,"./validateField":79,"./validateMap":80,"extend":1,"validator":3}],70:[function(require,module,exports){
'use strict';

/**
 * Forces all `<form>` fields or specific field to be invalid.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} forceInvalid - With value `forceInvalid`.
 * @param  {String} [fieldName] - Specific field name.
 * @return {external:jQuery}
 */
module.exports = function (fieldName) {

  var conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};

},{}],71:[function(require,module,exports){
'use strict';

/**
 * Forces all `<form>` fields or specific field to be valid.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} forceValid - With value `forceValid`.
 * @param  {String} [fieldName] - Specific field name.
 * @return {external:jQuery}
 */
module.exports = function (fieldName) {

  var conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};

},{}],72:[function(require,module,exports){
'use strict';

/**
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `getMap`.
 * @return {map} The data {@link map}.
 */
module.exports = function () {

  // This does not necessarily required the plugin instance.

  var conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};

},{}],73:[function(require,module,exports){
'use strict';

/**
 * Inspect the validation status of the `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `inspect`.
 * @param  {String} [fieldName] - Only limite inspection to the field.
 * @return {Object} A plain object with keys as field names and values with objects
 * describing: `{ * value, Boolean isValid, String [msg] }`.
 */
module.exports = function (fieldName) {

  var conf = this.data('vv-config');
  if (!conf) return this;

  //

  return this;
};

},{}],74:[function(require,module,exports){
'use strict';

var inspect = require('./inspect');
var validate = require('./validate');
var forceValid = require('./forceValid');
var forceInvalid = require('./forceInvalid');
var getMap = require('./getMap');

var methods = { inspect: inspect, validate: validate, forceValid: forceValid, forceInvalid: forceInvalid, getMap: getMap };

/**
 * @summary jQuery plugin to set the validators in forms.
 *
 * @description
 * Defines validation functionalities over form elements.
 *
 * This can be instantiated on any form element with a valid attribute `name`,
 * except the `<form>`:
 *
 * - `<form>`
 * - `<input>` with `type` different than `submit` and `button`
 * - `<textarea>`
 * - `<select>`
 *
 * Also, the plugin can be instantiated on any element with a valid input name in
 * attribute `data-vv-name` which will be treated as a normal `<input>`. This is
 * useful to create custom fields/entries.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {settings} settings - Instance settings. This is used to configure the
 * whole validation process.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (settings) {

  if (typeof settings === 'string') {
    if (methods[settings]) {
      var args = Array.prototype.slice.call(arguments, 1);
      return methods[settings].apply(this, args);
    } else {
      throw new Error('jQuery vulcanval method unrecognized "' + settings + '".');
    }
  }

  if (this.data('vv-config')) return;

  var conf = $.extend(true, {
    //
  }, settings);

  this.data('vv-config', conf);

  this.each(function () {

    // HTML
    // All JS configured validators will be merged with the HTML attributes to
    // enable HTML5 form validation integration.

    // EVENTS
    // if (isForm) this.on('submit', evaluate and evaluateInAsyncMode)

    // INIT
    //
  });

  return this;
};

},{"./forceInvalid":70,"./forceValid":71,"./getMap":72,"./inspect":73,"./validate":75}],75:[function(require,module,exports){
'use strict';

/**
 * Validate complete `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `validate`.
 * @param  {String} [fieldName] - Only limite validation to the field.
 * @return {external:jQuery} The same jQuery object.
 */
module.exports = function (fieldName) {

  var conf = this.data('vv-config');
  if (!conf) return this;

  // Should focus the first invalid field if there is.

  return this;
};

},{}],76:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var extend = require('extend');
var validator = require('validator');
var log = require('./log');
var utils = require('./utils');

/**
 * vulcanval.rawValidation()
 *
 * @private
 *
 * @param  {Object} conf
 * @param  {Object} conf.field
 * @param  {String} conf.field.name
 * @param  {*}      conf.field.value
 * @param  {settings} conf.settings
 * @param  {utilityContext} conf.context
 *
 * @return {String|Boolean} `false` if invalid, otherwise the error message.
 */
module.exports = function (conf) {

  if ((typeof conf === 'undefined' ? 'undefined' : _typeof(conf)) !== 'object') {
    return log.error('parameter must be an object');
  }

  log.debug('validating field ' + conf.field.name + '="' + conf.field.value + '"');

  var field = conf.field;
  var settings = conf.settings;
  var context = conf.context;

  field.rules = utils.find(settings.fields, function (vals) {
    if ((typeof vals === 'undefined' ? 'undefined' : _typeof(vals)) !== 'object') {
      return log.error('a field can only have an object to describe its validation');
    }
    return vals.name === field.name;
  });

  if (!field.rules) {
    log.warn('field to validate does not have validators');
    return false;
  }

  // If the value is boolean, we don't go until validators.
  // The package `validator` only accepts strings, if the value is numeric,
  // convert it to string.
  // Void values will be converted to empty strings.
  field.type = _typeof(field.value);
  field.value = field.type === 'number' ? String(field.value) : field.value;
  field.value = field.value === undefined || field.value === null ? '' : field.value;

  // disabled
  if (field.rules.disabled) {
    return false;
  }

  // condition
  if (field.rules.onlyIf && !field.rules.onlyIf.call(context, field.value)) {
    return false;
  }

  // Get a message according to error and error parameters.
  var getMsg = function getMsg(custom, id, opts) {

    id = id ? id : 'general';

    var value = field.value;
    var option = typeof opts === 'string' || typeof opts === 'number' ? opts : '';
    var options = (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object' ? opts : null;
    var params = extend({}, { value: value, option: option }, options);

    // If it is custom, the message can be by locales or can be universal.
    if (custom) {
      return utils.format((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' ? id[settings.locale] : id, params);
    } else {
      return utils.format(settings.getMsgTemplate(id), params);
    }
  };

  var err = null;

  // required
  if (field.rules.required) {
    if (field.type === 'boolean') {
      if (field.value) {
        return false;
      } else {
        err = getMsg();
      }
    } else if (field.value === '') {
      err = getMsg();
    }
  } else {
    if (field.value === '' || field.type === 'boolean') {
      return false;
    }
  }

  utils.everyInObject(field.rules.validators, function (val, valName) {

    // There is already an error.
    if (err) {
      return true;
    }

    // Validator disabled.
    if (val === false) {
      return true;
    }

    var hasMsg, pattern;

    var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
    var valOpts = valType === 'object' || valType === 'string' || valType === 'number' ? val : undefined;

    // isLength validator.
    if (valName === 'isLength') {
      if (valType !== 'object' || !val.min || !val.max) {
        return log.error('fields validator "isLength" must be a plain object if defined');
      }
      if (field.value.length < (valOpts.min || 0)) {
        err = getMsg(false, 'isLength.min', val);
      } else if (valOpts.max && field.value.length > valOpts.max) {
        err = getMsg(false, 'isLength.max', val);
      }
      return true;
    }

    // matches validator (accepts a plain object and a regular expression)
    else if (valName === 'matches') {
        if (valType !== 'object') {
          return log.error('fields validator "matches" must be a plain object or RegExp');
        }
        hasMsg = !(val instanceof RegExp) && val.msgs;
        pattern = hasMsg ? val.pattern : val;
        if (!validator.matches(field.value, pattern)) {
          err = getMsg(hasMsg, hasMsg ? val.msgs : 'general', val);
        }
        return true;
      }

      // Custom validator.
      else if (settings.validators[valName]) {
          if (!settings.validators[valName].call(context, field.value, valOpts)) {
            err = getMsg(false, valName, val);
          }
          return true;
        }

        // `validator` validator.
        else if (validator[valName]) {
            if (!validator[valName](field.value, valOpts)) {
              err = getMsg(false, valName, val);
            }
            return true;
          }

          // Not found.
          else {
              return log.error('validator "' + valName + '" was not found');
            }
  });

  log.info('invalid field ' + conf.field.name + '="' + conf.field.value + '":', err);

  return !err ? false : err;
};

},{"./log":68,"./utils":78,"extend":1,"validator":3}],77:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extend = require('extend');
var utils = require('./utils');

/**
 * @namespace settings
 * @type {Object}
 *
 * @description
 * vulcanval validation settings by default.
 *
 * When using validation methods you have to pass an object settings to
 * configure the validation process which will overwrite this settings used by
 * default.
 */
var settings = {

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * What event to listen to trigger the first validation on fields.
   *
   * @type {String}
   * @default 'blur change'
   */
  firstValidationEvent: 'blur change',

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * After first validation, what events to listen to re-validate fields.
   *
   * @type {String}
   * @default 'input blur change'
   */
  validationEvents: 'input blur change',

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * Validate field elements on instance time.
   *
   * @type {Boolean}
   * @default false
   */
  autostart: false,

  /**
   * Only client-side. Overwritten by {@link fieldSettings}.
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * @type {Boolean}
   * @default false
   */
  intern: false,

  /**
   * Only client-side. Only for `<form>`.
   *
   * Enable asynchronous validations. The UI API will behave differently.
   *
   * @type {Boolean}
   * @default false
   */
  async: false,

  /**
   * Only client-side. Only for `<form>`.
   *
   * Disable HTML5 validation with novalidate attribute when instanced on `<form>`.
   * This is enabled if attribute "novalidate" is present.
   *
   * @type {Boolean}
   * @default false
   */
  disableHTML5Validation: false,

  /**
   * Only client-side. Only for `<form>`.
   *
   * HTML tag classes to add to specific elements in form on error.
   * @type {Object}
   */
  classes: {
    error: {
      form: '',
      label: '',
      input: '',
      display: ''
    }
  },

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields?
   *
   * Validation methods use this property to convert data {@link map maps} from
   * nested maps to plain maps when this property is enabled.
   *
   * @type {Boolean}
   *
   * @example
   * // Using a form like this:
   * // <form>
   * //  <input name="field1" />
   * //  <input name="map1.field2" />
   * //  <input name="map1.field3" />
   * //  <input name="map2.field4" />
   * // </form>
   *
   * const map = $('form').vulcanval('getMap');
   *
   * // If nested maps are enabled, the map object will have this value:
   * // { field1: '', map1: { field2: '', field3: '' }, map2: { field4: '' } }
   *
   * // Otherwise:
   * // { field1: '', 'map1.field2': '', 'map1.field3': '', 'map2.field4': '' }
   *
   * @see {@link external:"jQuery.fn".vulcanval}
   */
  enableNestedMaps: false,

  /**
   * List of custom validators.
   *
   * @see To add new custom validators {@link module:vulcanval.addValidator vulcanval.addValidator}.
   * @type {Object}
   *
   * @property {Function} isEqualToField - This field value has to be the same as
   * another field the form. The name of the comparing field should be set as a
   * string parameter.
   */
  validators: {
    isEqualToField: function isEqualToField(value, opts) {
      return value === this.get(opts);
    }
  },

  /**
   * Default messages locale.
   *
   * @type {String}
   * @default 'en'
   */
  locale: 'en',

  /**
   * Validators messages formats. This is an a plain object with keys as validator
   * names and values as messages formats. The messages can be configured by
   * locale otherwise the messages will be for the validator regardless the
   * locale configured.
   *
   * If a validator does not have a message for a locale, it will be search in this order:
   *
   * - `general` message in locale
   * - locale `defaults`
   * - `general` message in `defaults` locale
   *
   * The formats can have some variables expressed as `{{var}}` where `var` is the
   * variable name.
   *
   * - The variable `{{value}}` is always present to use.
   * - The variable `{{option}}` can be used when the validator is configured
   *   with an string. Ex: in validator `isAlphanumeric: 'de-DE'`, the
   *   variable will have the `de-DE` value.
   * - If the validator is configured with an object, then its properties are
   *   available as variables. Ex: in `isInt: {min:4, max:8}`, `{{min}}` and `{{max}}`
   *   will be available as variables in the message.
   *
   * There is one exception, the validator `isLength` can have an specific message
   * for its two properties to configure, min and max values. Other validators only
   * have messages regardless the properties passes to it. See examples.
   *
   * Also, the order of validator messages on errors can vary.
   *
   * @type {Object}
   * @default {}
   *
   * @example
   * const map = {
   *   username: 'Romel Pérez',
   *   age: 720
   * };
   *
   * const settings = {
   *
   *   locale: 'es',
   *   msgs: {
   *
   *     // Used regardless the locale.
   *     isAlphanumeric: 'Debe ser alfanumérico en local "{{option}}".',
   *
   *     // Configured by locale.
   *     isInt: {
   *       en: 'Value "{{value}}" must be a integer number.',
   *       es: 'Valor "{{value}}" debe ser número entero.'
   *     },
   *
   *     // This is an special case. We can configure by properties only in this validator.
   *     isLength: {
   *
   *       // We can configure a global message when the validator fails in this property.
   *       min: 'Mínimo valor: {{min}}.',
   *
   *       // And we can configure by locale too.
   *       max: {
   *         en: 'Maximum value: {{max}}.',
   *         es: 'Máximo valor: {{max}}.'
   *       }
   *     }
   *   },
   *
   *   fields: [{
   *     name: 'username',
   *     validators: {
   *       isAlphanumeric: 'en-GB',
   *       isLength: { min: 4, max: 16 },
   *       isLowercase: true  // If this fails, the default message will be used
   *     }
   *   }, {
   *     name: 'age',
   *     validators: {
   *       isInt: { max: 500 }
   *     }
   *   }]
   * };
   *
   * let usernameValid = vulcanval.validateField('username', map, settings);
   * console.log(usernameValid); // 'Debe ser alfanumérico en local "en-GB".'
   *
   * map.username = 'rp';
   * usernameValid = vulcanval.validateField('username', map, settings);
   * console.log(usernameValid); // 'Mínimo valor: 4.'
   *
   * let ageValid = vulcanval.validateField('age', map, settings);
   * console.log(ageValid); // 'Valor "720" debe ser número entero.'
   */
  msgs: {
    defaults: {}
  },

  /**
   * The form fields to configure.
   *
   * @type {Array}
   * @default [ ]
   */
  fields: [],

  /**
   * Extend settings.
   *
   * @private
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} Extended settings.
   */
  extend: function extend(custom) {
    var _this = this;

    custom = _extend(true, {}, custom);

    // Interpolate messages by validator to messages by locale.
    if (custom.msgs) {
      (function () {

        var locales = [];
        utils.walkObject(_this.msgs, function (msgs, locale) {
          if (locale !== 'defaults') locales.push(locale);
        });

        var msgs = custom.msgs;
        var newMsgs = {};

        var setMsgInLocale = function setMsgInLocale(locale, name, msg) {
          if (!newMsgs[locale]) newMsgs[locale] = {};
          newMsgs[locale][name] = msg;
        };
        var setMsgAsDefault = function setMsgAsDefault(name, msg) {

          // A default message will be set as the only one to search.
          if (!newMsgs.defaults) newMsgs.defaults = {};
          newMsgs.defaults[name] = msg;

          // Locale messages will be set to empty.
          locales.forEach(function (locale) {
            if (!newMsgs[locale]) newMsgs[locale] = {};
            newMsgs[locale][name] = null;
          });
        };

        utils.walkObject(msgs, function (messages, validatorName) {

          // Messages for properties in validator.
          // At the moment, only isLength works this way.
          if (validatorName === 'isLength') {
            var properties = messages;
            utils.walkObject(properties, function (value, property) {
              if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                utils.walkObject(value, function (message, locale) {
                  setMsgInLocale(locale, validatorName + '.' + property, message);
                });
              } else {
                setMsgAsDefault(validatorName + '.' + property, value);
              }
            });
          }

          if ((typeof messages === 'undefined' ? 'undefined' : _typeof(messages)) === 'object') {
            utils.walkObject(messages, function (message, locale) {
              setMsgInLocale(locale, validatorName, message);
            });
          } else {
            setMsgAsDefault(validatorName, messages);
          }
        });

        custom.msgs = newMsgs;
      })();
    }

    return _extend(true, {}, this, custom);
  },


  /**
   * Get a message template according to locale.
   *
   * @private
   * @param  {String} id - Validator identifier.
   * @return {String}
   */
  getMsgTemplate: function getMsgTemplate(id) {

    // locale with validator
    if (this.msgs[this.locale] && this.msgs[this.locale][id]) {
      return this.msgs[this.locale][id];
    } else if (this.msgs.defaults[id]) {
      return this.msgs.defaults[id];
    }

    // locale general
    else if (this.msgs[this.locale] && this.msgs[this.locale].general) {
        return this.msgs[this.locale].general;
      }

      // default general
      else {
          return this.msgs.defaults.general;
        }
  }
};

module.exports = settings;

},{"./utils":78,"extend":1}],78:[function(require,module,exports){
(function (global){
'use strict';

module.exports = {

  /**
   * Is the environment Node.js?
   * Snippet source: https://github.com/iliakan/detect-node
   * @type {Boolean}
   */
  isNodejs: function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch (e) {}
    return isNodejs;
  }(),

  walkObject: function walkObject(obj, callback, context) {

    if (!context) context = obj;

    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        callback.call(context, obj[p], p);
      }
    }

    return obj;
  },
  everyInObject: function everyInObject(obj, callback, context) {

    if (!context) context = obj;

    var keep;

    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        keep = callback.call(context, obj[name], name);
        if (!keep) return false;
      }
    }

    return !!keep;
  },
  findInObject: function findInObject(obj, callback, context) {

    if (!context) context = obj;

    var found;

    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        found = callback.call(context, obj[p], p);
        if (found) return obj[p];
      }
    }

    return obj;
  },
  find: function find(arr, callback, context) {

    if (!context) context = arr;

    for (var i = 0; i < arr.length; i++) {
      if (callback.call(context, arr[i], i)) {
        return arr[i];
      }
    }
  },
  format: function format(str, params) {

    str = String(str);
    params = params || {};

    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        str = str.replace(new RegExp('{{' + p + '}}', 'g'), params[p]);
      }
    }

    return str;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],79:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var validator = require('validator');
var extend = require('extend');
var settings = require('./settings');
var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate a field in provided data {@link map} using the provided validation {@link settings}.
 *
 * @static
 * @method module:vulcanval.validateField
 *
 * @param  {String} fieldName - The field name in data map. If the {@link map} is nested,
 * the field name is set as in plain map. Ex: `{user: {name: 'romel'}}` will be `'user.name'`.
 * @param  {map} map - The data map (plain or nested).
 * @param  {settings} settings - The validation settings.
 *
 * @return {Boolean|String} If it is valid, `false` will be returned. Otherwise
 * there will be an string message describing the error.
 *
 * @example
 * const map = {
 *   name: 'Romel',
 *   age: 22,
 *   likesPumpkin: false
 * };
 *
 * const settings = {
 *   fields: [{
 *     name: 'name',
 *     required: true,
 *     validators: {
 *       isAlphanumeric: 'en-US',
 *       isLowercase: true
 *     }
 *   }, {
 *     name: 'age',
 *     validators: {
 *       isInt: { min: 1, max: 500 }
 *     }
 *   }]
 * };
 *
 * const nameResult = vulcanval.validateField('name', map, settings);
 * console.log(nameResult); // 'This field should only contain lowercase text.'
 *
 * const ageResult = vulcanval.validateField('age', map, settings);
 * console.log(ageResult); // false
 */
module.exports = function (fieldName, map, customSettings) {

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('second parameter (map) must be an object');
  }
  if ((typeof customSettings === 'undefined' ? 'undefined' : _typeof(customSettings)) !== 'object') {
    return log.error('third parameter (settings) must be an object');
  }

  customSettings = settings.extend(customSettings);

  if (customSettings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  var context = {
    validator: validator,
    settings: customSettings,
    get: function get(name) {
      return map[name];
    }
  };

  var isValidField = rawValidation({
    field: {
      name: fieldName,
      value: map[fieldName]
    },
    settings: customSettings,
    context: context
  });

  return isValidField;
};

},{"./convertMapTo":66,"./log":68,"./rawValidation":76,"./settings":77,"./utils":78,"extend":1,"validator":3}],80:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var validator = require('validator');
var extend = require('extend');
var settings = require('./settings');
var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate provided data map using the provided validation settings and get an
 * object describing each field error if there are.
 *
 * @static
 * @method module:vulcanval.validateMap
 *
 * @param  {map} map - The data map.
 * @param  {settings} settings - The validation settings.
 *
 * @return {Boolean|Object} If the map is valid, `false` will be returned. Otherwise
 * there will be an object describing each field error as a plain map with its
 * keys as the fields names even if the property {@link settings.enableNestedMaps}
 * is enabled. Use the {@link vulcanval.convertMapTo} method if needed.
 *
 * @example
 * const map = {
 *   name: 'Romel',
 *   age: 22,
 *   likesPumpkin: false
 * };
 *
 * const settings = {
 *   fields: [{
 *     name: 'name',
 *     required: true,
 *     validators: {
 *       isAlphanumeric: 'en-US',
 *       isLowercase: true
 *     }
 *   }, {
 *     name: 'age',
 *     validators: {
 *       isInt: { min: 1, max: 500 }
 *     }
 *   }, {
 *     name: 'likesPumpkin',
 *     required: true
 *   }]
 * };
 *
 * const result = vulcanval.validateMap(map, settings);
 * console.log(result);
 * // {
 * //   name: 'This field should only contain lowercase text.',
 * //   likesPumpkin: 'Please fill out this field.'
 * // }
 *
 * map.name = 'romel';
 * map.likesPumpkin = true;
 * const result2 = vulcanval.validateMap(map, settings);
 * console.log(result2);
 * // false
 */
module.exports = function (map, customSettings) {

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('first parameter (map) must be an object');
  }
  if ((typeof customSettings === 'undefined' ? 'undefined' : _typeof(customSettings)) !== 'object') {
    return log.error('second parameter (settings) must be an object');
  }

  customSettings = settings.extend(customSettings);

  if (customSettings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  var context = {
    validator: validator,
    settings: customSettings,
    get: function get(name) {
      return map[name];
    }
  };

  var errors = {};

  customSettings.fields.forEach(function (field) {

    var err = rawValidation({
      field: {
        name: field.name,
        value: map[field.name]
      },
      settings: customSettings,
      context: context
    });

    if (err) {
      log.debug('invalid field name="' + field.name + '" with value=' + map[field.name] + ':', err);
      errors[field.name] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};

},{"./convertMapTo":66,"./log":68,"./rawValidation":76,"./settings":77,"./utils":78,"extend":1,"validator":3}],81:[function(require,module,exports){
'use strict';

/**
 * jQuery object.
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

var log = require('./log');
var utils = require('./utils');
var vulcanval = require('./main');
var plugin = require('./plugin/plugin');
var localeEN = require('./localization/en');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

// Expose the public API.
if (!utils.isNodejs) {
  if (window.jQuery) {
    window.jQuery.vulcanval = vulcanval;
    window.jQuery.fn.vulcanval = plugin;
  } else {
    log.error('jQuery is required to perform operations');
  }
}

module.exports = vulcanval;

},{"./localization/en":67,"./log":68,"./main":69,"./plugin/plugin":74,"./utils":78}]},{},[81]);
