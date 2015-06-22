'use strict';
/*eslint-env node */

// Based on
// https://github.com/martinmicunda/employee-scheduling-ui/blob/master/gulpfile.js

//=============================================
//            PLUGIN REFERENCES
//=============================================
var gulp          = require('gulp');
var plugins       = require('gulp-load-plugins')();
var del           = require('del');
var path          = require('path');
var browserSync   = require('browser-sync');
var runSequence   = require('run-sequence');
var karma         = require('karma').server;
var moment        = require('moment');
var pkg           = require('./package.json');

//=============================================
//            DECLARE VARIABLES
//=============================================
var log                  = plugins.util.log;
var argv                 = plugins.util.env;
var COLORS               = plugins.util.colors;


//=============================================
//            DECLARE PATHS
//=============================================

var paths = {
    /**
     * The 'gulpfile' file is where our run tasks are hold.
     */
    gulpfile: 'gulpfile.js',
    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `app/`). These file paths are used in the configuration of
     * build tasks.
     *
     * - 'styles'       contains all project css styles
     * - 'images'       contains all project images
     * - 'fonts'        contains all project fonts
     * - 'scripts'      contains all project javascript except config-env.js and unit test files
     * - 'html'         contains main html files
     * - 'templates'    contains all project html templates
     */
    app: {
        basePath:       '/',
        fonts:          [
                          'fonts/**/*.{eot,svg,ttf,woff,woff2}',
                          'jspm_packages/**/*.{eot,svg,ttf,woff,woff2}'
                        ],
        styles: {
            scss:       ['styles/**/*.scss', 'app/directives/**/*.scss'],
            main:       'styles/main.scss',
            concat:     [
                        ],
            include:    [
                          'styles/',
                          'jspm_packages/github/twbs/bootstrap-sass@3.3.5/assets/stylesheets/',
                          'jspm_packages/github/fortawesome/font-awesome@4.3.0/scss/'
                        ]
        },
        images:         'images/**/*.{png,gif,jpg,jpeg}',
        scripts:        [
                          'app/**/*.js',
                          '!app/**/*.test.js'
                        ],
        html:           'index.html',
        templates:      'app/**/*.html'
    },
    /**
     * This is a collection of file patterns that refer to our app unit and e2e tests code.
     *
     * 'config'       contains karma and protractor config files
     * 'testReports'  contains unit and e2e test reports
     * 'unit'         contains all project unit test code
     * 'e2e'          contains all project e2e test code
     */
    test: {
        basePath:       'test/',
        config: {
            karma:      'karma.conf.js',
        },
        mock:           'app/**/*.mock.js',
        unit:           'app/**/*.test.js',
    },
    /**
     * The 'tmp' folder is where our html templates are compiled to JavaScript during
     * the build process and then they are concatenating with all other js files and
     * copy to 'dist' folder.
     */
    tmp: {
        basePath:       'tmp/',
        styles:         'tmp/styles/',
        scripts:        'tmp/scripts/',
        fonts:          'tmp/fonts/'
    },
    /**
     * The 'build' folder is where our app resides once it's
     * completely built.
     *
     * - 'dist'         application distribution source code
     * - 'docs'         application documentation
     */
    build: {
        basePath:       'dist/',
        dist: {
            basePath:   'dist/',
            fonts:      'dist/fonts/',
            images:     'dist/images/',
            styles:     'dist/styles/',
            scripts:    'dist/scripts/'
        },
        docs:           'docs/'
    }
};


//=============================================
//            UTILS FUNCTIONS
//=============================================
function formatPercent(num, precision){
    return (num * 100).toFixed(precision);
}

function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return COLORS.yellow(data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
    ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference);
}

//=============================================
//            DECLARE BANNER DETAILS
//=============================================

/**
 * The banner is the comment that is placed at the top of our compiled
 * source files. It is first processed as a Gulp template, where the `<%=`
 * pairs are evaluated based on this very configuration object.
 */
var banner = plugins.util.template(
    '/**\n' +
    ' * <%= pkg.description %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' * @author <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
    ' * @copyright <%= year %>(c) <%= pkg.author.name %>\n' +
    //' * @license <%= pkg.license.type %>, <%= pkg.license.url %>\n' +
    ' */\n', {file: '', pkg: pkg, today: moment(new Date()).format('D/MM/YYYY'), year: new Date().toISOString().substr(0, 4)});


