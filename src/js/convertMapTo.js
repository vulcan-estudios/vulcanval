module.exports = function (map, to) {

  const form = {};

  const run = (n, o, p) => {
    if (o.hasOwnProperty(p)) {
      n += '.'+ p;
      if (typeof o[p] === 'string' || typeof o[p] === 'number' || typeof o[p] === 'boolean') {
        n = n.substring(1);
        form[n] = o[p];
      } else {
        for (var k in o[p]) {
          run(n, o[p], k);
        }
      }
    }
  };

  for (var p in map) {
    run('', map, p);
  }

  return form;
};
