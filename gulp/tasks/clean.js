/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const rimraf = require('rimraf');
const config = require('../config').clean;

gulp.task('clean', (cb) => rimraf(config.target, cb));
// gulp.task('clean', async (done) => {
//   try {
//     await del(config.targets.concat(config.excludes));
//   }
//   catch(e){
//     console.log(e)
//   }
//   done();
// });
