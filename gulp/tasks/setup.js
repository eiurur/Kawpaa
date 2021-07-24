require('./loadTaskAll');
const gulp = require('gulp');

gulp.task(
  'setup',
  gulp.parallel(
    'bower_angularjs',
    'bower_js',
    'bower_css',
    'bower_font',
    'server_js_copy',
    'coffee_app_public',
    'sass',
    'jade_copy',
    'images_copy',
  ),
  () => console.log('setup done'),
);
