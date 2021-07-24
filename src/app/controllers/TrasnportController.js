const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { TrasnportService } = require(path.resolve('build', 'app', 'services'));

module.exports = class TrasnportController {
  static export(req, res) {
    const { user } = req.params;
    return seaquencer(req, res, TrasnportService.export({ user }));
  }
  static import(req, res) {
    const { user, record } = req.params;
    return seaquencer(req, res, TrasnportService.import({ user, record }));
  }
};
