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
(function (global){
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

  /*
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

  /*
   * Is this node.js?
   * @type {Object}
   */
  var isNode = (function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch(e) {}
    return isNodejs;
  })();

  /**
   * The logger class.
   * @param {String} namespace - A namespace to identify the logger.
   * @param {Object} [settings] - An optional configuration to overwrite defaults.
   */
  var Log = function (namespace, settings) {

    if (typeof namespace !== 'string' || !namespace.length) {
      throw new Error('a valid string namespace is required as first parameter');
    }

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
    displayNamespace: true,  // Display the namespace in messages.
    colors: true  // Enable colors on display for node.js.
  };

  /**
   * All registered levels.
   * @type {Object}
   */
  Log.LEVEL = {};

  /**
   * Colors to display.
   * @type {Object}
   */
  Log.COLOR = {
    RED:      '\x1b[31m',
    GREEN:    '\x1b[32m',
    YELLOW:   '\x1b[33m',
    BLUE:     '\x1b[34m',
    MAGENTA:  '\x1b[35m',
    CYAN:     '\x1b[36m',
    BLACK:    '\x1b[30m',
    WHITE:    '\x1b[37m',
    END:      '\x1b[0m'
  };

  /**
   * Add a new method level.
   * @param {Object} level - Level description.
   * @param {String} level.name - Level name.
   * @param {Number} [level.scale] - Number scale. Default to 0.
   * @param {String} [level.method] - The method logger. Default to 'log'.
   * @param {String} [level.console] - The console method used to display. Default 'log'.
   */
   Log.addLevel = Log.prototype.addLevel = function (level) {

    if (!level || typeof level !== 'object') {
      throw new Error('The first parameter must be an object describing the level');
    }
    if (typeof level.name !== 'string' && !level.name.length) {
      throw new Error('The level object must have a name property');
    }

    level = extend({
      name: null,
      scale: 0,
      method: 'log',
      'console': 'log',
      color: false
    }, level);

    if (this.LEVEL[level.name]) {
      throw new Error('The level name "'+ level.name +'" already exists');
    }

    this.LEVEL[level.name] = level;

    this.prototype[level.method] = function () {
      this._exec(level, arguments);
    };
  };

  /**
   * Set an specific level as the scale of messages to display.
   * @param {Number|Object} level - The number scale to set or the reference to the
   * level object to set.
   */
  Log.setLevel = Log.prototype.setLevel = function (level) {
    if (typeof level === 'object' && Log.LEVEL[level.name]) {
      this.settings.scale = level.scale;
    } else {
      this.settings.scale = level;
    }
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
   * Create a log description message by logger configuration.
   * @private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @return {String} - The description.
   */
  Log.prototype._pre = function (date, level) {

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
      dlevel = level.name +' ';
    }

    if (this.settings.displayNamespace) {
      dnamespace = '['+ this.namespace +'] ';
    }

    var dmsg = (dtime + dlevel + dnamespace).trim();
    dmsg = dmsg.length ? dmsg + ':' : '';

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

    var pre = this._pre(date, level, text);
    if (pre.length && this.settings.colors && isNode) {
      pre = (level.color ? level.color : '') + pre + (level.color ? Log.COLOR.END : '');
    }

    var msg = pre.length ? pre + ' ' + text : text;

    this._record(date, level, text, msg);

    if (this.settings.throwErrors && level.scale <= 1) {
      throw new Error(msg);
    }

    if (level.scale <= this.settings.scale) {
      this._log(level, msg);
    }
  };

  // Initial levels.
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
      'console': 'info',
      color: Log.COLOR.BLUE
    },
    {
      name: 'WARN',
      scale: 2,
      method: 'warn',
      'console': 'warn',
      color: Log.COLOR.YELLOW
    },
    {
      name: 'ERROR',
      scale: 1,
      method: 'error',
      'console': 'error',
      color: Log.COLOR.RED
    }
  ];

  for (var l=0; l<levels.length; l++) {
    Log.addLevel(levels[l]);
  }

  return Log;
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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

var _isMD = require('./lib/isMD5');

var _isMD2 = _interopRequireDefault(_isMD);

var _isJSON = require('./lib/isJSON');

var _isJSON2 = _interopRequireDefault(_isJSON);

var _isEmpty = require('./lib/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

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

var _isISSN = require('./lib/isISSN');

var _isISSN2 = _interopRequireDefault(_isISSN);

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

var version = '6.1.0';

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
  isMD5: _isMD2.default,
  isJSON: _isJSON2.default,
  isEmpty: _isEmpty2.default,
  isLength: _isLength2.default, isByteLength: _isByteLength2.default,
  isUUID: _isUUID2.default, isMongoId: _isMongoId2.default,
  isDate: _isDate2.default, isAfter: _isAfter2.default, isBefore: _isBefore2.default,
  isIn: _isIn2.default,
  isCreditCard: _isCreditCard2.default,
  isISIN: _isISIN2.default, isISBN: _isISBN2.default, isISSN: _isISSN2.default,
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
},{"./lib/blacklist":5,"./lib/contains":6,"./lib/equals":7,"./lib/escape":8,"./lib/isAfter":9,"./lib/isAlpha":10,"./lib/isAlphanumeric":11,"./lib/isAscii":12,"./lib/isBase64":13,"./lib/isBefore":14,"./lib/isBoolean":15,"./lib/isByteLength":16,"./lib/isCreditCard":17,"./lib/isCurrency":18,"./lib/isDataURI":19,"./lib/isDate":20,"./lib/isDecimal":21,"./lib/isDivisibleBy":22,"./lib/isEmail":23,"./lib/isEmpty":24,"./lib/isFQDN":25,"./lib/isFloat":26,"./lib/isFullWidth":27,"./lib/isHalfWidth":28,"./lib/isHexColor":29,"./lib/isHexadecimal":30,"./lib/isIP":31,"./lib/isISBN":32,"./lib/isISIN":33,"./lib/isISO8601":34,"./lib/isISSN":35,"./lib/isIn":36,"./lib/isInt":37,"./lib/isJSON":38,"./lib/isLength":39,"./lib/isLowercase":40,"./lib/isMACAddress":41,"./lib/isMD5":42,"./lib/isMobilePhone":43,"./lib/isMongoId":44,"./lib/isMultibyte":45,"./lib/isNumeric":46,"./lib/isSurrogatePair":47,"./lib/isURL":48,"./lib/isUUID":49,"./lib/isUppercase":50,"./lib/isVariableWidth":51,"./lib/isWhitelisted":52,"./lib/ltrim":53,"./lib/matches":54,"./lib/normalizeEmail":55,"./lib/rtrim":56,"./lib/stripLow":57,"./lib/toBoolean":58,"./lib/toDate":59,"./lib/toFloat":60,"./lib/toInt":61,"./lib/trim":62,"./lib/unescape":63,"./lib/util/toString":66,"./lib/whitelist":67}],4:[function(require,module,exports){
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
  'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁ]+$/i,
  'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЯЄIЇҐ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};

var alphanumeric = exports.alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'nl-NL': /^[0-9A-ZÉËÏÓÖÜ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁ]+$/i,
  'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[0-9А-ЯЄIЇҐ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};

var englishLocales = exports.englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];

for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = 'en-' + englishLocales[i];
  alpha[locale] = alpha['en-US'];
  alphanumeric[locale] = alphanumeric['en-US'];
}

