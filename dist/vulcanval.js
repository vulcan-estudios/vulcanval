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
(function (global){
'use strict';

var browser = {

  isNodejs: function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch (e) {}
    return isNodejs;
  }(),

  perform: function perform(isNeeded, fn) {
    if (!browser.isNodejs) {
      if (window.jQuery) {
        fn();
      } else if (isNeeded) {
        throw new Error('jQuery is required to perform operations');
      }
    }
  }
};

module.exports = browser;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],67:[function(require,module,exports){
'use strict';

var extend = require('extend');
var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');

/**
 * Clean a map from properties outside the validation process.
 *
 * This is done by removing all properties which are not present in the fields
 * list of validation and the fields which are disabled or intented to be
 * only used in client side.
 *
 * @static
 * @method module:vulcanval.cleanMap
 *
 * @param  {Boolean} isPlain - If the {@link map} is plain. `false` for nested.
 * @param  {map} map - The map to clean.
 * @param  {settings} settings - The validation settings.
 *
 * @return {map} - The cleaned map.
 */
module.exports = function (isPlain, map, settings) {
  'use strict';

  if (!isPlain) {
    map = convertMapTo('plain', map);
  }

  var newMap = {};

  settings.fields.forEach(function (field) {
    if (field.disabled || field.onlyUI) return;
    newMap[field.name] = map[field.name];
  });

  if (!isPlain) {
    return convertMapTo('nested', newMap);
  }

  return newMap;
};

},{"./convertMapTo":68,"./log":73,"./utils":90,"extend":1}],68:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');

