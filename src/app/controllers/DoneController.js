const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { DonePostService, DonePostPairsService } = require(path.resolve('build', 'app', 'services'));

module.exports = class PostController {
  static findPairs(req, res) {
    const condition = DonePostPairsService.Condition(req.params);
    return seaquencer(req, res, DonePostPairsService.find(condition));
  }

  static upsert(req, res) {
    return seaquencer(req, res, DonePostService.upsert(req.params));
  }

  static flucate(req, res) {
    return seaquencer(req, res, DonePostService.fluctuate(req.params));
  }
};
