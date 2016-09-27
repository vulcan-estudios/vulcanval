// Karma configuration
// Generated on Wed Jun 29 2016 15:07:19 GMT-0500 (COT)

const _ =         require('lodash');
const baseConf =  require('./karma-jquery-base.conf');

const isTravis =  !!process.env.TRAVIS;

module.exports = function (config) {

  const confParsed = _.extend(true, baseConf, {

    // list of files / patterns to load in the browser
    files: ['lib/jquery-3.0.0.min.js'].concat(baseConf.files),


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

  });

  config.set(confParsed);
};
