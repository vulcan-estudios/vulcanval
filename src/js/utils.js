module.exports = {

  everyInObject (obj, callback, context) {

    if (!context) context = obj;

    var keep = true;

    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        keep = callback.call(context, obj[name], name);
        if (!keep) return false;
      }
    }

    return !!keep;
  },

  find (arr, callback, context) {

    if (!context) context = arr;

    for (var i=0; i<arr.length; i++) {
      if (callback.call(context, arr[i], i)) {
        return arr[i];
      }
    }
  },

  format (str, params) {
    str = String(str);
    params = params || {};
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        str = str.replace(new RegExp(`\{\{${p}\}\}`, 'g'), params[p]);
      }
    }
    return str;
  }
};
