/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const ngAnnotate = require('gulp-ng-annotate');
const config = require('../config').coffee_app_public;

const optFile = path.resolve('config.json');

// coffee (src)
gulp.task('coffee', () =>
  gulp
    .src(config.src)
    .pipe($.plumber())
    .pipe($.coffeelint({ optFile })));

gulp.task('coffee_app_public', () =>
  gulp
    .src(config.src)
    .pipe($.plumber())
    .pipe($.cached('coffee_app_public'))
    // .pipe($.coffeelint({ optFile }))
    // .pipe($.coffeelint.reporter())
    .pipe($.coffee({ bare: true }))
    .pipe($.remember('coffee_app_public'))
    .pipe($.concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.dest))
    .pipe($.stripDebug())
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.uglify())
    .pipe(gulp.dest(config.dest))
    .pipe($.gzip())
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('coffee_app_public task complete')));
