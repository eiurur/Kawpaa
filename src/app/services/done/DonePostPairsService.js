const path = require('path');

const DatabaseProviderFactory = require(path.resolve(
  'build',
  'model',
  'lib',
  'DatabaseProviderFactory',
));

module.exports = class DonePostPairsService {
  static find(condition) {
    // 該ポストと一緒に抜いた履歴、
    return DatabaseProviderFactory.createProvider('DoneHistory').findPairsByDonePostObjectID(condition);
  }

  static Condition({ user, postObjectId }) {
    return {
      userObjectId: user._id, // 危険では？ auth.getUserして
      postObjectId,
    };
  }
};
