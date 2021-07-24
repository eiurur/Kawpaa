const path = require('path');

const { auth, logging, parameters } = require(path.resolve('build', 'app', 'routes', 'middlewares'));
const { TrasnportController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  app.get('/api/export', [auth.getUser, parameters.getParameters, logging.log], TrasnportController.export);
  app.post('/api/import', [auth.getUser, parameters.getParameters, logging.log], TrasnportController.import);
};