// Plain to nested.
var toNested = function toNested(map) {

  var split, first, last;
  utils.walkObject(map, function (val, prop1) {

    split = prop1.split('.');

    if (!utils.validateFieldName(prop1)) {
      log.error('map field name "' + prop1 + '" is invalid');
    }

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
  'use strict';

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

},{"./log":73,"./utils":90}],69:[function(require,module,exports){
'use strict';

/**
 * @name isAlphanumericText
 * @memberof settings.validators
 * @function
 *
 * @description
 * This is the same as the validator `isAlphanumeric` except that this cleans
 * spaces and line endings before validating so the field needs to have valid
 * alphanumeric strings.
 */
module.exports = function isAlphanumericText(value, locale) {
  value = value.replace(/\s/g, '').replace(/\r?\n/g, '');
  locale = typeof locale === 'string' ? locale : undefined;
  return this.validator.isAlphanumeric(value, locale);
};

},{}],70:[function(require,module,exports){
"use strict";

/**
 * @name isEqualToField
 * @memberof settings.validators
 * @function
 *
 * @description
 * This field value has to be the same as another field the form. The name of
 * the comparing field should be set as a string parameter.
 */
module.exports = function isEqualToField(value, field) {
  return value === this.get(field);
};

},{}],71:[function(require,module,exports){
'use strict';

var _extend = require('extend');
var utils = require('./utils');

/**
 * @namespace fieldSettings
 * @type {Object}
 *
 * @description
 * The default properties and methods for a field in vulcanval {@link settings.fields}
 * configuration.
 */
var fieldSettings = {

  /**
   * The field name. This property is always required.
   *
   * @type {String}
   */
  name: null,

  /**
   * Field will be ignored in validation if `true`.
   *
   * @type {Boolean}
   * @default false
   */
  disabled: false,

  /**
   * Field is required and cannot be undefined. If the field is not required but
   * it has a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value},
   * then this will pass over all validators.
   *
   * @type {Boolean}
   * @default false
   */
  required: false,

  /**
   * The validators list. This is an object with keys as the validators names and
   * values as their configuration. If the value is simply a boolean `true`,
   * the validator will be invoked without options. It it is string, number or
   * object it will be send as validator options. If value is `false`, the validator
   * will not be used.
   *
   * These won't be used if the field value is boolean.
   *
   * You can use all validators from the {@link https://www.npmjs.com/package/validator validator}
   * package.
   *
   * @type {Object}
   */
  validators: null,

  /**
   * Only client-side.
   *
   * What event to listen to trigger the first validation on field.
   *
   * @type {String}
   * @default Inherited from {@link settings}
   */
  firstValidationEvent: null,

  /**
   * Only client-side.
   *
   * After first validation, what events to listen to re-validate field.
   *
   * @type {String}
   * @default Inherited from {@link settings}
   */
  validationEvents: null,

  /**
   * Only client-side.
   *
   * Validate field elements on instance time.
   *
   * @type {Boolean}
   * @default false
   */
  autostart: false,

  /**
   * Only client-side.
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * If the field is an `<input>` type `hidden`, this will be set as `true`.
   *
   * @type {Boolean}
   * @default false
   */
  intern: false,

  /**
   * Only client-side.
   *
   * Ignore field in validation in server side.
   *
   * @type {Boolean}
   * @default false
   */
  onlyUI: false,

  /**
   * Only client-side.
   *
   * The element where to set the current field message error. If not specified,
   * the messages won't be shown on UI. This is a jQuery selector.
   *
   * @type {external:jQuery}
   */
  display: null,

  /**
   * Only client-side.
   *
   * Display jQuery element.
   *
   * @private
   * @type {external:jQuery}
   */
  $display: null,

  /**
   * Only client-side.
   *
   * jQuery `<label>` elements which have `for` attribute to the field element.
   *
   * @private
   * @type {external:jQuery}
   */
  $labels: null,

  /**
   * Only client-side.
   *
   * Field jQuery element.
   *
   * The field node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If the field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If the field is valid. undefined if it's unknown.
   * - {Boolean|String} vv-msg - The error message if field is invalid. false if
   *   field is valid.
   *
   * The field node element triggers an event called `vv-modify` to inform about
   * a change in the field which affects the validation process. This event
   * receives an object parameter describing:
   * - {String} name - Field name.
   * - {*} value - Field value.
   * - {Boolean} valid - Field status.
   * - {Boolean|String} msg - If field is invalid the error, otherwise false.
   *
   * @private
   * @type {external:jQuery}
   */
  $el: null,

  /**
   * Only client-side.
   *
   * Field onFirstChange event (this is defined by user).
   *
   * @private
   * @type {Function}
   */
  onFirstChange: null,

  /**
   * Only client-side.
   *
   * Field onChange event (this is defined by user).
   *
   * @private
   * @type {Function}
   */
  onChange: null,

  /**
   * Only client-side.
   *
   * Field onBlur event.
   *
   * @private
   * @type {Function}
   */
  onBlur: null,

  /**
   * A condition gate to verify if the field will be validated. Receives
   * the field value as first parameter and has to return a boolean, if `true`
   * the validation will procced as normal, otherwise the validation will halt.
   *
   * This is a function
   * with the {@link utilityContext utility context} as function context so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * @method
   * @return {Boolean}
   */
  onlyIf: null,

  /**
   * Only client-side.
   *
   * Method to get the value of the field. This will have the {@link utilityContext utilty context}
   * so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * By default this can retrieve the value of `<input>`s of any kind except `submit`, 'reset'
   * and `button`, `<textarea>`s and `<select>`s.
   *
   * You can overwrite this to create your own custom field value getter.
   *
   * @param  {external:jQuery} $field - The field element.
   * @return {*} The value returned will depend on the type of element.
   */
  value: function value($field) {

    // @FIXIT: Make the space trimmer works with an option.

    var type, name, val;

    if (!$field) {
      return;
    } else if ($field[0].tagName === 'INPUT') {

      type = String($field.attr('type')).toUpperCase();
      name = $field.attr('name') || $field.data('vv-name');

      if (type === 'CHECKBOX') {
        return $field.prop('checked');
      }
      if (type === 'RADIO') {
        return $field.parents('form, body').first().find('input[type="radio"][name="' + name + '"]:checked').val() || '';
      } else if (type !== 'BUTTON' && type !== 'SUBMIT' && type !== 'RESET') {
        return utils.trimSpaces($field.val());
      }
    } else if ($field[0].tagName === 'TEXTAREA' || $field[0].tagName === 'SELECT') {
      return utils.trimSpaces($field.val());
    }
  },


  /**
   * Extend field settings default configuration.
   *
   * @private
   * @param  {Object} custom
   * @return {Object}
   */
  extend: function extend(custom) {
    return _extend(true, {}, this, custom);
  }
};

module.exports = fieldSettings;

},{"./utils":90,"extend":1}],72:[function(require,module,exports){
'use strict';

var browser = require('../browser');

var lang = {
  id: 'en',
  msgs: {
    general: 'Please fill out this field.',
    isEqualToField: 'The field has to be the same.',
    isAlphanumericText: 'Please type only alphanumeric text.',
    'isLength.min': 'The field should contain at least {{min}} characters.',
    'isLength.max': 'The field should contain at most {{max}} characters.',
    isEmail: 'Please type a valid email address.',
    isNumeric: 'Please type a valid positive number.',
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
    isBoolean: 'This field should be boolean.'
  }
};

browser.perform(false, function () {
  window.vulcanval.extendLocale(lang);
  window.vulcanval.setLocale(lang.id);
});

module.exports = lang;

},{"../browser":66}],73:[function(require,module,exports){
'use strict';

var Log = require('prhone-log');

module.exports = new Log('vulcanval', {
  scale: 2,
  throwErrors: true
});

},{"prhone-log":2}],74:[function(require,module,exports){
'use strict';

var log = require('./log');
var utils = require('./utils');
var vulcanval = require('./vulcanval');
var plugin = require('./plugin/plugin');
var localeEN = require('./locale/en');
var isEqualToField = require('./customValidators/isEqualToField');
var isAlphanumericText = require('./customValidators/isAlphanumericText');

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.setLocale('en');

// Install custom validators.
vulcanval.addValidator('isEqualToField', isEqualToField);
vulcanval.addValidator('isAlphanumericText', isAlphanumericText);

module.exports = vulcanval;

},{"./customValidators/isAlphanumericText":69,"./customValidators/isEqualToField":70,"./locale/en":72,"./log":73,"./plugin/plugin":85,"./utils":90,"./vulcanval":93}],75:[function(require,module,exports){
'use strict';

var ui = require('./_ui');

/**
 * On field change.
 *
 * @private
 * @param  {settings} settings
 * @param  {fieldSettings} field
 */
var change = function change(settings, field) {
  'use strict';

  var invalid = field.$el.vulcanval('inspect', field.name);
  var wasInvalid = field.$el.data('vv-valid') === false;
  var lastMsg = field.$el.data('vv-msg');

  // Field general.
  field.$el.data({
    'vv-modified': true,
    'vv-msg': invalid
  });

  // Field invalid.
  if (invalid) {
    field.$el.data('vv-valid', false);

    if (!field.intern && !settings.intern && field.$display) {
      field.$display.html(invalid);
    }

    ui.addFieldErrorClasses(settings, field);

    if (wasInvalid && lastMsg !== invalid) {
      ui.updateFieldErrorClasses(settings, field);
    }
  }

  // Field valid.
  else {
      field.$el.data('vv-valid', true);
      ui.removeFieldErrorClasses(settings, field);
    }

  ui.refreshFormState(settings);

  field.$el.trigger('vv-modify', {
    name: field.name,
    value: field.value(),
    valid: !invalid,
    msg: invalid
  });
};

module.exports = change;

},{"./_ui":82}],76:[function(require,module,exports){
'use strict';

var validator = require('validator');
var settings = require('../settings');
var utils = require('../utils');
var log = require('../log');
var fieldSettings = require('../fieldSettings');
var ui = require('./_ui');

/**
 * Create final settings from fetched from UI and provided from user.
 *
 * @private
 * @param  {external:jQuery} $el
 * @param  {settings} fetched
 * @param  {settings} custom
 * @return {settings}
 */
var createSettings = function createSettings($el, fetched, custom) {
  'use strict';

  // Extend every specific field settings.

  var fetchedFields = fetched.fields || [];
  delete fetched.fields;

  var customFields = custom.fields || [];
  delete custom.fields;

  var newFields = [];

  customFields.forEach(function (customField) {
    var fetchedField = utils.find(fetchedFields, function (field) {
      return field.name === customField.name;
    });

    if (fetchedField) {
      $.extend(true, fetchedField, customField);
      newFields.push(fieldSettings.extend(fetchedField));
    } else {
      newFields.push(fieldSettings.extend(customField));
    }
  });

  fetchedFields.forEach(function (fetchedField) {
    if (!utils.find(newFields, function (nf) {
      return nf.name === fetchedField.name;
    })) {
      newFields.push(fieldSettings.extend(fetchedField));
    }
  });

  newFields.forEach(function (f) {
    if (!f.$el) log.warn('field "' + f.name + '" does not have DOM element');
  });

  // Extend base settings with fetched and custom settings.
  var newSettings = settings.extend(fetched);
  newSettings = newSettings.extend(custom);

  newSettings.fields = newFields;

  if ($el[0].tagName === 'FORM') {
    newSettings.$form = $el;
  }

  // Create an utility context. This will be used in all methods using the
  // '../utilityContext.js' function context.
  newSettings.context = {
    validator: validator,
    get: function get(getFieldName) {
      var getField = utils.find(newSettings.fields, function (f) {
        return f.name === getFieldName;
      });
      if (getField) {
        return getField.value && getField.value();
      } else {
        log.warn('field "' + getFieldName + '" not found');
      }
    }
  };

  return newSettings;
};

module.exports = createSettings;

},{"../fieldSettings":71,"../log":73,"../settings":89,"../utils":90,"./_ui":82,"validator":3}],77:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var ui = require('./_ui');

/**
 * Fetch UI elements settings configured as nodes attributes and properties.
 *
 * @private
 * @param  {external:jQuery} $el - Element on instance.
 * @param  {external:jQuery} $fields - Fields filtered.
 * @return {settings}
 */
var fetchUISettings = function fetchUISettings($el, $fields) {
  'use strict';

  var fetched = {};
  var elTag = $el[0].tagName;

  // Fetch form settings.
  if (elTag === 'FORM') {

    var disabled = ui.getAttr($el, 'disabled');
    var intern = ui.getAttr($el, 'intern') !== void 0;
    var autostart = ui.getAttr($el, 'autostart') !== void 0;
    var novalidate = ui.getAttr($el, 'novalidate') !== void 0;

    if (disabled) fetched.disabled = true;
    if (intern) fetched.intern = true;
    if (autostart) fetched.autostart = true;
    if (novalidate) fetched.disableHTML5Validation = true;

    var locale = ui.getAttr($el, 'locale');
    if (locale) fetched.locale = locale;
  }

  // Fetch fields settings.
  var fields = [];

  fetched.fields = fields;

  $fields.each(function (i, f) {

    var $f = $(f);
    var name = ui.getAttr($f, 'name');
    var type = ui.getAttr($f, 'type');

    var field = { name: name, $el: $f };
    var validators = {};

    var disabled = ui.getAttr($f, 'disabled') !== void 0;
    var required = ui.getAttr($f, 'required') !== void 0;
    var autostart = ui.getAttr($f, 'autostart') !== void 0;
    var intern = ui.getAttr($f, 'intern') !== void 0;

    if (disabled) field.disabled = true;
    if (required) field.required = true;
    if (autostart) field.autostart = true;
    if (intern) field.intern = true;

    var display = ui.getAttr($f, 'display');
    if (display) field.display = display;

    var minlength = ui.getAttr($f, 'minlength');
    var maxlength = ui.getAttr($f, 'maxlength');
    if (minlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.min = +minlength;
    }
    if (maxlength) {
      if (!validators.isLength) validators.isLength = {};
      validators.isLength.max = +maxlength;
    }

    var min = ui.getAttr($f, 'min');
    var max = ui.getAttr($f, 'max');
    if (type === 'number') {
      validators.isFloat = true;
      if (min) {
        if (validators.isFloat === true) validators.isFloat = {};
        validators.isFloat.min = +min;
      }
      if (max) {
        if (validators.isFloat === true) validators.isFloat = {};
        validators.isFloat.max = +max;
      }
    }

    if (type === 'email') validators.isEmail = true;
    if (type === 'url') validators.isURL = true;
    if (type === 'datetime') validators.isDate = true;

    var pattern = ui.getAttr($f, 'pattern');
    var patternMsgs = ui.getAttr($f, 'pattern-msgs');
    if (pattern) {
      pattern = new RegExp(pattern);
      validators.matches = pattern;
      if (patternMsgs) validators.matches = { pattern: pattern, msgs: patternMsgs };
    }

    if (Object.keys(validators).length) {
      field.validators = validators;
    }
    if (Object.keys(field).length > 1 || Object.keys(validators).length) {
      fields.push(field);
    }
  });

  return fetched;
};

module.exports = fetchUISettings;

},{"../utils":90,"./_ui":82}],78:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var ui = require('./_ui');

