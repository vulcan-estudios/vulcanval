const isTravis = !!process.env.TRAVIS;

module.exports = {

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['browserify', 'mocha', 'chai', 'fixture'],


  // list of files / patterns to load in the browser
  files: [
    'dist/vulcanval.js',
    'dist/vulcanval-jquery.js',
    'test/jquery/**/*.html',
    'test/jquery/**/*.json',
    'test/jquery/**/*.js',
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
    debug: true,
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


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: !isTravis,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: isTravis ? ['PhantomJS'] : ['Chrome', 'Firefox'],


  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: isTravis,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity
};
