var gulp      = require('gulp'),
    size      = require('gulp-size'),
    cssmin = require('gulp-cssmin'),
    config    = require('../../config').optimize.css;

/**
 * Copy CSS files
 */
gulp.task('optimize:css', function() {
  return gulp.src(config.src)
    .pipe(cssmin())
    .pipe(gulp.dest(config.dest))
    .pipe(size());
});
