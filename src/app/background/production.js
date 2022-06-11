const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const { logger } = require(path.resolve('logger'));

module.exports = (app) => {
  // require('newrelic');

  app.locals.pretty = false;

  // Logging (access)
  const FileStreamRotator = require('file-stream-rotator');
  const ACCESS_LOG_DIRECTORY = path.resolve('logs', 'accesslog');

  // ensure log directory exists
  fs.existsSync(ACCESS_LOG_DIRECTORY) || fs.mkdirSync(ACCESS_LOG_DIRECTORY);

  // create a rotating write stream
  const accessLogStream = FileStreamRotator.getStream({
    filename: `${ACCESS_LOG_DIRECTORY}/access-%DATE%.log`,
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYY-MM-DD',
  });

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));
  logger.debug(process.env);
};
