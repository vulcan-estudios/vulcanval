const del =          require('del');
const requireDir =   require('require-dir');
const gulp =         require('gulp');
const rename =       require('gulp-rename');
const gutil =        require('gulp-util');
const source =       require('vinyl-source-stream');
const browserify =   require('browserify');
const uglify =       require('gulp-uglify');
const sass =         require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS =     require('gulp-clean-css');
const sassdoc =      require('sassdoc');
const jsdoc =        require('gulp-jsdoc3');


gulp.task('browserify', function () {

  // Browserify files to build.
  const files = {
    vulcanval: './src/js/main.js'
  };

  // Add languages not added to package.
  const langs = requireDir('./src/js/localization');
  delete langs.en;
  Object.keys(langs).forEach(lang => {
    files[lang] = `./src/js/localization/${lang}.js`;
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
  return gulp.src('./dist/vulcanval.js')
    .pipe(rename({
      basename: 'vulcanval.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src(['./src/scss/**/*.scss'])
    .pipe(
      sass({
        sourceComments: true
      })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer({
      browsers: [
        'last 5 versions',
        'ie >= 8'
      ]
    }))
    .pipe(rename({
      dirname: '',
      basename: 'vulcanval'
    }))
    .pipe(gulp.dest('./dist/', {
        overwrite: true
    }));
});

gulp.task('sass-compress', ['sass'], function () {
  return gulp.src('./dist/vulcanval.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      dirname: '',
      basename: 'vulcanval.min'
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
    ]
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
      dest: './doc/sass',
      basePath: 'https://github.com/vulcan-estudios/vulcanval/tree/master',
      descriptionPath: './doc/sass-intro.md',
      display: {
        access: ['public']
      }
    }));
});


gulp.task('build', ['browserify', 'browserify-compress', 'sass', 'sass-compress']);
gulp.task('doc', ['doc-js', 'doc-sass']);
gulp.task('default', ['build', 'doc']);
