var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps'),
    browsersync  = require('browser-sync'),
    gulpFilter   = require('gulp-filter'),
    plumber      = require('gulp-plumber'),
    gutil        = require('gulp-util'),
    config       = require('../../config');

function onError (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
}

gulp.task('styles2', function () {
   browsersync.notify('Transforming CSS with SASS');

      return gulp.src(config.styles.src)
      .pipe(plumber({
        errorHandler: onError
      }))
        .pipe(sass({
          includePaths: ['sass'],
          // onError: browserSync.notify
        }))
        .pipe(autoprefixer(config.styles.options.autoprefixer))

        // .pipe(filter) // Don't write Sourcemaps of Sourcemaps
        .pipe(sourcemaps.write())
        // .pipe(filter.restore) // Recreate original files
        // .pipe(gulp.dest('site/css'))
        .pipe(gulp.dest(config.styles.dest))
        // .pipe(browserSync.reload({stream:true}))

});


gulp.task('styles', function() {
  browsersync.notify('Transforming CSS with SASS');
  return gulp.src(config.styles.src)
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass({
    includePaths: ['sass'],
    // onError: browserSync.notify
  }))
    .pipe(autoprefixer(config.styles.options.autoprefixer))

    .pipe(gulp.dest(config.styles.dest));
});
