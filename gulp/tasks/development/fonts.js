var gulp        = require('gulp'),
    changed     = require('gulp-changed'),
    config      = require('../../config').fonts;

/**
 * Copy fonts to build folder
 * if not changed
 */
gulp.task('fonts', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.dest));
});
