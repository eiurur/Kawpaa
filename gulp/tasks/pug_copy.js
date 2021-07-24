/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp   = require('gulp');
const $      = (require('gulp-load-plugins'))();
const config = require('../config').pug_copy;

// pug copy
gulp.task('pug_copy', () => gulp.src(config.src)
  .pipe($.plumber())
  .pipe($.changed(config.dest))
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('pug_copy task complete')));