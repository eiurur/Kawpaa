const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DoneHistorySchema = new Schema({
  donePost: {
    type: ObjectId,
    ref: 'DonePost',
    index: true,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
    index: true,
  },
  originPostedBy: {
    type: ObjectId,
    ref: 'User',
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model('DoneHistory', DoneHistorySchema);

const DoneHistory = mongoose.model('DoneHistory');

module.exports = DoneHistory;
