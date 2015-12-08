var gulp     = require('gulp'),
    del      = require('del'),
    config   = require('../../config').delete;

/**
 * Delete folders and files
 */
gulp.task('delete', function(callback) {
  del(config.src, callback);
});
