/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('../config').rev;

gulp.task('rev', f =>
  gulp
    .src(config.src)
    .pipe($.rev())
    .pipe(gulp.dest(config.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.dest)));
