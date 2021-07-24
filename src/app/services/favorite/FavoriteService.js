const path = require('path');

const DatabaseProviderFactory = require(path.resolve(
  'build',
  'model',
  'lib',
  'DatabaseProviderFactory',
));

module.exports = class FavoriteService {
  static updateById(condition) {
    return DatabaseProviderFactory.createProvider('Done').updateById({ donePost: condition });
  }

  static Condition({ user, postObjectId, favorited }) {
    return {
      postedBy: user._id,
      postObjectId,
      favorited,
    };
  }
};
