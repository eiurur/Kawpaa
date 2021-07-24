const path = require('path');

const DatabaseProviderFactory = require(path.resolve(
  'build',
  'model',
  'lib',
  'DatabaseProviderFactory',
));

module.exports = class DoneHistoryService {
  static find(type, condition) {}

  static save(doneHistory) {
    return DatabaseProviderFactory.createProvider('DoneHistory').save({ doneHistory });
  }

  static findLatest(condition) {
    return DatabaseProviderFactory.createProvider('DoneHistory').findLatestByDonePostObjectID(condition);
  }

  static removeLatest(condition) {
    return this.findLatest(condition).then(doneHistory =>
      this.removeById({ doneHistoryObjectId: doneHistory._id }));
  }

  static removeById(condition) {
    return DatabaseProviderFactory.createProvider('DoneHistory').removeById(condition);
  }

  static DoneHistory(donePost) {
    return {
      donePost: donePost._id,
      images: donePost.images,
      postedBy: donePost.postedBy,
      originPostedBy: donePost.originPostedBy,
    };
  }
};
