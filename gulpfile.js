const gulp =         require('gulp');
const rename =       require('gulp-rename');
const gutil =        require('gulp-util');
const source =       require('vinyl-source-stream');
const browserify =   require('browserify');
const uglify =       require('gulp-uglify');
const sass =         require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS =     require('gulp-clean-css');


gulp.task('browserify', function () {
  return browserify({
    entries: './src/js/vulcanval.js'
  })
  .transform('babelify', {
    presets: ['es2015']
  })
  .bundle()
  .pipe(source('./src/js/vulcanval.js'))
  .pipe(rename({
    dirname: '',
    basename: 'vulcanval'
  }))
  .pipe(gulp.dest('./dist'));
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

gulp.task('doc-js', function () {
  // TODO:
});

gulp.task('doc-sass', function () {
  // TODO:
});


gulp.task('build', ['browserify', 'browserify-compress', 'sass', 'sass-compress']);
gulp.task('doc', ['doc-js', 'doc-sass']);
gulp.task('default', ['build', 'doc']);
