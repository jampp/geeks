var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

// var gulp         = require('gulp'),
//     sass         = require('gulp-sass'),
//     autoprefixer = require('gulp-autoprefixer'),
//     minifycss    = require('gulp-minify-css'),
//     jshint       = require('gulp-jshint'),
//     uglify       = require('gulp-uglify'),
//     rename       = require('gulp-rename'),
//     clean        = require('gulp-clean'),
//     concat       = require('gulp-concat'),
//     notify       = require('gulp-notify'),
//     cache        = require('gulp-cache'),
//     plumber      = require('gulp-plumber'),
//     browserSync  = require('browser-sync'),
//     del          = require('del'),
//     imagemin     = require('gulp-imagemin'),
//     htmlmin      = require('gulp-htmlmin'),
//     runSequence  = require('run-sequence'),
//     changed      = require('gulp-changed'),
//     gulpFilter   = require('gulp-filter'),
//     sourcemaps   = require('gulp-sourcemaps'),
//     cp           = require('child_process');
//
//
// // gulp.task('sass', function() {
// //   return gulp.src('_src/_sass/**/*.sass')
// //     .pipe(sass({
// //       includePaths: ['sass'],
// //       onError: browserSync.notify
// //     }))
// //     .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
// //       cascade: true
// //     }))
// //     .pipe(gulp.dest('site/css'))
// //     .pipe(browserSync.reload({
// //       stream: true
// //     }))
// //     .pipe(gulp.dest('site/css'));
// // });
//
//
// gulp.task('sass', function () {
//     // Don't write Sourcemaps of Sourcemaps
//     var filter = gulpFilter(['*.css', '!*.map'], {restore: true});
//       return gulp.src('_src/_sass/**/*.sass')
//         .pipe(sass({
//           includePaths: ['sass'],
//           onError: browserSync.notify
//         }))
//         .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
//           cascade: true
//         }))
//         .pipe(filter) // Don't write Sourcemaps of Sourcemaps
//         .pipe(sourcemaps.write())
//         .pipe(filter.restore) // Recreate original files
//         .pipe(gulp.dest('site/css'))
//         .pipe(browserSync.reload({stream:true}))
//
// });
//
//
//
// // Delete assets in `site`
// gulp.task('delAssetsSite', function(cb) {
//     del([
//         'site/assets/**/*'
//     ], cb);
// });
//
// // Delete assets in `site` and `_assets/**/`
// gulp.task('delassets', ['delAssetsSite'], function() {
//     del([
//         '_src/_assets/**/*.*'
//     ], cb);
// });
//
//
// // Optimize images
// gulp.task('img', function () {
//     return gulp.src(['_src/_assets/images/*.*'])
//         .pipe(changed('site/assets/images'))
//         .pipe(imagemin())
//         .pipe(gulp.dest('site/assets/images'))
//         .pipe(browserSync.reload({stream:true}));
// });
//
//
// // gulp.task('js', function() {
// //   return gulp.src('_javascripts/app.js')
// //     // .pipe(jshint())
// //     // .pipe(jshint.reporter('default'))
// //     .pipe(concat('app.js'))
// //     .pipe(gulp.dest('javascripts'))
// //     .pipe(rename({
// //       suffix: '.min'
// //     }))
// //     .pipe(uglify())
// //     .pipe(gulp.dest('javascripts'))
// //     .pipe(gulp.dest('_site/javascripts'))
// //     .pi pe(notify({
// //       message: 'Scripts task complete'
// //     }));
// // });
//
//
// // =====================================
// // Minify HTML Task
// // =====================================
// gulp.task('minify', function() {
//   return gulp.src('site/**/*.html')
//     .pipe(htmlmin({
//         collapseWhitespace: true,
//         removeComments: true,
//         minifyJS: true
//     }))
//     .pipe(gulp.dest('site'))
// });
//
// /**
//  * Build the Jekyll Site
//  */
// gulp.task('jekyll-build', function(done) {
//   browserSync.notify('Building Jekyll');
//   return cp.spawn('jekyll', ['build'], {
//       stdio: 'inherit'
//     })
//     .on('close', done);
// });
//
// gulp.task('build', function(callback) {
//     runSequence('jekyll-build', ['sass', 'delAssetsSite', 'img', 'minify']);
// });
//
// /**
//  * Rebuild Jekyll & do page reload
//  */
// gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
//   browserSync.reload();
//   runSequence('sass', ['jekyll-build', 'img']);
// });
//
// /**
//  * Wait for jekyll-build, then launch the Server
//  */
// gulp.task('browser-sync', ['jekyll-build'], function() {
//   browserSync({
//     server: {
//       baseDir: 'site'
//     },
//     host: "localhost",
//     ghostMode: true
//   });
// });
//
// gulp.task('watch', function() {
//   // Watch .scss/sass files
//   gulp.watch('_src/_sass/**/*.sass', ['sass']);
//   // Watch .js files
//   gulp.watch('_src/_javascripts/*.js');
//   // Watch config file
//   gulp.watch('_config.yml', ['jekyll-rebuild']);
//   // Watch data files
//   gulp.watch('_src/_src/_data/**/*.yml', ['jekyll-rebuild']);
//   // Watch images
//    gulp.watch('_src/_assets/_images/**/*', ['img']);
//   // Watch assets
//   gulp.watch('_src/_assets/_assset/**/*', ['jekyll-rebuild']);
//   // Watch .html files and posts
//   gulp.watch(['_src/**/*.html', '_src/_includes/*', '_src/_posts/*', '*.md'], ['jekyll-rebuild']);
// });
//
// gulp.task('default', function() {
//   runSequence('jekyll-build', ['sass', 'img', 'browser-sync'], 'watch');
//
// });
