var gulp        = require('gulp'),
    runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build', function(callback) {
  runSequence('delete',
  [
    'jekyll',
    'styles',
    'scripts',
    'images',
    'crop-images'
  ],
  'fonts',
  'move-sprite',
  'base64',
  callback);
});
