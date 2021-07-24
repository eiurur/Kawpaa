/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp   = require('gulp');
const bower  = require('bower');
const $      = (require('gulp-load-plugins'))();
const config = require('../config').bower_js;

gulp.task('bower_js', () => bower.commands.install().on('end', installed => gulp.src(config.src)
  .pipe($.plumber())
  .pipe($.concat('lib.js'))
  .pipe(gulp.dest(config.dest))
  .pipe($.rename({suffix: '.min'}))
  .pipe($.uglify({mangle: false}))
  .pipe(gulp.dest(config.dest))
  .pipe($.gzip())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('Library Scripts task complete'))));