/**
 * Set HTML elements attributes according to final settings.
 *
 * @private
 * @param {settings} settings
 */
var setAttrs = function setAttrs(settings) {
  'use strict';

  if (settings.$form) {

    settings.$form.data('vv-settings', settings);

    if (settings.disabled) settings.$form.attr('disabled', 'disabled');
    if (settings.disableHTML5Validation) settings.$form.attr('novalidate', 'novalidate');
  }

  settings.fields.forEach(function (field) {

    if (!field.$el) return;

    field.$el.data('vv-settings', settings);

    if (field.disabled) field.$el.attr('disabled', 'disabled');
    if (field.required) field.$el.prop('required', true);

    if (field.validators) {
      utils.walkObject(field.validators, function (val, valName) {
        switch (valName) {
          case 'isLength':
            if (val.min) field.$el.attr('minlength', val.min);
            if (val.max) field.$el.attr('maxlength', val.max);
            break;

          // Modifiers/flags in RegExp are not supported in HTML input pattern attr.
          case 'matches':
            var pattern = val instanceof RegExp ? val : val.pattern;
            field.$el.attr('pattern', pattern.toString().replace(/^\//, '').replace(/\/.{0,3}$/, ''));
            break;
          case 'isFloat':
          case 'isInt':
            if (val.min) field.$el.attr('min', val.min);
            if (val.max) field.$el.attr('max', val.max);
            break;
        }
      });
    }
  });
};

module.exports = setAttrs;

},{"../utils":90,"./_ui":82}],79:[function(require,module,exports){
'use strict';

var validator = require('validator');
var utils = require('../utils');
var ui = require('./_ui');
var change = require('./_change');

/**
 * Set elements validation events.
 *
 * @private
 * @param {settings} settings
 */
var setEvents = function setEvents(settings) {
  'use strict';

  // Form.

  if (settings.$form) {

    settings.onSubmit = function (e) {
      settings.$form.vulcanval('validate');
      if (settings.$form.data('vv-valid') !== true) {
        e.preventDefault();
        return false;
      }
    };
    settings.$form.on('submit', settings.onSubmit);

    settings.onReset = function (e) {
      settings.$form.vulcanval('reset');
    };
    settings.$form.on('reset', settings.onReset);
  }

  // Fields.
  settings.fields.forEach(function (field) {

    if (!field.$el || field.disabled) return;

    var isTextField = !!field.$el.filter('input[type!=checkbox][type!=radio], textarea').length;
    var firstEvent = (field.firstValidationEvent || settings.firstValidationEvent) + ' vv-change';
    var normalEvent = (field.validationEvents || settings.validationEvents) + ' vv-change';
    var initial = isTextField && typeof field.$el.val() === 'string' && field.$el.val().length;

    field.onChange = function (ev) {
      change(settings, field, ev);
    };

    field.onFirstChange = function (e) {
      field.$el.off(firstEvent, field.onFirstChange);
      field.$el.on(normalEvent, field.onChange);
      field.$el.trigger('vv-change');
    };

    // @FIXIT: Make this run with an option.
    field.onBlur = function (e) {
      if (isTextField) {
        field.$el.val(utils.trimSpaces(field.$el.val()));
      }
    };

    field.$el.on('blur', field.onBlur);
    field.$el.on(firstEvent, field.onFirstChange);

    if (initial || field.autostart || settings.autostart) {
      field.$el.trigger('vv-change');
    }
  });
};

module.exports = setEvents;

},{"../utils":90,"./_change":75,"./_ui":82,"validator":3}],80:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var ui = require('./_ui');

