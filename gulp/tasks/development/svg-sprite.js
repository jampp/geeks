var gulp        = require('gulp'),
    changed     = require('gulp-changed'),
    svgSprite   = require('gulp-svg-sprite'),
    config      = require('../../config').svgSprite;

/**
 * Copy fonts to build folder
 * if not changed
 */
gulp.task('svg-sprite', function() {
  return gulp.src(config.src)
    .pipe(svgSprite(config.config))
    // .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.dest));
});


gulp.task('move-sprite-sass', ['svg-sprite'], function() {
  return gulp.src('_src/_assets/pre-sprites/sass/_sprite.scss')
    .pipe(gulp.dest('_src/_assets/sass/sprites/'));
});


gulp.task('move-sprite', ['move-sprite-sass'], function() {
  return gulp.src('_src/_assets/pre-sprites/images/sprite.svg')
    .pipe(gulp.dest('_src/_assets/images/sprites/'));
});