alpha['pt-BR'] = alpha['pt-PT'];
alphanumeric['pt-BR'] = alphanumeric['pt-PT'];

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
},{"./util/assertString":64}],6:[function(require,module,exports){
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
},{"./util/assertString":64,"./util/toString":66}],7:[function(require,module,exports){
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
},{"./util/assertString":64}],8:[function(require,module,exports){
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
      return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;');
}
module.exports = exports['default'];
},{"./util/assertString":64}],9:[function(require,module,exports){
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
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());

  (0, _assertString2.default)(str);
  var comparison = (0, _toDate2.default)(date);
  var original = (0, _toDate2.default)(str);
  return !!(original && comparison && original > comparison);
}
module.exports = exports['default'];
},{"./toDate":59,"./util/assertString":64}],10:[function(require,module,exports){
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
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';

  (0, _assertString2.default)(str);
  if (locale in _alpha.alpha) {
    return _alpha.alpha[locale].test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];
},{"./alpha":4,"./util/assertString":64}],11:[function(require,module,exports){
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
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';

  (0, _assertString2.default)(str);
  if (locale in _alpha.alphanumeric) {
    return _alpha.alphanumeric[locale].test(str);
  }
  throw new Error('Invalid locale \'' + locale + '\'');
}
module.exports = exports['default'];
},{"./alpha":4,"./util/assertString":64}],12:[function(require,module,exports){
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
},{"./util/assertString":64}],13:[function(require,module,exports){
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
},{"./util/assertString":64}],14:[function(require,module,exports){
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
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());

  (0, _assertString2.default)(str);
  var comparison = (0, _toDate2.default)(date);
  var original = (0, _toDate2.default)(str);
  return !!(original && comparison && original < comparison);
}
module.exports = exports['default'];
},{"./toDate":59,"./util/assertString":64}],15:[function(require,module,exports){
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
},{"./util/assertString":64}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
},{"./util/assertString":64}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
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
},{"./util/assertString":64}],18:[function(require,module,exports){
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
},{"./util/assertString":64,"./util/merge":65}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDataURI;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataURI = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9!\$&',\(\)\*\+,;=\-\._~:@\/\?%\s]*\s*$/i; // eslint-disable-line max-len

function isDataURI(str) {
  (0, _assertString2.default)(str);
  return dataURI.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":64}],20:[function(require,module,exports){
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
  dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^T:\d]|$)/g);
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
},{"./isISO8601":34,"./util/assertString":64}],21:[function(require,module,exports){
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
},{"./util/assertString":64}],22:[function(require,module,exports){
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
},{"./toFloat":60,"./util/assertString":64}],23:[function(require,module,exports){
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
},{"./isByteLength":16,"./isFQDN":25,"./util/assertString":64,"./util/merge":65}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmpty;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEmpty(str) {
  (0, _assertString2.default)(str);
  return str.length === 0;
}
module.exports = exports['default'];
},{"./util/assertString":64}],25:[function(require,module,exports){
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
},{"./util/assertString":64,"./util/merge":65}],26:[function(require,module,exports){
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
  return float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max) && (!options.hasOwnProperty('lt') || str < options.lt) && (!options.hasOwnProperty('gt') || str > options.gt);
}
module.exports = exports['default'];
},{"./util/assertString":64}],27:[function(require,module,exports){
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
},{"./util/assertString":64}],28:[function(require,module,exports){
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
},{"./util/assertString":64}],29:[function(require,module,exports){
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
},{"./util/assertString":64}],30:[function(require,module,exports){
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
},{"./util/assertString":64}],31:[function(require,module,exports){
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
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

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
},{"./util/assertString":64}],32:[function(require,module,exports){
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
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

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
},{"./util/assertString":64}],33:[function(require,module,exports){
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
},{"./util/assertString":64}],34:[function(require,module,exports){
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
var iso8601 = exports.iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
/* eslint-enable max-len */
},{"./util/assertString":64}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISSN;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var issn = '^\\d{4}-?\\d{3}[\\dX]$';

function isISSN(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  (0, _assertString2.default)(str);
  var testIssn = issn;
  testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn;
  testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i');
  if (!testIssn.test(str)) {
    return false;
  }
  var issnDigits = str.replace('-', '');
  var position = 8;
  var checksum = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = issnDigits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var digit = _step.value;

      var digitValue = digit.toUpperCase() === 'X' ? 10 : +digit;
      checksum += digitValue * position;
      --position;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return checksum % 11 === 0;
}
module.exports = exports['default'];
},{"./util/assertString":64}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
},{"./util/assertString":64,"./util/toString":66}],37:[function(require,module,exports){
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
  var regex = options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ? int : intLeadingZeroes;

  // Check min/max
  var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
  var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;

  return regex.test(str) && minCheckPassed && maxCheckPassed;
}
module.exports = exports['default'];
},{"./util/assertString":64}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
},{"./util/assertString":64}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
},{"./util/assertString":64}],40:[function(require,module,exports){
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
},{"./util/assertString":64}],41:[function(require,module,exports){
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
},{"./util/assertString":64}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMD5;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md5 = /^[a-f0-9]{32}$/;

function isMD5(str) {
  (0, _assertString2.default)(str);
  return md5.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":64}],43:[function(require,module,exports){
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
  'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
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
  'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  'ja-JP': /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/,
  'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'nl-BE': /^(\+?32|0)4?\d{8}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
  'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
};
/* eslint-enable max-len */

// aliases
phones['en-CA'] = phones['en-US'];
phones['fr-BE'] = phones['nl-BE'];

function isMobilePhone(str, locale) {
  (0, _assertString2.default)(str);
  if (locale in phones) {
    return phones[locale].test(str);
  }
  return false;
}
module.exports = exports['default'];
},{"./util/assertString":64}],44:[function(require,module,exports){
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
},{"./isHexadecimal":30,"./util/assertString":64}],45:[function(require,module,exports){
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
},{"./util/assertString":64}],46:[function(require,module,exports){
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
},{"./util/assertString":64}],47:[function(require,module,exports){
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
},{"./util/assertString":64}],48:[function(require,module,exports){
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
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}

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
      split = void 0,
      ipv6 = void 0;

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

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6)) && host !== 'localhost') {
    return false;
  }

  host = host || ipv6;

  if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
    return false;
  }
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}
module.exports = exports['default'];
},{"./isFQDN":25,"./isIP":31,"./util/assertString":64,"./util/merge":65}],49:[function(require,module,exports){
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
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';

  (0, _assertString2.default)(str);
  var pattern = uuid[version];
  return pattern && pattern.test(str);
}
module.exports = exports['default'];
},{"./util/assertString":64}],50:[function(require,module,exports){
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
},{"./util/assertString":64}],51:[function(require,module,exports){
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
},{"./isFullWidth":27,"./isHalfWidth":28,"./util/assertString":64}],52:[function(require,module,exports){
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
},{"./util/assertString":64}],53:[function(require,module,exports){
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
},{"./util/assertString":64}],54:[function(require,module,exports){
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
},{"./util/assertString":64}],55:[function(require,module,exports){
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
  // The following options apply to all email addresses
  // Lowercases the local part of the email address.
  // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
  // The domain is always lowercased, as per RFC 1035
  all_lowercase: true,

  // The following conversions are specific to GMail
  // Lowercases the local part of the GMail address (known to be case-insensitive)
  gmail_lowercase: true,
  // Removes dots from the local part of the email address, as that's ignored by GMail
  gmail_remove_dots: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  gmail_remove_subaddress: true,
  // Conversts the googlemail.com domain to gmail.com
  gmail_convert_googlemaildotcom: true,

  // The following conversions are specific to Outlook.com / Windows Live / Hotmail
  // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
  outlookdotcom_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  outlookdotcom_remove_subaddress: true,

  // The following conversions are specific to Yahoo
  // Lowercases the local part of the Yahoo address (known to be case-insensitive)
  yahoo_lowercase: true,
  // Removes the subaddress (e.g. "-foo") from the email address
  yahoo_remove_subaddress: true,

  // The following conversions are specific to iCloud
  // Lowercases the local part of the iCloud address (known to be case-insensitive)
  icloud_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  icloud_remove_subaddress: true
};

// List of domains used by iCloud
var icloud_domains = ['icloud.com', 'me.com'];

// List of domains used by Outlook.com and its predecessors
// This list is likely incomplete.
// Partial reference:
// https://blogs.office.com/2013/04/17/outlook-com-gets-two-step-verification-sign-in-by-alias-and-new-international-domains/
var outlookdotcom_domains = ['hotmail.at', 'hotmail.be', 'hotmail.ca', 'hotmail.cl', 'hotmail.co.il', 'hotmail.co.nz', 'hotmail.co.th', 'hotmail.co.uk', 'hotmail.com', 'hotmail.com.ar', 'hotmail.com.au', 'hotmail.com.br', 'hotmail.com.gr', 'hotmail.com.mx', 'hotmail.com.pe', 'hotmail.com.tr', 'hotmail.com.vn', 'hotmail.cz', 'hotmail.de', 'hotmail.dk', 'hotmail.es', 'hotmail.fr', 'hotmail.hu', 'hotmail.id', 'hotmail.ie', 'hotmail.in', 'hotmail.it', 'hotmail.jp', 'hotmail.kr', 'hotmail.lv', 'hotmail.my', 'hotmail.ph', 'hotmail.pt', 'hotmail.sa', 'hotmail.sg', 'hotmail.sk', 'live.be', 'live.co.uk', 'live.com', 'live.com.ar', 'live.com.mx', 'live.de', 'live.es', 'live.eu', 'live.fr', 'live.it', 'live.nl', 'msn.com', 'outlook.at', 'outlook.be', 'outlook.cl', 'outlook.co.il', 'outlook.co.nz', 'outlook.co.th', 'outlook.com', 'outlook.com.ar', 'outlook.com.au', 'outlook.com.br', 'outlook.com.gr', 'outlook.com.pe', 'outlook.com.tr', 'outlook.com.vn', 'outlook.cz', 'outlook.de', 'outlook.dk', 'outlook.es', 'outlook.fr', 'outlook.hu', 'outlook.id', 'outlook.ie', 'outlook.in', 'outlook.it', 'outlook.jp', 'outlook.kr', 'outlook.lv', 'outlook.my', 'outlook.ph', 'outlook.pt', 'outlook.sa', 'outlook.sg', 'outlook.sk', 'passport.com'];

// List of domains used by Yahoo Mail
// This list is likely incomplete
var yahoo_domains = ['rocketmail.com', 'yahoo.ca', 'yahoo.co.uk', 'yahoo.com', 'yahoo.de', 'yahoo.fr', 'yahoo.in', 'yahoo.it', 'ymail.com'];

function normalizeEmail(email, options) {
  options = (0, _merge2.default)(options, default_normalize_email_options);

  if (!(0, _isEmail2.default)(email)) {
    return false;
  }

  var raw_parts = email.split('@');
  var domain = raw_parts.pop();
  var user = raw_parts.join('@');
  var parts = [user, domain];

  // The domain is always lowercased, as it's case-insensitive per RFC 1035
  parts[1] = parts[1].toLowerCase();

  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    // Address is GMail
    if (options.gmail_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (options.gmail_remove_dots) {
      parts[0] = parts[0].replace(/\./g, '');
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.gmail_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
    parts[1] = options.gmail_convert_googlemaildotcom ? 'gmail.com' : parts[1];
  } else if (~icloud_domains.indexOf(parts[1])) {
    // Address is iCloud
    if (options.icloud_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.icloud_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (~outlookdotcom_domains.indexOf(parts[1])) {
    // Address is Outlook.com
    if (options.outlookdotcom_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.outlookdotcom_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (~yahoo_domains.indexOf(parts[1])) {
    // Address is Yahoo
    if (options.yahoo_remove_subaddress) {
      var components = parts[0].split('-');
      parts[0] = components.length > 1 ? components.slice(0, -1).join('-') : components[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.yahoo_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else {
    // Any other address
    if (options.all_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  }
  return parts.join('@');
}
module.exports = exports['default'];
},{"./isEmail":23,"./util/merge":65}],56:[function(require,module,exports){
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
  var pattern = chars ? new RegExp('[' + chars + ']') : /\s/;

  var idx = str.length - 1;
  while (idx >= 0 && pattern.test(str[idx])) {
    idx--;
  }

  return idx < str.length ? str.substr(0, idx + 1) : str;
}
module.exports = exports['default'];
},{"./util/assertString":64}],57:[function(require,module,exports){
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
},{"./blacklist":5,"./util/assertString":64}],58:[function(require,module,exports){
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
},{"./util/assertString":64}],59:[function(require,module,exports){
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
},{"./util/assertString":64}],60:[function(require,module,exports){
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
},{"./util/assertString":64}],61:[function(require,module,exports){
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
},{"./util/assertString":64}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = trim;

var _rtrim = require('./rtrim');

var _rtrim2 = _interopRequireDefault(_rtrim);

var _ltrim = require('./ltrim');

var _ltrim2 = _interopRequireDefault(_ltrim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function trim(str, chars) {
  return (0, _rtrim2.default)((0, _ltrim2.default)(str, chars), chars);
}
module.exports = exports['default'];
},{"./ltrim":53,"./rtrim":56}],63:[function(require,module,exports){
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
      return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#96;/g, '`');
}
module.exports = exports['default'];
},{"./util/assertString":64}],64:[function(require,module,exports){
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
},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];
},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
},{}],67:[function(require,module,exports){
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
},{"./util/assertString":64}],68:[function(require,module,exports){
'use strict';

var settings = require('./settings/settings');

/**
 * Add a custom validator globally.
 *
 * All validators in the package {@link https://www.npmjs.com/package/validator validator}
 * are installed and ready to use.
 *
 * @method
 * @name addValidator
 * @memberof module:vulcanval
 *
 * @param {String} name - An alphanumeric validator name.
 * @param {Function} validator - The validator function. Receives as a first parameter
 * the value of the field and has to return a
 * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value}.
 * This function will have the {@link utilityContext utility context} as
 * function context. Don't pass
 * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
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
 * const vv = vulcanval(settings);
 *
 * const field0Valid = vv.validateField('field0', map);
 * console.log(field0Valid); // 'This field needs to be great!'
 *
 * @see In the example is used the {@link validator.validateField validator.validateField}
 * static method to test the new validator.
 */
module.exports = function addValidator(name, validator) {
  settings.validators[name] = validator;
};

},{"./settings/settings":79}],69:[function(require,module,exports){
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

  install: function install(inBrowser) {
    if (!this.isNodejs) {
      inBrowser();
    }
  }
};

module.exports = browser;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],70:[function(require,module,exports){
'use strict';

var extend = require('extend');
var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');

/**
 * Clean a {@link map} from properties outside the validation process.
 *
 * This is done by removing all properties which are not present in the fields
 * list of validation and the fields which are disabled or intented to be
 * only used in client side.
 *
 * @static
 * @method validator.cleanMap
 *
 * @param  {Boolean} isPlain - If the {@link map} is plain. `false` for nested.
 * @param  {map} map - The map to clean.
 *
 * @return {map} - The cleaned map.
 *
 * @see An example of this method is in the
 * {@link https://github.com/vulcan-estudios/vulcanval/tree/master/demo/server demo server}.
 */
module.exports = function (isPlain, map) {
  'use strict';

  if (!isPlain) {
    map = convertMapTo('plain', map);
  }

  var newMap = {};

  this.settings.fields.forEach(function (field) {
    if (field.disabled || field.onlyUI) return;
    newMap[field.name] = map[field.name];
  });

  if (!isPlain) {
    return convertMapTo('nested', newMap);
  }

  return newMap;
};

},{"./convertMapTo":71,"./log":75,"./utils":81,"extend":1}],71:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean' || o[p] === undefined || o[p] === null) {
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
 * @return {map} The converted object map.
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

},{"./log":75,"./utils":81}],72:[function(require,module,exports){
'use strict';

var extend = require('extend');
var settings = require('./settings/settings');

/**
 * Extend validators messages in an specific localization globally. If it does
 * not exist it will be created.
 *
 * @method
 * @name extendLocale
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
 *
 * // To set it as default, use:
 * vulcanval.settings.locale = 'jp';  // The identifier
 */
module.exports = function extendLocale(locale) {
  settings.msgs[locale.id] = extend(true, {}, settings.msgs[locale.id], locale.msgs);
};

},{"./settings/settings":79,"extend":1}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jQuery = exports.validator = undefined;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * window object.
 * @external window
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window}
 */

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

var jQuery = typeof window !== 'undefined' ? window.jQuery || window.$ : null;

exports.validator = _validator2.default;
exports.jQuery = jQuery;
exports.default = { validator: _validator2.default, jQuery: jQuery };

},{"validator":3}],74:[function(require,module,exports){
'use strict';

var lang = {
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
    isUppercase: 'This field should only contain uppercase text.'
  }
};

module.exports = lang;

},{}],75:[function(require,module,exports){
'use strict';

var Log = require('prhone-log');

module.exports = new Log('VulcanVal', {
  history: false,
  scale: 2,
  throwErrors: true
});

},{"prhone-log":2}],76:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _external = require('./external');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * rawValidation method.
 *
 * @private
 * @param  {String} fieldName
 * @return {String|Boolean} `false` if valid, otherwise the error message.
 */
