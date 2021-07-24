const path = require('path');

const { DoneHistoryProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class DoneHistoryRepository extends DoneHistoryProvider {
  constructor(doneHistory) {
    if (doneHistory == null) {
      doneHistory = {};
    }
    super(...arguments);
    this.doneHistory = doneHistory;
  }

  setDoneHistory(doneHistory) {
    return (this.doneHistory = doneHistory);
  }

  getDoneHistory(doneHistory) {
    return this.doneHistory;
  }

  setDonePostObjectId(donePostObjectId) {
    return (this.donePostObjectId = donePostObjectId);
  }

  getDonePostObjectId() {
    return this.donePostObjectId;
  }

  __save() {
    return this.save({ doneHistory: this.doneHistory });
  }

  __removeById() {
    return this.removeById({ doneHistoryObjectId: this.doneHistory._id });
  }

  __removeByDonePostObjectId() {
    return this.removeByDonePostObjectId({ donePostObjectId: this.donePostObjectId });
  }

  __findLatestByDonePostObjectID() {
    return this.findLatestByDonePostObjectID({ donePostObjectId: this.donePostObjectId });
  }
};
