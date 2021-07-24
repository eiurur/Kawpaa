const mongoose = require('mongoose');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { Schema } = mongoose;
const { ObjectId } = Schema;
const DBBaseProvider = require('./base');
const DoneHistoryProvider = require('./doneHistory');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const MongooseFinder = require('../lib/MongooseFinder');
const { DonePost } = require('../schemas');

module.exports = class DonePostProvider extends DBBaseProvider {
  constructor() {
    super(DonePost);
  }

  /**
   * 20180604 とりあえず固定
   */
  populates() {
    return ['images', 'videos', '-postedBy', '-originPostedBy'];
  }

  /**
   *
   * @param {*} param0
   */
  aggregateByHostName({ begin, end, _id }) {
    return new Promise((resolve, reject) => {
      const query = [
        {
          $match: {
            createdAt: {
              $gte: begin,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id,
            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { count: -1 } },
      ];
      this.aggregate(query).then((donePosts) => {
        donePosts = donePosts.filter((dp) => !!dp._id);
        return resolve(donePosts);
      });
    });
  }

  count({ userObjectId, from, to, during, searchWord, filter }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addDuring(during);
    builder.addSearchWord(searchWord);
    builder.addFilterType(filter);
    return super.count({ $and: builder.condition });
  }

  countAll() {
    const query = {};
    return super.count(query);
  }

  /*
  FIND
  */
  find({ userObjectId, searchWord, filter, during, sort, limit, skip }) {
    logger.info('DonePost find');
    console.time('DonePost find');

    const builder = new PostConditionBuilder();
    builder.buildCondition([{ postedBy: userObjectId }]);
    builder.addSearchWord(searchWord);
    builder.addFilterType(filter);
    builder.addDuring(during, 'year');

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

  findById({ userObjectId, postObjectId }) {
    const finder = new MongooseFinder({
      model: DonePost,
      options: {
        _id: postObjectId,
        postedBy: userObjectId,
      },
      populates: this.populates(),
    });
    return finder.findOne();
  }

  /**
   * 指定したIDとその前後count件のpostを返す
   * @param {*} param0
   */
  async findByIdBeforeAndAfter({ userObjectId, postObjectId, limit }) {
    const current = await this.findById({ userObjectId, postObjectId });
    const next = await new MongooseFinder({
      model: DonePost,
      options: {
        $and: [
          {
            _id: { $gt: mongoose.Types.ObjectId(postObjectId) },
            postedBy: userObjectId,
          },
        ],
      },
      limit: 1,
      sort: { _id: 1, updatedAt: 1 },
      populates: this.populates(),
    }).findOne();
    const prev = await new MongooseFinder({
      model: DonePost,
      options: {
        $and: [
          {
            _id: { $lt: mongoose.Types.ObjectId(postObjectId) },
            postedBy: userObjectId,
          },
        ],
      },
      limit: 1,
      sort: { _id: -1, updatedAt: -1 },
      populates: this.populates(),
    }).findOne();
    const nextObjext = next !== null ? next.toObject() : null;
    const prevObjext = prev !== null ? prev.toObject() : null;
    return Object.assign(current.toObject(), { next: nextObjext }, { prev: prevObjext });
  }

  findByUrlAndSiteUrlAndPostedBy({ userObjectId, type, url, siteUrl }) {
    const finder = new MongooseFinder({
      model: DonePost,
      options: {
        $and: [
          {
            type,
            url,
            siteUrl,
            postedBy: userObjectId,
          },
        ],
      },
      sort: { updatedAt: -1 },
      populates: this.populates(),
    });
    return finder.findOne();
  }

  async findUnearthByDate({ userObjectId, from, to }) {
    const doneHistory = new DoneHistoryProvider();
    const documents = await doneHistory.findUnearthByDate({
      userObjectId,
      from,
      to,
    });
    return documents;
  }

  findFavorite({ userObjectId, searchWord, filter, during, sort, limit, skip }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        favorited: true,
      },
    ]);
    builder.addSearchWord(new RegExp(searchWord, 'i'));
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

  /*
  SAVE
  */
  save({ donePost }) {
    const data = new DonePost(donePost);
    data.createdAt = Date.now();
    data.updatedAt = Date.now();
    return super.save(data);
  }

  /*
  UPDATE, UPSERT
  */
  // For save to ona it later
  // ChromeExtension側から、postの_idが分からないので、これ
  upsert({ donePost }) {
    const query = {
      $and: [
        {
          type: donePost.type,
          url: donePost.url,
          siteUrl: donePost.siteUrl,
          postedBy: donePost.postedBy,
        },
      ],
    };
    const data = donePost;
    data.updatedAt = Date.now();
    const options = { upsert: true };
    return this.update(query, data, options);
  }

  findOneby({ userObjectId, donePost }) {
    const query = {
      $and: [
        {
          type: donePost.type,
          url: donePost.url,
          siteUrl: donePost.siteUrl,
          postedBy: userObjectId,
        },
      ],
    };
    return super.findOne(query);
  }

  upsertWithoutRenewUpdatedAt({ userObjectId, donePost }) {
    const query = {
      $and: [
        {
          type: donePost.type,
          url: donePost.url,
          siteUrl: donePost.siteUrl,
          postedBy: userObjectId,
        },
      ],
    };
    const data = donePost;
    const options = { upsert: true, returnNewDocument: true };
    return super.findOneAndUpdate(query, data, options);
  }

  updateById({ donePost }) {
    const query = {
      $and: [
        {
          _id: donePost.postObjectId,
          postedBy: donePost.postedBy,
        },
      ],
    };
    const data = donePost;
    const options = {};
    return this.update(query, data, options);
  }

  /*
   * CAUTION: donePostObjectIdではなく、postObjectId
   */
  flucateNumDone({ donePost, increaseNum }) {
    const query = { _id: donePost.postObjectId || donePost._id };
    const data = { $inc: { numDone: increaseNum } };
    data.updatedAt = Date.now();
    const options = { new: true, upsert: true };
    return this.findOneAndUpdate(query, data, options);
  }

  // 使う？
  findByIdAndUpdate({ donePost }) {
    const _id = donePost.postObjectId || donePost._id;
    const data = donePost;
    const options = { new: true, upsert: true };
    return super.findByIdAndUpdate(_id, data, options);
  }

  /*
  REMOVE
  */
  remove({ postObjectId }) {
    const query = { _id: postObjectId };
    return super.remove(query);
  }

  findAll(params) {
    return new Promise((resolve, reject) =>
      // logger.info('DonePost findAll');
      // logger.info(params);
      DonePost.find(params.condition)
        .limit(params.limit)
        .skip(params.skip)
        .populate('images')
        .populate('videos')
        .populate('postedBy', '-accessToken')
        .populate('originPostedBy', '-accessToken')
        .exec((err, posts) => {
          if (err) {
            return reject(err);
          }
          return resolve(posts);
        })
    );
  }
};
