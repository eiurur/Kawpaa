const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { FavoriteService } = require(path.resolve('build', 'app', 'services'));

module.exports = class FavoriteController {
  static favorite(req, res) {
    const condition = FavoriteService.Condition({
      user: req.params.user,
      postObjectId: req.params.postObjectId,
      favorited: true,
    });
    return seaquencer(req, res, FavoriteService.updateById(condition));
  }

  static unfavorite(req, res) {
    const condition = FavoriteService.Condition({
      user: req.params.user,
      postObjectId: req.params.postObjectId,
      favorited: false,
    });
    return seaquencer(req, res, FavoriteService.updateById(condition));
  }
};
