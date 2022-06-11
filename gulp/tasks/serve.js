const gulp = require('gulp');
const node = require('node-dev');
const config = require('../config').serve;

gulp.task('serve', (done) => {
  const serverPath = `${config.dest}/app.js`;
  node(serverPath, [], [], { ignore: [] });
  done();
});
