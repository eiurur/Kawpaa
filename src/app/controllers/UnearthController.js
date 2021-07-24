const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { UnearthService } = require(path.resolve('build', 'app', 'services'));

module.exports = class UnearthController {
  static find(req, res) {
    const condition = UnearthService.Condition(req.params);
    return seaquencer(req, res, UnearthService.find(req.params.type, condition));
  }
};
