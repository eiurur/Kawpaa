const path = require('path');

const { auth, logging, parameters } = require(path.resolve(
  'build',
  'app',
  'routes',
  'middlewares',
));
const { StatsController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  /**
   * Ref: http://expressjs.com/ja/api.html#app.param
   */
  app.param((param, validator) => (req, res, next, val) => {
    if (validator(val)) {
      next();
    } else {
      res.status(400).json({ statusCode: 400, message: 'year is required number type' });
    }
  });

  /**
   * yearに数字だけを許容する制約を設ける
   * Ref: http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
   */
  app.param('year', candidate => !isNaN(parseFloat(candidate)) && isFinite(candidate));

  /**
   * 年間の抜いたランキングデータ(トップのみ)を返す
   * @return
   */
  app.get('/api/stats/ranking/heads', [auth.getUser, logging.log], StatsController.heads);

  /**
   * 年間の抜いたランキングデータを算出して返す。使用率を出すため、集計データのほかに合計数も合わせて取得する。
   * @param {String} year - 対象年
   * @return
   */
  app.get('/api/stats/ranking/:year', [auth.getUser, logging.log], StatsController.ranking);

  /**
   */
  app.get(
    '/api/stats/count/days',
    [auth.getUser, parameters.getParameters, logging.log],
    StatsController.countByDays,
  );
};
