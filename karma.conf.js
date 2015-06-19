/*eslint-env node */
module.exports = function(config) {
  var sauceLabsLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '11'
    },
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    //files: [
    //  'build/js/**/*.js',
    //  'test/**/*.js'
    //],

    jspm: {
      config: 'config.js',
      loadFiles: [ // Test Files
        'app/**/*.test.js'
      ],
      serveFiles: [ // Non-test Files
        'app/**/!(*.test).js',
        'app/**/*.json',
        'app/**/*.html',
        'app/**/*.map' // Include maps for debugging
      ]
    },

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // reporter options
    mochaReporter: {
      output: 'full',
      ignoreSkipped: false
    },

    // web server port
    port: 9876,

    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
    browserNoActivityTimeout: 120000,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Make available the SauchLab browers
    customLaunchers: sauceLabsLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

    // enable / disable watching file and executing tests whenever any file changes
    // autoWatch: true
  });

  if (process.env.CI) {
    var buildLabel = 'Local development';
    if (process.env.TRAVIS) {
      buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    }

    console.log('SAUCE ENV:', process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY);
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
      process.exit(1);
    }

    config.set({
      browsers: Object.keys(sauceLabsLaunchers),
      reporters: ['dots', 'saucelabs'],
      // logLevel = config.LOG_DEBUG,
      singleRun: true,
      autoWatch: false,

      sauceLabs: {
        build: buildLabel,
        testName: 'FDA Food Recalls tests',
        // startConnect: false,
        // recordScreenshots: true,
        // recordVideo: true,
      }
    });
  }
};
