/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task(
  'task_rev_replace',

  gulp.series(gulp.parallel('rev', 'rev_replace'), () =>
    console.log('task_rev_replace done'),
  ),
);
