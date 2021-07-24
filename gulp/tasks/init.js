const gulp = require('gulp');

gulp.task(
  'init',
  gulp.series(gulp.parallel('clean'), () => console.log('init done')),
);
