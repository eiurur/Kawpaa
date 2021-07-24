const path = require('path');

const GetRequestParameter = require(path.resolve(
  'build',
  'app',
  'routes',
  'utils',
  'GetRequestParameter',
));

module.exports = {
  getParameters(req, res, next) {
    req.params = GetRequestParameter.parse(req);
    return next();
  },
};
