var gulp = require('gulp'),
  s3 = require("gulp-s3"),
  fs = require("fs"),
  config = require('../../config').s3;

gulp.task('deploy', function() {
  aws = JSON.parse(fs.readFileSync('./aws.json'));
  gulp.src(config.src)
    .pipe(s3(aws));
});
