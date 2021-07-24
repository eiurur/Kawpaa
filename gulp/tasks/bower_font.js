/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp   = require('gulp');
const bower  = require('bower');
const $      = (require('gulp-load-plugins'))();
const config = require('../config').bower_font;

gulp.task('bower_font', () => bower.commands.install().on('end', installed => gulp.src(config.src)
  .pipe($.plumber())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('fonts task complete'))));