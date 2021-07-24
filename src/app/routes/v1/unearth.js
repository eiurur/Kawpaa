const path = require('path');

const { auth, logging, parameters } = require(path.resolve(
  'build',
  'app',
  'routes',
  'middlewares',
));
const { UnearthController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  /**
   * 投稿の種類と期間を指定して返す。
   * @param {String} type - 投稿の種類。 inbox|archive|done
   * @param {String} amount - 遡る月数。1なら1ヶ月前、12なら1年前。
   */
  app.get(
    '/api/unearth/:type/:amount?',
    [auth.getUser, parameters.getParameters, logging.log],
    UnearthController.find,
  );
};
