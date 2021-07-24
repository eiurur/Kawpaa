const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DBBaseProvider = require('./base');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const MongooseFinder = require('../lib/MongooseFinder');
const { Post } = require('../schemas');

/**
 * CAUTION: findのみPostProviderから分離。upsertやremoveはPostProviderに記述されている。
 */
module.exports = class PopularProvider extends DBBaseProvider {
  constructor() {
    super(Post);
  }

  /**
   * 20180604 とりあえず固定
   */
  populates() {
    return ['images', 'videos', '-postedBy'];
  }

  /**
   * populaar postのルール：postedBy === null
   * @param {} params
   */
  find({ date, term, filter, sort, limit, skip }) {
    // JSTに変換するためにここでのformatはHH:mm:ssを含める。
    const from = moment(date).format();
    const to = moment(date).add(1, term).format();

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: null,
        isArchive: false,
        description: term,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addFilterType(filter);

    sort = QueryPropertyTypeGetter.getSortType(sort);

    const finder = new MongooseFinder({
      model: Post,
      options: { $and: builder.condition },
      limit,
      skip,
      sort,
      populates: this.populates(),
    });
    return finder.find();
  }

  // あとで使う
  findById({ postObjectId }) {
    const finder = new MongooseFinder({
      model: Post,
      options: {
        _id: postObjectId,
        postedBy: null,
      },
      populates: this.populates(),
    });
    return finder.findOne();
  }
};
