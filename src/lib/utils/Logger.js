const fs = require('fs');
const fx = require('mkdir-recursive');
const path = require('path');
const bunyan = require('bunyan');

const CONSOLE_LOG_DIRECTORY = path.resolve('logs', 'consolelog');

module.exports = {
  activate: (env) => {
    switch ((env || process.env.NODE_ENV || '').toLowerCase()) {
      case 'production':
        fs.existsSync(CONSOLE_LOG_DIRECTORY) || fx.mkdirSync(CONSOLE_LOG_DIRECTORY);

        var log = bunyan.createLogger({
          name: 'kawpaa.production',
          streams: [
            {
              level: 'info',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/info.log`,
              period: '1d',
              count: 100000000,
            },
            {
              level: 'error',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/error.log`,
              period: '1d',
              count: 100000000,
            },
          ],
        });

        global.logger = log;
        break;

      case 'development':
        fs.existsSync(CONSOLE_LOG_DIRECTORY) || fx.mkdirSync(CONSOLE_LOG_DIRECTORY);

        var log = bunyan.createLogger({
          name: 'kawpaa.development',
          streams: [
            {
              level: 'info',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/info.log`,
              period: '1d',
              count: 100000000,
            },
            {
              level: 'error',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/error.log`,
              period: '1d',
              count: 100000000,
            },
          ],
        });
        global.logger = log;
        break;
      default:
        global.logger = {
          info: console.log,
          error: console.error,
        };
    }
  },
};
