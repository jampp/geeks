var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    size   = require('gulp-size'),
    fontmin = require('gulp-fontmin'),
    config = require('../../config').optimize.fonts;

/**
 * Copy and minimize JS files
 */
gulp.task('optimize:fonts', function() {
  return gulp.src(config.src)
    .pipe(fontmin())
    .pipe(gulp.dest(config.dest))
    .pipe(size());
});
