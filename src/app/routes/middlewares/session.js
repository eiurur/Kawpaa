const path = require('path');

const { logger } = require(path.resolve('logger'));

module.exports = function (app) {
  return app.use('/api/?', (req, res, next) => {
    if (typeof req.session.passport.user !== 'undefined') {
      return next();
    }
    logger.info('(#^.^#) invalid request');
    return res.redirect('/');
  });
};
