/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp   = require('gulp');
const $      = (require('gulp-load-plugins'))();
const config = require('../config').images_copy;

// images copy
gulp.task('images_copy', () => gulp.src(config.src)
  .pipe($.plumber())
  .pipe($.changed(config.dest))
  .pipe($.imagemin())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('images task complete')));