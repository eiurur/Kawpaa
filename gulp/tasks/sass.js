/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp   = require('gulp');
const sass   = require('gulp-sass');
// sass   = require 'gulp-ruby-sass'
const $      = (require('gulp-load-plugins'))();
const config = require('../config').sass;

// SASS (src/scss)
gulp.task("sass", () => gulp.src(config.src)
  .pipe($.plumber())
  .pipe(sass({
    outputStyle: "expanded"})).pipe(gulp.dest(config.dest))
  .pipe($.rename({suffix: '.min'}))
  .pipe($.cssmin())
  .pipe(gulp.dest(config.dest))
  .pipe($.gzip())
  .pipe(gulp.dest(config.dest))
  .pipe($.notify('CSS task complete')));
