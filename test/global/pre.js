require('babel-core/register');

const vulcanval = require('../../src/js/vulcanval');
const localeES = require('../../src/js/locale/es');

vulcanval.log.setLevel(2);

vulcanval.extendLocale(localeES);
