const fs =           require('fs');
const del =          require('del');
const requireDir =   require('require-dir');
const gulp =         require('gulp');
const rename =       require('gulp-rename');
const gutil =        require('gulp-util');
const uglify =       require('gulp-uglify');
const cleanCSS =     require('gulp-clean-css');
const source =       require('vinyl-source-stream');
const browserify =   require('browserify');
const sass =         require('node-sass');
const sassdoc =      require('sassdoc');
const jsdoc =        require('gulp-jsdoc3');


gulp.task('browserify', function () {

  // Browserify files to build.
  const files = {
    'vulcanval': './src/js/vulcanval.js',
    'vulcanval-jquery': './src/js/jquery/index.js'
  };

  // Add languages not added to package.
  const langs = requireDir('./src/js/locale');
  delete langs.en;
  Object.keys(langs).forEach(lang => {
    files[lang] = `./src/js/locale/${lang}.js`;
  });

  Object.keys(files).forEach(function (file) {
    browserify({
      entries: files[file]
    })
    .transform('babelify', {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source(files[file]))
    .pipe(rename({
      dirname: '',
      basename: file
    }))
    .pipe(gulp.dest('./dist'));
  });
});

gulp.task('browserify-compress', ['browserify'], function () {

  const files = {
    'vulcanval': './dist/vulcanval.js',
    'vulcanval-jquery': './dist/vulcanval-jquery.js'
  };

  Object.keys(files).forEach(function (file) {
    gulp.src([files[file]])
    .pipe(rename({
      dirname: '',
      basename: file +'.min'
    }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist'));
  });
});

gulp.task('sass', function () {

  // bundle
  const result = sass.renderSync({
    file: './src/scss/jquery/_vulcanval-jquery.scss',
    outFile: './dist/vulcanval-jquery.css'
  });
  fs.writeFileSync(__dirname +'/dist/vulcanval-jquery.css', result.css);

  // compress
  return gulp.src(['./dist/vulcanval-jquery.css'])
    .pipe(cleanCSS())
    .pipe(rename({
      dirname: '',
      basename: 'vulcanval-jquery.min'
    }))
    .pipe(gulp.dest('./dist', {
      overwrite: true
    }));
});

// JS docs.
gulp.task('doc-js-clean', function () {
  return del(['./doc/js']);
});
gulp.task('doc-js', ['doc-js-clean'], function (cb) {
  const config = {
    opts: {
      destination: './doc/js'
    },
    plugins: [
      'plugins/markdown'
    ],
    template: './node_modules/ink-docstrap/template',
    templates: {
      systemName: 'VulcanVal',
      footer: '<div style="text-align:center;">&copy; 2016 <a href="http://romelperez.com" target="_blank">Romel Pérez</a></div>',
      theme: 'united',
      syntaxTheme: 'dark',
      analytics: {
        "ua": "UA-80614822-1",
        "domain": "http://vulcan-estudios.github.io/vulcanval"
      }
    }
  };
  gulp.src(['./doc/js-intro.md', './src/js/**/*.js'], {
    read: false
  })
  .pipe(jsdoc(config, cb));
});

// SASS docs.
gulp.task('doc-sass-clean', function () {
  return del(['./doc/sass']);
});
gulp.task('doc-sass', ['doc-sass-clean'], function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sassdoc({
      package: './package.json',
      dest: './doc/sass',
      basePath: 'https://github.com/vulcan-estudios/vulcanval/tree/master',
      shortcutIcon: './site/favicon.png',
      descriptionPath: './doc/sass-intro.md',
      googleAnalytics: 'UA-80614822-1',
      display: {
        access: ['public']
      }
    }));
});


gulp.task('build', ['browserify', 'browserify-compress', 'sass']);
gulp.task('doc', ['doc-js', 'doc-sass']);
gulp.task('default', ['build', 'doc']);