//=============================================
//               SUB TASKS
//=============================================

/**
 * The 'clean' task delete 'build' and '.tmp' directories.
 */
gulp.task('clean', function (cb) {
    var files = [].concat(paths.build.basePath, paths.tmp.basePath);
    log('Cleaning: ' + COLORS.blue(files));

    return del(files, cb);
});

/**
 * The 'eslint' task defines the rules of our hinter as well as which files
 * we should check. It helps to detect errors and potential problems in our
 * JavaScript code.
 */
gulp.task('eslint', function () {
    return gulp.src(paths.app.scripts)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        //.pipe(plugins.eslint.failOnError())
        ;
});

/**
 * The 'htmlhint' task defines the rules of our hinter as well as which files we
 * should check. It helps to detect errors and potential problems in our
 * HTML code.
 */
gulp.task('htmlhint', function () {
    return gulp.src([paths.app.html, paths.app.templates])
        .pipe(plugins.htmlhint('.htmlhintrc'))
        .pipe(plugins.htmlhint.reporter())
        .pipe(plugins.htmlhint.failReporter());
});

gulp.task('lint', ['eslint', 'htmlhint']);

/**
 * Build and copy all styles
*/
gulp.task('styles', ['sass'], function() {
  return gulp.src(paths.app.styles.concat)
      .pipe(plugins.autoprefixer({
        browsers: ['last 2 versions']
      }))
      .on('error', log)
      .pipe(gulp.dest(paths.tmp.styles))
      .on('error', log);
});

/**
 * Compile SASS files into the main.css.
 */
gulp.task('sass', function() {
    return gulp.src(paths.app.styles.main)
        .pipe(plugins.sourcemaps.init())

        // Include all directive styles
        .pipe(plugins.inject(gulp.src(['./app/directives/**/*.scss'], {read: false}), {
          starttag: '/* start-imports */',
          endtag: '/* end-imports */',
          relative: true,
          transform: function (filepath, file, i, length) {
            return "@import '" + filepath + "';";
          }
        }))

        .pipe(plugins.sass({
            includePaths: paths.app.styles.include,
            errLogToConsole: true
        }))
        .pipe(plugins.sourcemaps.write({includeContent: false}))
        .pipe(plugins.sourcemaps.init({loadMaps: true})) // Load sourcemaps generated by sass
        .pipe(plugins.autoprefixer({
          browsers: ['last 2 versions']
        }))
        .on('error', log)
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tmp.styles))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .on('error', log);
});

/**
 * The 'fonts' task copies fonts to `build/dist` directory.
 */
gulp.task('fonts', function () {
    return gulp.src(paths.app.fonts)
      .pipe(plugins.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe(plugins.flatten())
      .pipe(gulp.dest(paths.tmp.fonts))
      .pipe(gulp.dest(paths.build.dist.fonts))
      .pipe(plugins.size({title: 'fonts'}));
});

/**
 * The 'images' task minifies and copies images to `build/dist` directory.
 */
gulp.task('images', function () {
    return gulp.src(paths.app.images)
        .pipe(plugins.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.build.dist.images))
        .pipe(plugins.size({title: 'images'}));
});


/**
 * Create JS production bundle.
 */
gulp.task('bundle', ['eslint'], plugins.shell.task([
    'jspm bundle-sfx app/app-bootstrap ' + paths.tmp.scripts + 'build.js'
  ])
);

/**
 * The 'compile' task compile all js, css and html files.
 *
 * 1. it compiles and minify html templates to js template cache
 * 2. css      - replace local path with CDN url, minify, add revision number, add banner header
 *    css_libs - minify, add revision number
 *    js       - annotates the sources before minifying, minify, add revision number, add banner header
 *    js_libs  - minify, add revision number
 *    html     - replace local path with CDN url, minify
 */
