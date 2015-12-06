var gulp   = require('gulp'),
    config = require('../../config').watch;

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', ['browsersync'], function() {
  gulp.watch(config.jekyll,  ['jekyll-rebuild']);
  gulp.watch(config.styles,  ['styles']);
  gulp.watch(config.scripts, ['scripts', 'jshint']);
  gulp.watch(config.images,  ['images']);
  gulp.watch(config.fonts,  ['fonts']);
  gulp.watch(config.crop,  ['crop-images']);
  gulp.watch(config.sprite,  ['move-sprite']);
});
