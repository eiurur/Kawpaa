const path = require('path');

const { auth, logging, parameters } = require(path.resolve('build', 'app', 'routes', 'middlewares'));
const { ConvertController, PostController, RecommendController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  app.get('/api/convert/tweet/:tweetId', [parameters.getParameters, logging.log], ConvertController.convertTweetIdToTweetInfo);

  app.get('/api/posts/:type/count/all', [parameters.getParameters, logging.log], PostController.countAll);

  app.post('/api/posts', [auth.checkRegistrable, parameters.getParameters, logging.log], PostController.register);

  app.get('/api/recommends', [parameters.getParameters, logging.log], RecommendController.find);
};
