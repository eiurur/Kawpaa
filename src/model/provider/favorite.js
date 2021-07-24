const mongoose = require('mongoose');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { Schema } = mongoose;
const { ObjectId } = Schema;
const DonePostProvider = require('./donePost');
const DoneHistoryProvider = require('./doneHistory');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const MongooseFinder = require('../lib/MongooseFinder');
const { DonePost } = require('../schemas');

/*
 * CAUTION: findのみDoneProviderから分離。upsertやremoveはDoneProviderに記述されている。
 */
module.exports = class FavoriteProvider extends DonePostProvider {
  constructor() {
    super(DonePost);
  }

  /**
   * 20180604 とりあえず固定
   */
  populates() {
    return ['images', 'videos', '-postedBy', '-originPostedBy'];
  }

  count({ userObjectId, from, to, during, searchWord, filter }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        favorited: true,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addDuring(during);
    builder.addSearchWord(searchWord);
    builder.addFilterType(filter);
    return super.count({ $and: builder.condition });
  }

  async findUnearthByDate({ userObjectId, from, to }) {
    const doneHistory = new DoneHistoryProvider();
    const documents = await doneHistory.findUnearthByDate({
      userObjectId,
      from,
      to,
    });
    console.log(documents);
    return documents.filter((document) => document.donePost.favorited);
  }

  find({ userObjectId, searchWord, filter, during, sort, limit, skip }) {
    console.time('DonePost findFavorite');

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        favorited: true,
      },
    ]);
    builder.addSearchWord(searchWord);
    builder.addFilterType(filter);
    builder.addDuring(during);

    sort = QueryPropertyTypeGetter.getSortType(sort);

    const finder = new MongooseFinder({
      model: DonePost,
      options: { $and: builder.condition },
      limit,
      skip,
      sort,
      populates: this.populates(),
    });
    return finder.find();
  }
};