/**
 * Set HTML elements and initial classes.
 *
 * @private
 * @param {settings} settings
 */
var setHTML = function setHTML(settings) {
  'use strict';

  if (!settings.intern) {

    // Form.
    if (settings.$form) {
      settings.$form.addClass('vv-form');
      settings.$form.addClass(settings.classes.defaults.form);
    }

    // Fields.
    settings.fields.forEach(function (field) {

      if (!field.$el || field.disabled || field.intern) return;

      var id = field.$el.attr('id');
      if (id) {
        field.$labels = $('label[for=' + id + ']');
        field.$labels.addClass('vv-label');
        field.$labels.addClass(settings.classes.defaults.label);
      }

      field.$el.addClass('vv-field');
      field.$el.addClass(settings.classes.defaults.field);

      if (field.display) {
        field.$display = field.display && $(field.display);
        field.$display.addClass('vv-display');
        field.$display.addClass(settings.classes.defaults.display);
      }
    });
  }
};

module.exports = setHTML;

},{"../utils":90,"./_ui":82}],81:[function(require,module,exports){
'use strict';

var validator = require('validator');
var utils = require('../utils');
var ui = require('./_ui');
var change = require('./_change');

/**
 * Set settings static methods.
 *
 * @private
 * @param {settings} settings
 */
var setMethods = function setMethods(settings) {
  'use strict';

  settings.fields.forEach(function (field) {

    field.value = field.value && field.value.bind(settings.context, field.$el);

    var onlyIf = field.onlyIf;
    delete field.onlyIf;
    if (onlyIf) {
      field.onlyIf = function () {
        return onlyIf.call(settings.context, field.value && field.value());
      };
    }
  });
};

module.exports = setMethods;

},{"../utils":90,"./_change":75,"./_ui":82,"validator":3}],82:[function(require,module,exports){
'use strict';

var ui = {
  refreshFormState: function refreshFormState(settings) {
    'use strict';

    var unknown = void 0;
    var valid = void 0;
    var state = void 0;

    if (settings.$form) {

      unknown = false;

      valid = settings.fields.every(function (field) {

        if (!field.$el) return true;
        if (field.disabled || field.onlyIf && !field.onlyIf()) return true;

        state = field.$el.data('vv-valid');

        if (state === void 0) {
          unknown = true;
          return true;
        }

        if (state === true) {
          return true;
        }
      });

      settings.$form.data({
        'vv-modified': true,
        'vv-valid': unknown ? void 0 : valid
      });

      if (!settings.intern) {
        if (unknown || valid) {
          settings.$form.removeClass('vv-form_error');
          settings.$form.removeClass(settings.classes.error.form);
        } else {
          settings.$form.addClass('vv-form_error');
          settings.$form.addClass(settings.classes.error.form);
        }
      }
    }

    return { valid: valid, unknown: unknown };
  },
  findFields: function findFields($form) {
    return $form.find('input, select, textarea, [data-vv-name]');
  },


  /**
   * Allow fields types:
   * - input type text-like
   * - input type checkbox
   * - input type radio
   * - input type hidden
   * - input type to exclude: submit, button and reset
   * - textarea
   * - select
   * - custom entries (* with attr data-vv-name)
   */
  filterFields: function filterFields($fields) {
    return $fields.filter('input[name][type!=button][type!=submit][type!=reset], select[name], textarea[name], [data-vv-name]');
  },
  getAttr: function getAttr(el, attr) {
    return $(el).attr(attr) !== void 0 ? $(el).attr(attr) : $(el).data('vv-' + attr);
  },
  getProp: function getProp(el, prop) {
    var value1 = $(el).prop(prop);
    var value2 = $(el).data('vv-' + prop);
    return typeof value1 === 'boolean' || typeof value1 === 'string' ? true : value2 !== void 0 ? value2 : void 0;
  },
  addFieldErrorClasses: function addFieldErrorClasses(settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.addClass('vv-field_error');
      field.$el.addClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.addClass('vv-display_error');
        field.$display.addClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.addClass('vv-label_error');
        field.$labels.addClass(settings.classes.error.label);
      }
    }
  },
  updateFieldErrorClasses: function updateFieldErrorClasses(settings, field) {

    if (field.$el && field.$display) {
      field.$display.removeClass('vv-display_error-update');
      setTimeout(function () {
        return field.$display.addClass('vv-display_error-update');
      }, 0);
    }
  },
  removeFieldErrorClasses: function removeFieldErrorClasses(settings, field) {

    if (field.$el && !field.intern && !settings.intern) {

      field.$el.removeClass('vv-field_error');
      field.$el.removeClass(settings.classes.error.field);

      if (field.$display) {
        field.$display.removeClass('vv-display_error vv-display_error-update');
        field.$display.removeClass(settings.classes.error.display);
      }

      if (field.$labels) {
        field.$labels.removeClass('vv-label_error');
        field.$labels.removeClass(settings.classes.error.label);
      }
    }
  }
};

