/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('../config').rev_replace;
const { manifestFileName } = require('../config').rev;

const manifestFile = path.resolve('build', 'app', 'public', 'front', manifestFileName);

const addPrefix = function (manifest, prefix) {
  const o = {};
  for (const k in manifest) {
    const v = manifest[k];
    console.log(k, v);
    o[`${prefix}${k}`] = `${prefix}${v}`;
    console.log(o);
  }
  return o;
};

gulp.task('rev_replace', (f) => {
  console.log(config);
  const manifest = gulp.src(manifestFile);
  return gulp
    .src(config.src)
    .pipe($.revReplace({ manifest, replaceInExtensions: ['.jade', '.js', '.css'] }))
    .pipe(gulp.dest(config.dest));
});
