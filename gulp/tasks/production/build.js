var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:production', function(callback) {
  runSequence('delete', 'jekyll:production',
  [
    'styles',
    'scripts',
    'images',
    'crop-images',
  ],
  'base64',
  'move-sprite',
  [
    'optimize:css',
    'optimize:js',
    'optimize:images',
//    'optimize:html',
  ],
  'revision',
  'rev:collect',
  [
    'gzip'
  ],
  callback);
});