module.exports = function (fieldName) {
  'use strict';

  var settings = this.settings;
  var field = {
    name: fieldName,
    value: settings.context.get(fieldName)
  };

  _log2.default.debug('validating field: ' + field.name + '="' + field.value + '"');

  field.rules = _utils2.default.find(settings.fields, function (vals) {
    return vals.name === field.name;
  });

  if (!field.rules) {
    _log2.default.warn('field "' + field.name + '" to validate does not have validators');
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
  if (_browser2.default.isNodejs && field.rules.onlyUI) {
    return false;
  }

  // condition
  if (field.rules.onlyIf && !field.rules.onlyIf()) {
    return false;
  }

  // Get a message according to error and error parameters.
  var getMsg = function getMsg(custom, id, opts) {

    id = id ? id : 'general';

    var value = field.value;
    var option = typeof opts === 'string' || typeof opts === 'number' ? opts : '';
    var options = (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object' ? opts : null;
    var params = (0, _extend2.default)({}, { value: value, option: option }, options);

    // If it is custom, the message can be by locales or can be universal.
    if (custom) {
      return _utils2.default.format((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' ? id[settings.locale] : id, params);
    } else {
      return _utils2.default.format(settings.getMsgTemplate(id), params);
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

  _utils2.default.everyInObject(field.rules.validators, function (val, valName) {

    // There is already an error.
    if (err) {
      return false;
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
        return _log2.default.error('fields validator "isLength" must be a plain object if defined');
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
          return _log2.default.error('fields validator "matches" must be a plain object or RegExp');
        }
        if (val instanceof RegExp) {
          pattern = val;
          hasMsg = false;
        } else if (val.pattern instanceof RegExp) {
          pattern = val.pattern;
          hasMsg = val.msgs;
        } else {
          return _log2.default.error('matches validator needs a RegExp');
        }
        if (!_external.validator.matches(field.value, pattern)) {
          err = getMsg(hasMsg, hasMsg ? val.msgs : 'general', val);
        }
        return true;
      }

      // Custom validator.
      else if (settings.validators[valName]) {
          if (!settings.validators[valName].call(settings.context, field.value, valOpts)) {
            err = getMsg(false, valName, val);
          }
          return true;
        }

        // `validator` validator.
        else if (_external.validator[valName]) {
            if (!_external.validator[valName](field.value, valOpts)) {
              err = getMsg(false, valName, val);
            }
            return true;
          }

          // Not found.
          else {
              return _log2.default.error('validator "' + valName + '" was not found');
            }
  });

  if (err) {
    _log2.default.info('invalid field ' + field.name + '="' + field.value + '":', err);
  }

  return !err ? false : err;
};

},{"./browser":69,"./external":73,"./log":75,"./utils":81,"extend":1}],77:[function(require,module,exports){
'use strict';

var _extend = require('extend');
var utils = require('../utils');

/**
 * @namespace fieldSettings
 * @type {Object}
 *
 * @description
 * The default properties and methods for a field.
 *
 * This is configured in {@link settings.fields} array property.
 *
 * Each field settings can be affected by the main {@link settings} and by the
 * {@link fieldsetSettings}.
 */
var fieldSettings = {

  /**
   * The field name. This property is required.
   *
   * @name name
   * @memberof fieldSettings
   * @type {String}
   */
  name: null,

  /**
   * Field will be ignored in validation if `true`.
   *
   * @name disabled
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * Field is required and cannot be undefined nor empty string. If the field is
   * not required but it does NOT have a
   * {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy value},
   * then this will pass over all validators.
   *
   * @name required
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //required: null,

  /**
   * *Only client-side.*
   *
   * Validate field elements on instance time.
   *
   * @name autostart
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //autostart: null,

  /**
   * *Only client-side.*
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * @name intern
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * *Only client-side.*
   *
   * Ignore field in validation in server side.
   *
   * @name onlyUI
   * @memberof fieldSettings
   * @type {Boolean}
   * @default false
   */
  //onlyUI: null,

  /**
   * *Only client-side.*
   *
   * What event to listen to trigger the first validation on field.
   *
   * @name firstValidationEvent
   * @memberof fieldSettings
   * @type {String}
   * @default Inherited from {@link settings}
   */
  //firstValidationEvent: null,

  /**
   * *Only client-side.*
   *
   * After first validation, what events to listen to re-validate field.
   *
   * @name validationEvents
   * @memberof fieldSettings
   * @type {String}
   * @default Inherited from {@link settings}
   */
  //validationEvents: null,

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
   * This object will be merged with the {@link fieldsetSettings.validators fieldsets validators}
   * this field is in.
   *
   * @name validators
   * @memberof fieldSettings
   * @type {Object}
   */
  validators: null,

  /**
   * *Only client-side.*
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
   * @name $el
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $el: null,

  /**
   * *Only client-side.*
   *
   * The element where to set the current field message error. If not specified,
   * the messages won't be shown on UI.
   *
   * When configured by HTML attribute `data-vv-display`, the value expected should
   * be a jQuery selector. Otherwise this can be anything to select with the jQuery
   * selector method.
   *
   * @name display
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  display: null,

  /**
   * *Only client-side.*
   *
   * Display jQuery element.
   *
   * @private
   * @name $display
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $display: null,

  /**
   * *Only client-side.*
   *
   * jQuery `<label>` elements which have `for` attribute to the field element.
   *
   * @private
   * @name $labels
   * @memberof fieldSettings
   * @type {external:jQuery}
   */
  $labels: null,

  /**
   * *Only client-side.*
   *
   * Field onFirstChange event (this is defined by user).
   *
   * @private
   * @name onFirstChange
   * @memberof fieldSettings
   * @type {Function}
   */
  onFirstChange: null,

  /**
   * *Only client-side.*
   *
   * Field onChange event (this is defined by user).
   *
   * @private
   * @name onChange
   * @memberof fieldSettings
   * @type {Function}
   */
  onChange: null,

  /**
   * *Only client-side.*
   *
   * Field onBlur event.
   *
   * @private
   * @name onBlur
   * @memberof fieldSettings
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
   * @name onlyIf
   * @memberof fieldSettings
   * @return {Boolean}
   */
  onlyIf: null,

  /**
   * *Only client-side.*
   *
   * Method to get the value of the field. This will have the {@link utilityContext utilty context}
   * so don't use
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions arrow functions}.
   *
   * By default this can retrieve the value of `<input>`s of any kind except
   * `image`, `submit`, `reset`, `file` and `button`, `<textarea>`s and `<select>`s.
   *
   * You can overwrite this to create your own custom field value getter. Otherwise
   * leave this property as default.
   *
   * The first paramter `$field` will be binded to the function and it is the
   * jQuery element the fields belongs to.
   *
   * @method
   * @name value
   * @memberof fieldSettings
   * @param  {external:jQuery} $field - The field element.
   * @return {*} The value returned will depend on the type of element or what you
   * configure if you overwrite this method.
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
   * @name extend
   * @memberof fieldSettings
   * @param  {Object} custom
   * @return {Object}
   */
  extend: function extend(custom) {
    return _extend(Object.create(fieldSettings), custom);
  }
};

module.exports = fieldSettings;

},{"../utils":81,"extend":1}],78:[function(require,module,exports){
'use strict';

var _extend = require('extend');
var utils = require('../utils');

/**
 * @namespace fieldsetSettings
 * @type {Object}
 *
 * @description
 * These properties and methods will affect the fields settings.
 *
 * This is configured in {@link settings.fieldsets} array property.
 *
 * Important: one field can be affected by more than one fieldset so if you set
 * two fieldsets that match the same field, it will have the configuration of both
 * of them, being priority the last one.
 */
var fieldsetSettings = {

  /**
   * Fieldset name. This will be used to identify this fieldset and it is required.
   *
   * @name name
   * @memberof fieldsetSettings
   * @type {String}
   */
  name: null,

  /**
   * The fields this fieldset covers. This is required.
   *
   * This can be a RegExp to match against the fields names, a string that is
   * the starting string of fields names or an array with the names of the fields.
   *
   * @name fields
   * @memberof fieldsetSettings
   * @type {RegExp|String|Array}
   */
  fields: null,

  /**
   * Default {@link fieldSettings.disabled} value in fieldset.
   *
   * @name disabled
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * Default {@link fieldSettings.required} value in fieldset.
   *
   * @name required
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //required: null,

  /**
   * Default {@link fieldSettings.autostart} value in fieldset.
   *
   * @name autostart
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //autostart: null,

  /**
   * Default {@link fieldSettings.intern} value in fieldset.
   *
   * @name intern
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * Default {@link fieldSettings.onlyUI} value in fieldset.
   *
   * @name onlyUI
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //onlyUI: null,

  /**
   * Default {@link fieldSettings.firstValidationEvent} value in fieldset.
   *
   * @name firstValidationEvent
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //firstValidationEvent: null,

  /**
   * Default {@link fieldSettings.validationEvents} value in fieldset.
   *
   * @name validationEvents
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  //validationEvents: null,

  /**
   * Extends {@link fieldSettings.validators} value in fieldset so all fields
   * that this fieldset covers will extend their validators with this object.
   *
   * @name validators
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  validators: null,

  /**
   * Middleware {@link fieldSettings.onlyIf} value in fieldset. This function
   * will be used in the fields to determine if they will be validated or not.
   *
   * @name onlyIf
   * @memberof fieldsetSettings
   * @type {Boolean}
   * @default false
   */
  onlyIf: null,

  /**
   * Extend fieldset settings default configuration.
   *
   * @private
   * @name extend
   * @memberof fieldsetSettings
   * @param  {Object} custom
   * @return {Object}
   */
  extend: function extend(custom) {
    return _extend(Object.create(fieldsetSettings), custom);
  }
};

module.exports = fieldsetSettings;

},{"../utils":81,"extend":1}],79:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extend2 = require('extend');

var _extend3 = _interopRequireDefault(_extend2);

var _fieldSettings = require('./fieldSettings');

var _fieldSettings2 = _interopRequireDefault(_fieldSettings);

var _fieldsetSettings = require('./fieldsetSettings');

var _fieldsetSettings2 = _interopRequireDefault(_fieldsetSettings);

var _utilityContext = require('./utilityContext');

var _utilityContext2 = _interopRequireDefault(_utilityContext);

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _external = require('../external');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace settings
 * @type {Object}
 *
 * @description
 * {@link module:vulcanval vulcanval} validation settings by default.
 *
 * When using validation methods you have to pass an object settings to
 * configure the validation process which will overwrite this settings used by
 * default.
 */
var settings = {

  /**
   * *Only client-side.*
   *
   * Disable HTML5 validation with novalidate attribute when instanced on `<form>`.
   * This is enabled if attribute "novalidate" is present.
   *
   * @name disableHTML5Validation
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //disableHTML5Validation: null,

  /**
   * When a map of fields is created out of a form, should it be converted to a
   * map of nested fields or only plain fields?
   *
   * Validation methods use this property to convert data {@link map maps} from
   * nested maps to plain maps when this property is enabled.
   *
   * @name enableNestedMaps
   * @memberof settings
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
  //enableNestedMaps: null,

  /**
   * Form will not be instantiated. In client side, if `<form>` has the attribute
   * `disabled`, this will be enabled.
   *
   * @name disabled
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //disabled: null,

  /**
   * *Only client-side.*
   *
   * Validate field elements on instance time.
   *
   * @name autostart
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //autostart: null,

  /**
   * *Only client-side.*
   *
   * When a field is validated, don't show changes visually nor show messages.
   * This is used to know whether they are valid or not, update the fields
   * elements states and trigger events.
   *
   * @name intern
   * @memberof settings
   * @type {Boolean}
   * @default false
   */
  //intern: null,

  /**
   * *Only client-side.*
   *
   * What event to listen to trigger the first validation on fields.
   *
   * @name firstValidationEvent
   * @memberof settings
   * @type {String}
   * @default 'blur change'
   */
  firstValidationEvent: 'blur change',

  /**
   * *Only client-side.*
   *
   * After first validation, what events to listen to re-validate fields.
   *
   * @name validationEvents
   * @memberof settings
   * @type {String}
   * @default 'input blur change'
   */
  validationEvents: 'input blur change',

  /**
   * Default messages locale.
   *
   * @name locale
   * @memberof settings
   * @type {String}
   * @default 'en'
   */
  locale: 'en',

  /**
   * *Only client-side.*
   *
   * HTML tag classes to add to specific elements in form on default and on error.
   *
   * @name classes
   * @memberof settings
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
   * **List of custom validators.**
   *
   * All of them recieve two parameters, the first one is the field value and the
   * second one the options gave to it when configured. Only if the user configured
   * a validator with an string, number or object value, it is received.
   *
   * The context of the validators is {@link utilityContext} so don't use arrow functions.
   *
   * @name validators
   * @memberof settings
   * @namespace
   * @see {@link module:vulcanval.addValidator vulcanval.addValidator()} to see how to add new ones.
   * @see {@link fieldSettings.validators} to see how to implement them.
   * @type {Object}
   */
  validators: {},

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
   * - The variable `{{value}}` is always present to use and it's the value of the field
   *   validating.
   * - The variable `{{option}}` can be used when the validator is configured
   *   with an string. Ex: in validator `isAlphanumeric: 'de-DE'`, the
   *   variable will have the `de-DE` value. This also applies to numbers.
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
   * @name msgs
   * @memberof settings
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
   *
   *       // If this fails, the default message will be used because the package
   *       // does not have a message for this validator by default
   *       isMongoId: true
   *     }
   *   }, {
   *     name: 'age',
   *     validators: {
   *       isInt: { max: 500 }
   *     }
   *   }]
   * };
   *
   * const vv = vulcanval(settings);
   *
   * let usernameValid = vv.validateField('username', map);
   * console.log(usernameValid); // 'Debe ser alfanumérico en local "en-GB".'
   *
   * map.username = 'rp';
   * usernameValid = vv.validateField('username', map);
   * console.log(usernameValid); // 'Mínimo valor: 4.'
   *
   * let ageValid = vv.validateField('age', map);
   * console.log(ageValid); // 'Valor "720" debe ser número entero.'
   */
  msgs: {
    defaults: {}
  },

  /**
   * *Only client-side.*
   *
   * Utility context.
   *
   * @private
   * @name context
   * @memberof settings
   * @see {@link utilityContext}
   * @type {Object}
   */
  context: null,

  /**
   * The form fieldsets to configure.
   *
   * @name fieldsets
   * @memberof settings
   * @see See {@link fieldsetSettings} for more info about its configuration.
   * @type {Array}
   * @default [ ]
   */
  fieldsets: [],

  /**
   * The form fields to configure.
   *
   * @name fields
   * @memberof settings
   * @see See {@link fieldSettings} for more info about its configuration.
   * @type {Array}
   * @default [ ]
   */
  fields: [],

  /**
   * *Only client-side.*
   *
   * jQuery `<form>` element.
   *
   * The form node element saves the jQuery data states:
   * - {undefined|Boolean} vv-modified - If any field has been modified by the user
   *   after the validation process has been set. undefined if it's unknown.
   * - {undefined|Boolean} vv-valid - If all fields are valid. undefined if it's unknown.
   *
   * @private
   * @name $form
   * @memberof settings
   * @type {external:jQuery}
   */
  $form: null,

  /**
   * *Only client-side.*
   *
   * On form submit event.
   *
   * @private
   * @name onSubmit
   * @memberof settings
   * @type {Function}
   */
  onSubmit: null,

  /**
   * *Only client-side.*
   *
   * On form reset event.
   *
   * @private
   * @name onReset
   * @memberof settings
   * @type {Function}
   */
  onReset: null,

  /**
   * Get a message template according to locale.
   *
   * @private
   * @name getMsgTemplate
   * @memberof settings
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
  },


  /**
   * Extend settings.
   *
   * @private
   * @name extend
   * @memberof settings
   * @param  {Object} custom - Extend this settings with this paramter.
   * @return {Object} Extended settings.
   */
  extend: function extend(custom) {
    'use strict';

    if ((typeof custom === 'undefined' ? 'undefined' : _typeof(custom)) !== 'object') {
      return _log2.default.error('a valid object is required to extend');
    }

    custom = (0, _extend3.default)(true, {}, custom);

    var locales = [];
    _utils2.default.walkObject(this.msgs, function (msgs, locale) {
      if (locale !== 'defaults') locales.push(locale);
    });

    // Validate fields.
    if (!Array.isArray(custom.fields) || !custom.fields.length) {
      _log2.default.error('there are no fields for validation');
    }
    if (custom.fields) {
      custom.fields.forEach(function (field) {
        if (!_utils2.default.validateFieldName(field.name)) {
          _log2.default.error('field name "' + field.name + '" must be a valid name');
        }
      });
    }

    // Create context.
    // @NOTE: The .get() method the context has will be set on this object
    // when the instance on client or server side is made.
    custom.context = _utilityContext2.default.extend();

    // Process fieldsets.
    if (custom.fieldsets) {
      (function () {
        var fieldsNames = custom.fields.map(function (field) {
          return field.name;
        });

        custom.fieldsets = custom.fieldsets.map(function (fieldset) {

          var fields = void 0,
              field = void 0;

          if (typeof fieldset.name !== 'string' || !_external.validator.isAlphanumeric(fieldset.name) || !fieldset.name.length) {
            _log2.default.error('fieldset name "' + fieldset.name + '" is invalid');
          }

          if (fieldset.fields instanceof RegExp) {
            fields = fieldsNames.filter(function (name) {
              return fieldset.fields.test(name);
            });
          } else if (typeof fieldset.fields === 'string') {
            fields = fieldsNames.filter(function (name) {
              return name.indexOf(fieldset.fields) === 0;
            });
          } else if (Array.isArray(fieldset.fields)) {
            fields = [];
            fieldset.fields.forEach(function (fsfield) {
              field = _utils2.default.find(fieldsNames, function (fn) {
                return fn === fsfield;
              });
              if (field) fields.push(field);else _log2.default.error('fieldset field "' + fsfield + '" not found');
            });
          }

          if (!fields || !fields.length) {
            _log2.default.error('fieldset name "' + fieldset.name + '" fields not found');
          }

          fieldset.fields = fields;

          return _fieldsetSettings2.default.extend(fieldset);
        });
      })();
    }

    // Process fields.
    var inheritFromSettings = ['disabled', 'autostart', 'intern', 'firstValidationEvent', 'validationEvents'];
    var inheritFromFieldsetSettings = ['disabled', 'autostart', 'intern', 'required', 'onlyUI', 'firstValidationEvent', 'validationEvents'];
    custom.fields = custom.fields.map(function (field) {

      var newField = {};

      // value() will only be used in client side so field.$el will be available.
      if (field.value) {
        newField.value = field.value.bind(custom.context, field.$el);
      } else {
        newField.value = _fieldSettings2.default.value.bind(custom.context, field.$el);
      }

      if (field.onlyIf) {
        (function () {
          var onlyIf = field.onlyIf;
          delete field.onlyIf;
          newField.onlyIf = function () {
            return onlyIf.call(custom.context, custom.context.get && custom.context.get(field.name));
          };
        })();
      }

      var fromBaseSettings = _utils2.default.pick(settings, inheritFromSettings);
      var fromSettings = _utils2.default.pick(custom, inheritFromSettings);
      (0, _extend3.default)(newField, fromBaseSettings, fromSettings);

      if (custom.fieldsets) {
        custom.fieldsets.forEach(function (fieldset) {
          if (_utils2.default.find(fieldset.fields, function (ff) {
            return ff === field.name;
          })) {

            var fromFieldsetSettings = _utils2.default.pick(fieldset, inheritFromFieldsetSettings);
            (0, _extend3.default)(newField, fromFieldsetSettings);

            if (fieldset.onlyIf) {
              (function () {
                var onlyIf = newField.onlyIf;
                var fsOnlyIf = fieldset.onlyIf;
                delete newField.onlyIf;
                newField.onlyIf = function () {
                  return (onlyIf ? onlyIf() : true) && fsOnlyIf.call(custom.context, custom.context.get && custom.context.get(field.name));
                };
              })();
            }

            newField.validators = (0, _extend3.default)(true, {}, newField.validators, fieldset.validators, field.validators);
          }
        });
      }

      var validators = field.validators;
      var onlyIf = field.onlyIf;
      var value = field.value;
      delete field.validators;
      delete field.onlyIf;
      delete field.value;

      field = (0, _extend3.default)(newField, field);

      if (!field.validators) field.validators = validators;
      if (!field.onlyIf) field.onlyIf = onlyIf;
      if (!field.value) field.value = value;

      return _fieldSettings2.default.extend(field);
    });

    // Validate locale.
    if (custom.locale) {
      if (!this.msgs[custom.locale]) {
        _log2.default.error('locale "' + custom.locale + '" was not found');
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

        _utils2.default.walkObject(msgs, function (messages, validatorName) {

          // Messages for properties in validator.
          // At the moment, only isLength works this way.
          if (validatorName === 'isLength') {
            var properties = messages;
            _utils2.default.walkObject(properties, function (value, property) {
              if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                _utils2.default.walkObject(value, function (message, locale) {
                  setMsgInLocale(locale, validatorName + '.' + property, message);
                });
              } else {
                setMsgAsDefault(validatorName + '.' + property, value);
              }
            });
          }

          if ((typeof messages === 'undefined' ? 'undefined' : _typeof(messages)) === 'object') {
            _utils2.default.walkObject(messages, function (message, locale) {
              setMsgInLocale(locale, validatorName, message);
            });
          } else {
            setMsgAsDefault(validatorName, messages);
          }
        });

        custom.msgs = newMsgs;
      })();
    }

    return (0, _extend3.default)(true, {}, this, custom);
  }
};

