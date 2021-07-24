const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { DashboardService } = require(path.resolve('build', 'app', 'services'));

module.exports = class DashboardController {
  static find(req, res) {
    const condition = DashboardService.Condition(req.params);
    return seaquencer(req, res, DashboardService.find(condition));
  }
};
