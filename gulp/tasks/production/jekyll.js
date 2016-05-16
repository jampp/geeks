var gulp        = require('gulp'),
    cp          = require('child_process'),
    browsersync = require('browser-sync'),
    config      = require('../../config').jekyll.production;
	argv		= require('yargs').argv;


if(argv.production) config = require('../../config').jekyll.staging;

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll:production', function(done) {
  browsersync.notify('Compiling Jekyll (Production)');

  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '-q', '--source=' + config.src, '--destination=' + config.dest, '--config=' + config.config], { stdio: 'inherit' })
  .on('close', done);
});