module.exports = settings;

},{"../external":73,"../log":75,"../utils":81,"./fieldSettings":77,"./fieldsetSettings":78,"./utilityContext":80,"extend":1}],80:[function(require,module,exports){
'use strict';

var _external = require('../external');

/**
 * @namespace utilityContext
 * @type {Object}
 *
 * @description
 * This is the function context used in some methods/functions in validations
 * processes.
 *
 * Also, this object has all the methods in the {@link https://www.npmjs.com/package/validator validator}
 * package. So you can shortcut them easily.
 */
var utilityContext = {

  /**
   * Reference to the {@link https://www.npmjs.com/package/validator validator}
   * package.
   *
   * @type {Object}
   */
  validator: null,

  /**
   * A method used to get another field value in the data {@link map} used in
   * the validation. You need to pass the name of the field as a first parameter
   * and will return its value in the data map.
   *
   * If the {@link map} was nested when used in a validation method, you need to
   * reference it as it were plain, ex: `{ person: { age: 22 } }` will be gotten
   * with `.get('person.age')`.
   *
   * If the field was not found, undefined will be returned.
   *
   * @type {Function}
   * @return {*}
   */
  get: null,

  /**
   * Extend utility context.
   *
   * @private
   * @return {Object}
   */
  extend: function extend() {
    var F = function F() {};
    F.prototype = _external.validator;
    F.prototype.validator = _external.validator;
    return new F();
  }
};

module.exports = utilityContext;

},{"../external":73}],81:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _external = require('./external');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = {

  extend: _extend2.default,
  validator: _external.validator,
  browser: _browser2.default,

  walkObject: function walkObject(obj, callback, context) {
    'use strict';

    if (!context) context = obj;

    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        callback.call(context, obj[p], p);
      }
    }

    return obj;
  },
  everyInObject: function everyInObject(obj, callback, context) {
    'use strict';

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
    'use strict';

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
  pick: function pick(root, props, deep) {
    var newProps = {};
    props.forEach(function (prop) {
      if (deep || root.hasOwnProperty(prop)) {
        if (root[prop] !== undefined) {
          newProps[prop] = root[prop];
        }
      }
    });
    return newProps;
  },
  find: function find(arr, callback, context) {
    'use strict';

    if (!context) context = arr;

    for (var i = 0; i < arr.length; i++) {
      if (callback.call(context, arr[i], i)) {
        return arr[i];
      }
    }
  },
  mergeCollections: function mergeCollections(id, arr1, arr2) {
    'use strict';

    id = id ? id : 0;
    arr1 = arr1 ? arr1 : [];
    arr2 = arr2 ? arr2 : [];

    var arr = [];
    var temp1, temp2;

    arr1.forEach(function (a1) {

      temp1 = utils.find(arr, function (a) {
        return a[id] === a1[id];
      });
      if (temp1) {
        (0, _extend2.default)(true, temp1, a1);
      }

      temp2 = utils.find(arr2, function (a2) {
        return a2[id] === a1[id];
      });
      if (temp1) {
        (0, _extend2.default)(temp1, temp2);
      } else if (temp2) {
        arr.push((0, _extend2.default)(true, {}, a1, temp2));
      } else {
        arr.push(a1);
      }
    });

    arr2.forEach(function (a2) {
      temp1 = utils.find(arr, function (a) {
        return a[id] === a2[id];
      });
      if (!temp1) {
        arr.push(a2);
      }
    });

    return arr;
  },
  removeArrayDuplicates: function removeArrayDuplicates(arr) {
    'use strict';

    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }

    arr = [];
    for (var key in obj) {
      arr.push(key);
    }

    return arr;
  },
  formatWalk: function formatWalk(obj, list, i) {
    'use strict';

    if (!list[i]) return;

    if (_typeof(obj[list[i]]) === 'object') {
      return utils.formatWalk(obj[list[i]], list, i + 1);
    } else {
      return obj[list[i]];
    }
  },
  format: function format(str, params) {
    'use strict';

    str = String(str);
    params = params || {};

    var name = void 0,
        value = void 0;
    var props = str.match(/\{\{\w+(\w|\.\w+)*\}\}/g);

    if (props && props.length) {

      props = utils.removeArrayDuplicates(props);
      props = props.map(function (p) {
        return p.replace('{{', '').replace('}}', '').split('.');
      });

      for (var i = 0; i < props.length; i++) {
        value = utils.formatWalk(params, props[i], 0);
        if (value) {
          name = props[i].join('.');
          str = str.replace(new RegExp('{{' + name + '}}', 'g'), value);
        }
      }
    }

    return str;
  },
  validateFieldName: function validateFieldName(name) {
    if (typeof name !== 'string') return false;
    return name.split('.').every(function (part) {
      return (/^[-_a-zA-Z0-9]{1,}$/.test(part) && !_external.validator.isInt(part.charAt(0)) && !!part.length
      );
    });
  },
  trimSpaces: function trimSpaces(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }
};

