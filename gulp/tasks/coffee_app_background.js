/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path    = require('path');
const gulp    = require('gulp');
const $       = (require('gulp-load-plugins'))();
const config  = require('../config').coffee_app_background;
const optFile = path.resolve('config.json');

// coffee_app_background (src)
gulp.task('coffee_app_background', () => gulp.src(config.src)
  .pipe($.plumber())
  .pipe($.cached('coffee_app_background'))
  .pipe($.coffeelint({optFile}))
  .pipe($.coffeelint.reporter())
  .pipe($.coffee())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('coffee_app_background task complete')));