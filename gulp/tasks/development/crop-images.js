var gulp = require('gulp'),
  imageresize = require('gulp-image-resize'),
  config = require('../../config').crop;


gulp.task('crop-image-small', function() {
  return gulp.src(config.src)
    .pipe(imageresize({
      width: 320,
      height: 284,
      crop: true
    }))

  .pipe(gulp.dest(config.dest + '/featured-images-posts/small'))
});


gulp.task('crop-images', ['crop-image-small'], function() {
  return gulp.src(config.src)
    .pipe(imageresize({
      width: 780,
      height: 293,
      crop: true
    }))
    .pipe(gulp.dest(config.dest + '/featured-images-posts/medium'))
});