module.exports = utils;

},{"./browser":69,"./external":73,"extend":1}],82:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate provided data map and get an object describing each field error if there are.
 *
 * @static
 * @method validator.validate
 *
 * @param  {map} map - The data map.
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
 * const vv = vulcanval(settings);
 *
 * const result = vv.validate(map);
 * console.log(result);
 * // {
 * //   name: 'This field should only contain lowercase text.',
 * //   likesPumpkin: 'Please fill out this field.'
 * // }
 *
 * map.name = 'romel';
 * map.likesPumpkin = true;
 * const result2 = vv.validate(map);
 * console.log(result2);
 * // false
 */
module.exports = function (map) {
  'use strict';

  var _this = this;

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    return log.error('first parameter (map) must be an object');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn('field "' + name + '" not found in map');
    }
  };

  var errors = {};

  this.settings.fields.forEach(function (field) {
    var err = _this.rawValidation(field.name);
    if (err) {
      errors[field.name] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};

},{"./convertMapTo":71,"./log":75,"./rawValidation":76}],83:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate a field in provided data {@link map}.
 *
 * @static
 * @method validator.validateField
 *
 * @param  {String} fieldName - The field name to validate. If the {@link map} is nested,
 * the field name should be set as in plain map. Ex: `{user: {name: 'romel'}}` will be `'user.name'`.
 * @param  {map} map - The data map (plain or nested).
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
 * const vv = vulcanval(settings);
 *
 * const nameResult = vv.validateField('name', map);
 * console.log(nameResult); // 'This field should only contain lowercase text.'
 *
 * const ageResult = vv.validateField('age', map);
 * console.log(ageResult); // false
 */
