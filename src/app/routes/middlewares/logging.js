const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');

const { logger } = require(path.resolve('logger'));

module.exports = {
  log(req, res, next) {
    if (!_.isEmpty(req.query)) {
      logger.info(chalk.bgYellow('req.query ====> '));
      logger.info(req.query);
    }
    if (!_.isEmpty(req.params)) {
      logger.info(chalk.bgBlue('req.params ====> '));
      logger.info(req.params);
    }
    if (!_.isEmpty(req.body)) {
      logger.info(chalk.bgMagenta('req.body ====> '));
      logger.info(req.body);
    }
    return next();
  },
};
