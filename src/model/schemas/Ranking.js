// TODO: VIEWに置き換え

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RankingSchema = new Schema({
  date: {
    type: String, // Yearly->2018/2017/2016, Monthly->2018/12, 2018/11
  },
  item: {
    type: String,
  },
  count: {
    type: Number,
  },
  postedBy: {
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

mongoose.model('Ranking', RankingSchema);

const Ranking = mongoose.model('Ranking');

module.exports = Ranking;
