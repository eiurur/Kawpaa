require('./loadTaskAll');
const gulp = require('gulp');

const bower_angularjs = require('./bower_angularjs');
const bower_JS = require('./bower_JS');
const bower_css = require('./bower_css');
const bower_font = require('./bower_font');
const server_js_copy = require('./server_js_copy');
const coffee_app_public = require('./coffee_app_public');
const sass = require('./sass');
const jade_copy = require('./jade_copy');
const images_copy = require('./images_copy');
const rev = require('./rev');
const rev_replace = require('./rev_replace');

gulp.task(
  'build',
  gulp.series(
    'clean',
    'bower_angularjs',
    'bower_js',
    'bower_css',
    'bower_font',
    'server_js_copy',
    'coffee_app_public',
    'sass',
    'jade_copy',
    'images_copy',
    'rev',
    'rev_replace',
  ),
);
