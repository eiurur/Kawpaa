const path = require('path');

const { auth, logging, parameters } = require(path.resolve(
  'build',
  'app',
  'routes',
  'middlewares',
));
const { PostController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  // FindのPostをInboxに追加する
  app.post(
    '/api/posts/inbox/:postObjectId',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.toInbox,
  );

  // GET
  app.get('/api/posts', [auth.getUser, parameters.getParameters, logging.log], PostController.find);

  app.get(
    '/api/posts/:type/count',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.count,
  );

  app.get(
    '/api/posts/:type/relative',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.findRelativeImages,
  );

  app.get(
    '/api/posts/:type/:postObjectId',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.findByIdBeforeAndAfter,
  );

  app.put(
    '/api/posts',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.update,
  );

  app.delete(
    '/api/posts/:type/:postObjectId',
    [auth.getUser, parameters.getParameters, logging.log],
    PostController.delete,
  );
};
