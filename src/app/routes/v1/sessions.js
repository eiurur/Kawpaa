const path = require('path');

const { SessionController } = require(path.resolve('build', 'app', 'controllers'));

module.exports = (app) => {
  app.get('/api/sessions', SessionController.get);
};
