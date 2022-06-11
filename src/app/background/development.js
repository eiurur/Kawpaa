const path = require('path');
const morgan = require('morgan');

require('dotenv').config();

const { logger } = require(path.resolve('logger'));

module.exports = function (app) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.on('unhandledRejection', console.dir);
  app.locals.pretty = true;
  app.use(morgan('dev'));
  logger.debug(process.env);

  return app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
      message: err.message,
      error: err,
    });
  });
};
