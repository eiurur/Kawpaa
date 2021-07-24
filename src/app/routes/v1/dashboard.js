const path = require('path');

const { auth, logging, parameters } = require(path.resolve(
  'build',
  'app',
  'routes',
  'middlewares',
));
const { DashboardController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  // GET
  app.get(
    '/api/dashboard',
    [auth.getUser, parameters.getParameters, logging.log],
    DashboardController.find,
  );
};
