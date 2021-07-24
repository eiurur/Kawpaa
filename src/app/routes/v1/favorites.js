const path = require('path');

const { auth, logging, parameters } = require(path.resolve(
  'build',
  'app',
  'routes',
  'middlewares',
));
const { FavoriteController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  app.post(
    '/api/favorites/:postObjectId',
    [auth.getUser, parameters.getParameters, logging.log],
    FavoriteController.favorite,
  );

  app.delete(
    '/api/favorites/:postObjectId',
    [auth.getUser, parameters.getParameters, logging.log],
    FavoriteController.unfavorite,
  );
};
