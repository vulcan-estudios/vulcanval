const argv =        require('yargs').argv;
const gulp =        require('gulp');
const streamify =   require('gulp-streamify');
const rename =      require('gulp-rename');
const gutil =       require('gulp-util');
const gulpif =      require('gulp-if');
const uglify =      require('gulp-uglify');
const source =      require('vinyl-source-stream');
const browserify =  require('browserify');

const isProduction = argv.production;

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
  .pipe(gulpif(
    isProduction,
    streamify(uglify().on('error', gutil.log))
  ))
  .pipe(gulp.dest('./dist'));
});
