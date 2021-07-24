const gulp = require('gulp');
const config = require('../config').watch;

gulp.task('watch', function(done) {
  gulp.watch(config.server_js_copy, gulp.task('server_js_copy'));
  gulp.watch(config.coffee_app_public, gulp.task('coffee_app_public'));
  gulp.watch(config.sass, gulp.task('sass'));
  gulp.watch(config.jade_copy, gulp.task('jade_copy'));
  gulp.watch(config.images_copy, gulp.task('images_copy'));
  done();
});