gulp.task('compile', ['htmlhint', 'styles', 'bundle'], function () {
        var projectHeader = plugins.header(banner);

        return gulp.src(paths.app.html)
            .pipe(plugins.inject(gulp.src(paths.tmp.scripts + 'build.js', {read: false}), {
                starttag: '<!-- inject:build:js -->',
                ignorePath: [paths.app.basePath]
            }))
            .pipe(plugins.usemin({
                css: [
                    plugins.bytediff.start(),
                    plugins.minifyCss({
                      keepSpecialComments: 0,
                      rebase: false
                    }),
                    plugins.bytediff.stop(bytediffFormatter),
                    plugins.rev(),
                    projectHeader
                ],
                js: [
                    plugins.bytediff.start(),
                    plugins.uglify(),
                    plugins.bytediff.stop(bytediffFormatter),
                    plugins.rev(),
                    projectHeader
                ],
                html: [
                    plugins.bytediff.start(),
                    plugins.minifyHtml({empty:true}),
                    plugins.bytediff.stop(bytediffFormatter)
                ]
            }))
            .pipe(gulp.dest(paths.build.dist.basePath))
            .pipe(plugins.size({title: 'compile', showFiles: true}));
    });

/**
 * The 'watch' task set up the checks to see if any of the files listed below
 * change, and then to execute the listed tasks when they do.
 */
gulp.task('watch', function () {
    // Watch images and fonts files
    gulp.watch([paths.app.images, paths.app.fonts], [browserSync.reload]);

    // Watch scss files
    gulp.watch(paths.app.styles.scss, ['styles']);

    // Watch js files
    gulp.watch([paths.app.scripts, paths.gulpfile], ['eslint', browserSync.reload]);

    // Watch html files
    gulp.watch([paths.app.html, paths.app.templates], ['htmlhint', browserSync.reload]);
});


//---------------------------------------------
//            DEVELOPMENT TASKS
//---------------------------------------------


/**
 * The 'serve' task serve the dev environment.
 */
gulp.task('serve', ['lint', 'styles', 'images', 'fonts', 'watch'], function() {
    return browserSync.init({
      notify: false,
      port: 8000,
      browser: [],
      tunnel: false,
      server: true
    });

});

/**
 * The 'default' task to serve the dev environment.
 */
gulp.task('default', ['serve']);


//---------------------------------------------
//               TEST TASKS
//---------------------------------------------

/**
 * The 'test:unit' task to run karma unit tests
 */
gulp.task('test:unit', function (cb) {
    var options = { configFile: path.join(__dirname, paths.test.config.karma) };

    if (argv.browsers) {
      options.browsers = [argv.browsers];
    }

    if (argv.reporters) {
      options.reporters = [argv.reporters];
    }

    if (argv.watch) {
      var watch = !!argv.watch;
      options.autoWatch = watch;
      options.singleRun = !watch;
    }

    karma.start(options,
      function(code) {
          // make sure failed karma tests cause gulp to exit non-zero
          if(code === 1) {
              log(COLORS.red('Error: unit test failed'));
              return process.exit(1);
          }
          cb();
      }
    );
});


//---------------------------------------------
//               BUILD TASKS
//---------------------------------------------

/**
 * The 'build' task gets app ready for deployment by processing files
 * and put them into directory ready for production.
 */
gulp.task('build', function (cb) {
    runSequence(
        ['clean'],
        ['compile', 'images', 'fonts'],
        cb
    );
});

/**
 * The 'deploy' task will push to Github pages using either:
 *   - OAuth token if `GH_TOKEN` is set in an environment variable (ex. Travis)
 *   - SSH key if `GH_TOKEN` is not set as an environment variable (ex. local dev)
 */
gulp.task('deploy', ['build'], plugins.shell.task([
    'git init',
    'git add .',
    'git commit -m "Deployed to Github Pages"',
    'if [ $GH_TOKEN ];    then echo "Deploying with OAuth token"; git push --force "https://$GH_TOKEN@github.com/StrictlyBusiness/fda-food-recalls" master:gh-pages; fi',
    'if [ -z $GH_TOKEN ]; then echo "Deploying with SSH key";     git push --force "git@github.com:StrictlyBusiness/fda-food-recalls.git" master:gh-pages; fi',
  ], { cwd: paths.build.dist.basePath })
);
