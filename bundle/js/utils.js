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