module.exports = function (fieldName, map) {
  'use strict';

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    log.error('second parameter (map) must be an object');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  if (!utils.find(this.settings.fields, function (f) {
    return f.name === fieldName;
  })) {
    log.error('field "' + fieldName + '" was not found');
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn('field "' + name + '" not found in map');
    }
  };

  return this.rawValidation(fieldName);
};

},{"./convertMapTo":71,"./log":75,"./rawValidation":76,"./utils":81}],84:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log = require('./log');
var utils = require('./utils');
var convertMapTo = require('./convertMapTo');
var rawValidation = require('./rawValidation');

/**
 * Validate all fields of fieldset in {@link map} provided.
 *
 * @static
 * @method validator.validateFieldset
 *
 * @param  {String} fieldsetName - The fieldset name to validate.
 * @param  {map} map - The data map (plain or nested).
 *
 * @return {Boolean|Object} If the fieldset fields are valid, `false` will be returned.
 * Otherwise there will be an object describing each field error as a plain map with its
 * keys as the fields names even if the property {@link settings.enableNestedMaps}
 * is enabled. Use the {@link vulcanval.convertMapTo} method if needed.
 *
 * @example
 * const map = {
 *   user: {
 *     name: 'Romel',
 *     age: 22
 *   },
 *   course: {
 *     id: '4cdfb11e1f3c000000007822',
 *     register: 'wrong value'
 *   }
 * };
 *
 * const settings = {
 *
 *   // Usually you would use nested maps with fieldsets.
 *   enableNestedMaps: true,
 *
 *   fieldsets: [{
 *     name: 'user',
 *     fields: ['user.name', 'user.age'],
 *     required: true
 *   }, {
 *     name: 'course',
 *     fields: ['course.id', 'course.register'],
 *     required: true
 *   }],
 *
 *   fields: [{
 *     name: 'user.name',
 *     validators: { isAlphanumeric: true, isLowercase: true }
 *   }, {
 *     name: 'user.age',
 *     validators: { isInt: { min: 1, max: 500 } }
 *   }, {
 *     name: 'course.id',
 *     validators: { isMongoId: true }
 *   }, {
 *     name: 'course.register',
 *     validators: { isISO8601: true }
 *   }]
 * };
 *
 * const vv = vulcanval(settings);
 *
 * const nameResult = vv.validateFieldset('user', map);
 * console.log(nameResult);
 * // { 'user.name': 'This field should only contain lowercase text.' }
 *
 * const ageResult = vv.validateFieldset('course', map);
 * console.log(ageResult);
 * // { 'course.register': 'Please type a valid date.' }
 */
