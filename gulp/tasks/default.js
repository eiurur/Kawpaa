const gulp = require('gulp');
const watch = require('./watch');
const serve = require('./serve');

gulp.task('default', gulp.parallel('watch', 'serve'));
