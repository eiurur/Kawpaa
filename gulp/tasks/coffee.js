/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path    = require('path');
const gulp    = require('gulp');
const $       = (require('gulp-load-plugins'))();
const config  = require('../config').coffee;
const optFile = path.resolve('config.json');

// coffee (src)
gulp.task('coffee', () => gulp.src(config.src, {base: 'build'})
  .pipe($.plumber())
  .pipe($.cached('coffee'))
  .pipe($.coffeelint({optFile}))
  .pipe($.coffeelint.reporter())
  .pipe($.coffee())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('coffee task complete')));