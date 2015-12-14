var gulp    = require('gulp'),
  jshint    = require('gulp-jshint'),
  stylish   = require('jshint-stylish'),
  config    = require('../../config').jshint;

/**
 * Check JavaScript sytax with JSHint
 */
gulp.task('jshint', function() {
  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
