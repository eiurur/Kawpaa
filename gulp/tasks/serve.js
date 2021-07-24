const gulp = require('gulp');
const path = require('path');
const node = require('node-dev');
const $ = require('gulp-load-plugins')();
const webserver = require('gulp-webserver');
const config = require('../config').serve;

gulp.task('serve', (done) => {
  const serverPath = `${config.dest}/app.js`;
  node(serverPath, [], [], { ignore: [] });
  done();
});