module.exports = ui;

},{}],83:[function(require,module,exports){
'use strict';

var convertMapTo = require('../convertMapTo');
var fieldSettings = require('../fieldSettings');
var ui = require('./_ui');

/**
 * ***Invoke over instantiated or `<form>` elements.***
 *
 * Get the data {@link map} extracted from the `<form>`.
 *
 * If the instance was configured with the setting {@link settings.enableNestedMaps}
 * as `true`, the {@link map} returned will be nested. Otherwise it will be plain.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} getMap - With value `'getMap'`.
 * @return {map} The data {@link map}.
 */
var getMap = function getMap() {
  'use strict';

  var settings = this.data('vv-settings');

  var map = {};

  if (settings) {
    settings.fields.forEach(function (field) {
      if (field.onlyUI || field.disabled) return;
      map[field.name] = field.value();
    });
    if (settings.enableNestedMaps) {
      map = convertMapTo('nested', map);
    }
  } else if (this[0].tagName === 'FORM') {
    var $form = this;
    ui.filterFields(ui.findFields($form)).each(function (i, field) {

      var $field = $(field);
      var name = $field.attr('name') || $field.data('vv-name');
      var isDisabled = $field.prop('disabled');

      if (isDisabled) return;

      map[name] = fieldSettings.value($field);
    });
  }

  return map;
};

getMap.free = true;

module.exports = getMap;

},{"../convertMapTo":68,"../fieldSettings":71,"./_ui":82}],84:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var log = require('../log');
var utils = require('../utils');
var rawValidation = require('../rawValidation');

