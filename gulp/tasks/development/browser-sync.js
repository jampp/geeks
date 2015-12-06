var gulp        = require('gulp'),
    browsersync = require('browser-sync'),
    config      = require('../../config').browsersync.development;

/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync', ['build'], function() {
  browsersync(config);
});
