const path = require('path');

const { auth, logging, parameters } = require(path.resolve('build', 'app', 'routes', 'middlewares'));
const { DoneController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  app.get('/api/dones/pairs/:postObjectId', [auth.getUser, parameters.getParameters, logging.log], DoneController.findPairs);

  /**
   * 自分が投稿した画像を抜いたとき、inboxまたは。Archiveにある画像は消す。
   * 他のユーザが投稿した画像を抜いたとき、消す必要はない。
   */
  app.post('/api/dones', [auth.getUser, parameters.getParameters, logging.log], DoneController.upsert);

  /**
   * 抜いた数の更新
   * TODO: PUTで統一すべきでは？動作をURIには含めない
   */
  app.put('/api/dones/flucate', [auth.getUser, parameters.getParameters, logging.log], DoneController.flucate);
};
