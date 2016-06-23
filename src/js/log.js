const Log = require('prhone-log');

module.exports = new Log('vulcanval', {
  scale: 1,  // TODO: Set to 2 in production.
  throwErrors: true
});