/**
 * ***Invoke over instantiated elements.***
 *
 * Inspect the validation status of the `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} inspect - With value `'inspect'`.
 * @param  {String} [fieldName] - Only limite inspection to the field.
 * @return {Object|String|Boolean} A plain object with keys as field names and values with
 * error messages if they have. If form is valid, `false` will be returned. If
 * the fieldName is sent, it will return an error message if field is invalid,
 * otherwise `false`.
 */
var inspect = function inspect(fieldName) {

  var settings = this.data('vv-settings');

  if (fieldName) {
    var field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
    if (!field) log.error('field "' + fieldName + '" not found');
    return rawValidation({
      settings: settings,
      context: settings.context,
      field: { name: field.name, value: field.value() }
    });
  } else {
    var _ret = function () {
      var errors = {};
      settings.fields.forEach(function (field) {
        var invalid = rawValidation({
          settings: settings,
          context: settings.context,
          field: { name: field.name, value: field.value() }
        });
        if (invalid) errors[field.name] = invalid;
      });
      return {
        v: Object.keys(errors).length ? errors : false
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
};

module.exports = inspect;

},{"../log":73,"../rawValidation":88,"../utils":90}],85:[function(require,module,exports){
'use strict';

var validator = require('validator');

var log = require('../log');
var utils = require('../utils');
var browser = require('../browser');
var fieldSettings = require('../fieldSettings');

var ui = require('./_ui');
var fetchUISettings = require('./_fetchUISettings.js');
var createSettings = require('./_createSettings');
var setAttrs = require('./_setAttrs');
var setHTML = require('./_setHTML');
var setMethods = require('./_setMethods');
var setEvents = require('./_setEvents');
var change = require('./_change');

var inspect = require('./inspect');
var validate = require('./validate');
var reset = require('./reset');
var getMap = require('./getMap');

var methods = { inspect: inspect, validate: validate, reset: reset, getMap: getMap };

/**
 * @summary jQuery plugin to instantiate the validators in forms.
 *
 * @description
 * Defines validation functionalities over form elements.
 *
 * This can be instantiated on forms or any form elements with a valid attribute `name`:
 *
 * - `<form>`
 * - `<input>` with `type` different than `submit`, `button` and `reset`
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
var plugin = function plugin(customSettings) {
  'use strict';

  if (!this.length) {
    return this;
  }

  var $el = this.first();

  if (typeof customSettings === 'string') {
    if (methods[customSettings]) {
      if (!methods[customSettings].free && !$el.data('vv-settings')) {
        log.error('element not instantiated yet');
      } else {
        var args = Array.prototype.slice.call(arguments, 1);
        return methods[customSettings].apply($el, args);
      }
    } else {
      log.error('method unrecognized "' + customSettings + '"');
    }
  }

  if ($el.data('vv-settings')) {
    return this;
  }

  // Validate elements.
  var $fields = void 0;
  if ($el[0].tagName === 'FORM') {
    $fields = ui.filterFields(ui.findFields($el));
  } else {
    $fields = ui.filterFields($el);
  }

  if (!$fields.length) {
    log.error('only <form>; <input>, <textarea> and <select> with valid attr "name"; and elements with valid attr "data-vv-name"');
  }

  $fields.each(function (i, field) {
    var name = ui.getAttr(field, 'name');
    if (!utils.validateFieldName(name)) {
      log.error('the field with attribute name "' + name + '" is invalid');
    }
  });

  // Fetch UI elements settings configured as nodes attributes and properties.
  var fetchedSettings = fetchUISettings($el, $fields);

  // Create settings.
  customSettings = customSettings ? customSettings : {};
  var settings = createSettings($el, fetchedSettings, customSettings);

  if (settings.disabled) {
    log.warn('complete form is disabled');
    return this;
  }

  // Set parsed settings attributes in current HTML.
  setAttrs(settings);

  // Update form elements.
  setHTML(settings);

  // Set settings methods.
  setMethods(settings);

  // Set elements events.
  setEvents(settings);

  return $el;
};

browser.perform(true, function () {
  window.jQuery.fn.vulcanval = plugin;
});

module.exports = plugin;

},{"../browser":66,"../fieldSettings":71,"../log":73,"../utils":90,"./_change":75,"./_createSettings":76,"./_fetchUISettings.js":77,"./_setAttrs":78,"./_setEvents":79,"./_setHTML":80,"./_setMethods":81,"./_ui":82,"./getMap":83,"./inspect":84,"./reset":86,"./validate":87,"validator":3}],86:[function(require,module,exports){
'use strict';

var log = require('../log');
var utils = require('../utils');
var ui = require('./_ui');

/**
 * ***Invoke over instantiated elements.***
 *
 * Reset the form or specific field validation state.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} reset - With value `'reset'`.
 * @param  {String} [fieldName] - Only limite reset to specified field.
 * @return {external:jQuery} The same jQuery object.
 */
var reset = function reset(fieldName) {
  'use strict';

  var settings = this.data('vv-settings');

  // Specific field.
  if (fieldName) {

    var field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
    if (!field) log.error('field "' + fieldName + '" not found');

    if (!field.$el) return;

    ui.removeFieldErrorClasses(settings, field);

    field.$el.data({
      'vv-modified': void 0,
      'vv-valid': void 0,
      'vv-msg': void 0
    });

    ui.refreshFormState(settings);

    settings.fields.every(function (f) {
      if (!f.$el) return;
      f.$el.trigger('vv-modify', {
        name: f.name,
        value: f.value(),
        valid: void 0,
        msg: void 0
      });
    });
  }

  // Form.
  else {
      settings.fields.forEach(function (f) {
        if (!f.$el) return;
        ui.removeFieldErrorClasses(settings, f);
        f.$el.data({
          'vv-modified': void 0,
          'vv-valid': void 0,
          'vv-msg': void 0
        });
      });

      ui.refreshFormState(settings);

      if (settings.$form) {
        settings.$form.data({
          'vv-modified': void 0,
          'vv-valid': void 0
        });
      }

      settings.fields.forEach(function (f) {
        if (!f.$el) return;
        f.$el.trigger('vv-modify', {
          name: f.name,
          value: f.value(),
          valid: void 0,
          msg: void 0
        });
      });
    }

  return this;
};

module.exports = reset;

},{"../log":73,"../utils":90,"./_ui":82}],87:[function(require,module,exports){
'use strict';

var log = require('../log');
var utils = require('../utils');

/**
 * ***Invoke over instantiated elements.***
 *
 * Validate visually complete `<form>` or specific field in it.
 *
 * @function external:"jQuery.fn".vulcanval
 *
 * @param  {String} validate - With value `'validate'`.
 * @param  {String} [fieldName] - Only limite validation to the field.
 * @return {external:jQuery} The same jQuery object.
 */
var validate = function validate(fieldName) {
  'use strict';

  var settings = this.data('vv-settings');

  if (fieldName) {
    var field = utils.find(settings.fields, function (f) {
      return f.name === fieldName;
    });
    if (!field) log.error('field "' + fieldName + '" not found');

    field.$el.trigger('vv-change');

    field.$el.trigger('focus');
  } else {
    (function () {

      var invalid = void 0;
      var first = true;

      settings.fields.forEach(function (field) {

        if (!field.$el) return;

        field.$el.trigger('vv-change');

        invalid = field.$el.vulcanval('inspect', field.name);

        if (invalid && first) {
          first = false;
          field.$el.trigger('focus');
        }
      });
    })();
  }

  return this;
};

module.exports = validate;

},{"../log":73,"../utils":90}],88:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var extend = require('extend');
var validator = require('validator');
var log = require('./log');
var utils = require('./utils');
var browser = require('./browser');

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
  'use strict';

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

  // used only in client side
  if (browser.isNodejs && field.rules.onlyUI) {
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
      if (valType !== 'object' || !(typeof val.min === 'number' || val.max)) {
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

},{"./browser":66,"./log":73,"./utils":90,"extend":1,"validator":3}],89:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extend = require('extend');
var log = require('./log');
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
   * @property {Object} [defaults] - Static classes.
   * @property {String} [defaults.form] - Form classes.
   * @property {String} [defaults.field] - Field classes.
   * @property {String} [defaults.label] - Field related label classes.
   * @property {String} [defaults.display] - Display classes.
   * @property {Object} [error] - On error classes.
   * @property {String} [error.form] - Form classes.
   * @property {String} [error.field] - Field classes.
   * @property {String} [error.label] - Field related label classes.
   * @property {String} [error.display] - Display classes.
   */
  classes: {
    defaults: {
      form: '',
      label: '',
      field: '',
      display: ''
    },
    error: {
      form: '',
      label: '',
      field: '',
      display: ''
    }
  },

  /**
   * Only client-side.
   *
   * jQuery `<form>` element.
   *
   * The form node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If any field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If all fields are valid. undefined if it's unknown.
   *
   * @private
   * @type {external:jQuery}
   */
  $form: null,

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields?
   *
   * Validation methods use this property to convert data {@link map maps} from
   * nested maps to plain maps when this property is enabled.
   *
   * @type {Boolean}
   * @default false
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
   * **List of custom validators.**
   *
   * All of them recieve two parameters, the first one is the field value and the
   * second one the options gave to it when configured. Only if the user configured
   * a validator with an string, number or object value, it is received.
   *
   * The context of the validators is {@link fieldSettings} so don't use arrow functions.
   *
   * @namespace
   * @see {@link module:vulcanval.addValidator vulcanval.addValidator()} to see how to add new ones.
   * @see {@link fieldSettings.validators} to see how to implement them.
   * @type {Object}
   */
  validators: {},

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
   * If a validator does not have a message for a locale, it will use the message
   * `general` in the locale.
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
   * The main property to configure validation.
   *
   * @type {Array}
   * @default [ ]
   */
  fields: [],

  /**
   * Only client-side.
   *
   * Utility context. Makes reference to the {@link utilityContext}.
   *
   * @private
   * @type {Object}
   */
  context: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * On form submit event.
   *
   * @private
   * @type {Function}
   */
  onSubmit: null,

  /**
   * Only client-side. Only for `<form>`.
   *
   * On form reset event.
   *
   * @private
   * @type {Function}
   */
  onReset: null,

  /**
   * Extend settings.
   *
   * @private
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} Extended settings.
   */
  extend: function extend(custom) {
    'use strict';

    custom = _extend(true, {}, custom);

    var locales = [];
    utils.walkObject(this.msgs, function (msgs, locale) {
      if (locale !== 'defaults') locales.push(locale);
    });

    // Validate locale.
    if (custom.locale) {
      if (!this.msgs[custom.locale]) {
        log.error('locale "' + custom.locale + '" not found');
      }
    }

    // Interpolate messages by validator to messages by locale.
    if (custom.msgs) {
      (function () {

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
    'use strict';

    // locale with validator

    if (this.msgs[this.locale] && this.msgs[this.locale][id]) {
      return this.msgs[this.locale][id];
    }
    // default with validator
    else if (this.msgs.defaults[id]) {
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

},{"./log":73,"./utils":90,"extend":1}],90:[function(require,module,exports){
'use strict';

var validator = require('validator');

var utils = {
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
  },
  validateFieldName: function validateFieldName(name) {
    return name.split('.').every(function (part) {
      return (/^[-_a-zA-Z0-9]{1,}$/.test(part) && !validator.isInt(part.charAt(0)) && !!part.length
      );
    });
  },
  trimSpaces: function trimSpaces(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }
};

module.exports = utils;

},{"validator":3}],91:[function(require,module,exports){
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
  'use strict';

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

  // Creating the './utilityContext' for this validation.
  var context = {
    validator: validator,
    get: function get(name) {
      if (map[name]) {
        return map[name];
      } else {
        log.warn('field "' + name + '" not found in map');
      }
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

},{"./convertMapTo":68,"./log":73,"./rawValidation":88,"./settings":89,"./utils":90,"extend":1,"validator":3}],92:[function(require,module,exports){
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
  'use strict';

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

  // Creating the './utilityContext' for this validation.
  var context = {
    validator: validator,
    get: function get(name) {
      if (map[name]) {
        return map[name];
      } else {
        log.warn('field "' + name + '" not found in map');
      }
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

},{"./convertMapTo":68,"./log":73,"./rawValidation":88,"./settings":89,"./utils":90,"extend":1,"validator":3}],93:[function(require,module,exports){
'use strict';

var extend = require('extend');
var validator = require('validator');
var settings = require('./settings');
var log = require('./log');
var utils = require('./utils');
var browser = require('./browser');
var rawValidation = require('./rawValidation');
var convertMapTo = require('./convertMapTo');
var cleanMap = require('./cleanMap');
var validateMap = require('./validateMap');
var validateField = require('./validateField');

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

/**
 * window object.
 * @external window
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window}
 */

/**
 * This is a reference to the {@link module:vulcanval vulcanval}.
 *
 * @name vulcanval
 * @memberof external:window
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
 * In browser environments this object is available in {@link external:window.vulcanval window.vulcanval}.
 *
 * @module vulcanval
 */
var vulcanval = {

  version: '1.0.0-beta',

  validator: validator,
  rawValidation: rawValidation,
  convertMapTo: convertMapTo,
  cleanMap: cleanMap,
  validateField: validateField,
  validateMap: validateMap,

  /**
   * Extend validators messages in an specific localization. If it does not exist,
   * it will be created.
   *
   * @memberof module:vulcanval
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
   * @memberof module:vulcanval
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
   * @memberof module:vulcanval
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
   * @memberof module:vulcanval
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

browser.perform(false, function () {
  window.vulcanval = vulcanval;
});

module.exports = vulcanval;

},{"./browser":66,"./cleanMap":67,"./convertMapTo":68,"./log":73,"./rawValidation":88,"./settings":89,"./utils":90,"./validateField":91,"./validateMap":92,"extend":1,"validator":3}]},{},[74]);
