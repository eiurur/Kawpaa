const moment = require('moment');
const mongoose = require('mongoose');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const Schema = mongoose.Schema;
// TODO: VIEWに置き換え

const ObjectId = Schema.ObjectId;
const DBBaseProvider = require('./base');
const { Ranking } = require('../schemas');
const MongooseFinder = require('../lib/MongooseFinder');

module.exports = class RankingProvider extends DBBaseProvider {
  constructor() {
    super(Ranking);
  }

  /*
  FIND
  */
  find({ userObjectId }) {
    const finder = new MongooseFinder({
      model: Ranking,
      options: {
        postedBy: userObjectId,
      },
      sort: { date: -1 },
    });
    return finder.find();
  }

  /*
  SAVE
  */
  upsert({ ranking }) {
    const query = {
      $and: [
        {
          date: ranking.date,
          postedBy: ranking.postedBy,
        },
      ],
    };
    const data = ranking;
    const options = { upsert: true };
    return super.update(query, data, options);
  }

  save({ ranking }) {
    const data = new Ranking(ranking);
    data.createdAt = Date.now();
    data.updatedAt = Date.now();
    return super.save(data);
  }

  /*
  REMOVE
  */
  removeById({ rankingId }) {
    const query = { _id: rankingId };
    return this.remove(query);
  }
};
