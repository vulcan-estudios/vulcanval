// Karma configuration
// Generated on Wed Jun 29 2016 15:07:19 GMT-0500 (COT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
      'lib/jquery-3.1.0.min.js',
      'dist/vulcanval.js',
      'dist/vulcanval-jquery.js',
      'test/jquery/**/*.html',
      'test/jquery/**/*.json',
      'test/jquery/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/js/**/*.js': ['browserify'],
      'test/jquery/**/*.js': ['browserify'],
      'test/jquery/**/*.html': ['html2js'],
      'test/jquery/**/*.json': ['json_fixtures']
    },


    // preprocessor browserify
    browserify: {
      transform: [
        ['babelify', {
          presets: ['es2015']
        }]
      ]
    },

    // preprocessor json fixtures
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