module.exports = function (fieldsetName, map) {
  'use strict';

  var _this = this;

  if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') {
    log.error('second parameter (map) must be an object');
  }

  var fieldset = utils.find(this.settings.fieldsets, function (fs) {
    return fs.name === fieldsetName;
  });

  if (!fieldset) {
    log.error('fieldset "' + fieldsetName + '" was not found');
  }

  if (this.settings.enableNestedMaps) {
    map = convertMapTo('plain', map);
  }

  this.settings.context.get = function (name) {
    if (map[name] !== undefined) {
      return map[name];
    } else {
      log.warn('field "' + name + '" not found in map');
    }
  };

  var errors = {};

  fieldset.fields.forEach(function (fieldname) {
    var err = _this.rawValidation(fieldname);
    if (err) {
      errors[fieldname] = err;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  } else {
    return false;
  }
};

},{"./convertMapTo":71,"./log":75,"./rawValidation":76,"./utils":81}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
'use strict';

module.exports = '3.1.3';

},{}],88:[function(require,module,exports){
'use strict';

var extend = require('extend');

var validator = require('./external').validator;
var log = require('./log');
var utils = require('./utils');
var browser = require('./browser');
var localeEN = require('./locale/en');
var version = require('./version');

var settings = require('./settings/settings');
var fieldsetSettings = require('./settings/fieldsetSettings');
var fieldSettings = require('./settings/fieldSettings');
var utilityContext = require('./settings/utilityContext');

var extendLocale = require('./extendLocale');
var convertMapTo = require('./convertMapTo');
var cleanMap = require('./cleanMap');
var addValidator = require('./addValidator');
var rawValidation = require('./rawValidation');
var validate = require('./validate');
var validateField = require('./validateField');
var validateFieldset = require('./validateFieldset');

var isEqualToField = require('./validators/isEqualToField');
var isAlphanumericText = require('./validators/isAlphanumericText');

/**
 * This is a reference to the {@link module:vulcanval vulcanval}.
 *
 * @name vulcanval
 * @memberof external:window
 * @type {Object}
 * @see {@link module:vulcanval}
 */

/**
 * @namespace validator
 * @type {Object}
 * @description
 * This is an object created by the module {@link module:vulcanval vulcanval} by
 * specified {@link settings} to validate {@link map data maps}.
 *
 * This object has some methods to help you validate data possibly extracted from
 * forms through a configuration that can be used in client side and server side.
 *
 * @see {@link module:vulcanval vulcanval} to see how to create this object.
 */
var vulcanvalProto = {
  cleanMap: cleanMap,
  rawValidation: rawValidation,
  validate: validate,
  validateFieldset: validateFieldset,
  validateField: validateField
};

/**
 * The vulcan validator (vulcanval) creator.
 *
 * This module is a function which receives a {@link settings} object and returns
 * a {@link validator} object to validate {@link map data maps}.
 *
 * Also this has some properties and methods to configure the validations globally.
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
 * @see {@link validator}
 * @example
 * // Changing a global configuration in settings.
 * vulcanval.settings.locale = 'pt';
 *
 * // Addind a new validator method.
 * vulcanval.addValidator('valName', function () { ... });
 *
 * // Extending/creating a new locale/language.
 * vulcanval.extendLocale({ ... });
 *
 * // A form configuration to create a validator.
 * const settings = {
 *   fields: [{
 *     name: 'fieldName',
 *     validators: {}
 *   }]
 * };
 *
 * // Creating a validator from settings.
 * const validator = vulcanval(settings);
 *
 * // A data map to validate.
 * const map = {
 *   fieldName: 'field value'
 * };
 *
 * // Validating the map with the validator.
 * const result = validator.validate(map);
 */
var vulcanval = function vulcanval(custom) {
  return extend(Object.create(vulcanvalProto), {
    settings: settings.extend(custom)
  });
};

/**
 * @name log
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link https://github.com/romelperez/prhone-log prhone-log}
 * package instance used to log messages.
 */
vulcanval.log = log;

/**
 * @name validator
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link https://github.com/chriso/validator.js validator}
 * package.
 */
vulcanval.validator = validator;

/**
 * @name settings
 * @memberof module:vulcanval
 * @type {Object}
 * @description
 * This is a reference to the {@link settings} global configuration.
 */
vulcanval.settings = settings;

/**
 * @name utilityContext
 * @memberof module:vulcanval
 * @type {Object}
 *
 * @description
 * This is a reference to the {@link utilityContext} global configuration.
 *
 * This can be mutated to use your own custom properties and methods in any
 * method/function that make use of this context.
 */
vulcanval.utilityContext = utilityContext;

vulcanval.version = version;
vulcanval.utils = utils;
vulcanval.fieldsetSettings = fieldsetSettings;
vulcanval.fieldSettings = fieldSettings;
vulcanval.extendLocale = extendLocale;
vulcanval.addValidator = addValidator;
vulcanval.convertMapTo = convertMapTo;

// Install the English language.
vulcanval.extendLocale(localeEN);
vulcanval.settings.locale = 'en';

// Install custom validators.
vulcanval.addValidator('isEqualToField', isEqualToField);
vulcanval.addValidator('isAlphanumericText', isAlphanumericText);

// Install module in browser if client side.
browser.install(function () {
  window.vulcanval = vulcanval;
});

module.exports = vulcanval;

},{"./addValidator":68,"./browser":69,"./cleanMap":70,"./convertMapTo":71,"./extendLocale":72,"./external":73,"./locale/en":74,"./log":75,"./rawValidation":76,"./settings/fieldSettings":77,"./settings/fieldsetSettings":78,"./settings/settings":79,"./settings/utilityContext":80,"./utils":81,"./validate":82,"./validateField":83,"./validateFieldset":84,"./validators/isAlphanumericText":85,"./validators/isEqualToField":86,"./version":87,"extend":1}]},{},[88]);
