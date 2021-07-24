const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const DBBaseProvider = require('./base');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const MongooseFinder = require('../lib/MongooseFinder');
const { Post } = require('../schemas');

module.exports = class PostProvider extends DBBaseProvider {
  constructor() {
    super(Post);
  }

  populates() {
    return ['images', 'videos', '-postedBy'];
  }

  /*
  Aggregate
  */
  aggregate({ userObjectId, _id }) {
    const query = [
      { $match: { postedBy: userObjectId } },
      {
        $group: {
          _id,
          sum: {
            $sum: 1,
          },
        },
      },
      { $sort: { sum: -1 } },
    ];
    return super.aggregate(query);
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
      // logger.info(query);
      this.aggregate(query).then((docs) => {
        docs = docs.filter((dp) => !!dp._id);
        return resolve(docs);
      });
    });
  }

  count({ userObjectId, from, to, during, searchWord, filter }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: false,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addDuring(during);
    builder.addSearchWord(searchWord);
    builder.addFilterType(filter);
    return super.count({ $and: builder.condition });
  }

  countAll() {
    const query = {
      $and: [
        {
          postedBy: { $ne: null },
          isArchive: false,
        },
      ],
    };
    return super.count(query);
  }

  // 後で消す
  countAbsoluteAll() {
    const query = {};
    return super.count(query);
  }

  /*
  FIND
  */
  findById({ postObjectId }) {
    logger.info('Post findByID');
    const finder = new MongooseFinder({
      model: Post,
      options: {
        _id: postObjectId,
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
    logger.info('Archive findByIdBeforeAndAfter');
    const current = await this.findById({ userObjectId, postObjectId });
    const next = await new MongooseFinder({
      model: Post,
      options: {
        $and: [
          {
            _id: { $gt: mongoose.Types.ObjectId(postObjectId) },
            postedBy: userObjectId,
            isArchive: false,
          },
        ],
      },
      limit: 1,
      sort: { _id: 1, updatedAt: 1 },
      populates: this.populates(),
    }).findOne();
    const prev = await new MongooseFinder({
      model: Post,
      options: {
        $and: [
          {
            _id: { $lt: mongoose.Types.ObjectId(postObjectId) },
            postedBy: userObjectId,
            isArchive: false,
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

  find({ userObjectId, from, to, searchWord, during, filter, sort, limit, skip }) {
    logger.info('Post find');

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: false,
      },
    ]);
    builder.addSearchWord(searchWord);
    builder.addCreatedAt(from, to);
    builder.addDuring(during);
    builder.addFilterType(filter);
    logger.info('after condition ', builder.condition);

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

  findUnearthByDate({ userObjectId, from, to }) {
    logger.info('Post findUnearthByDate');
    console.time('Post findUnearthByDate');

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: false,
      },
    ]);
    builder.addCreatedAt(from, to);

    const finder = new MongooseFinder({
      model: Post,
      options: { $and: builder.condition },
      sort: { updatedAt: -1 },
      populates: this.populates(),
    });
    return finder.find();
  }

  /*
  UPDATE, UPSERT
  */
  // For save to ona it later
  // ChromeExtension側から、postの_idが分からないので、これ
  upsert({ userObjectId, post }) {
    const query = {
      $and: [
        {
          type: post.type,
          url: post.url,
          siteUrl: post.siteUrl,
          postedBy: userObjectId,
        },
      ],
    };
    const data = Object.assign(
      {
        createdAt: Date.now(),
      },
      post,
      {
        updatedAt: Date.now(),
      }
    );
    const options = { upsert: true };
    return super.update(query, data, options);
  }

  // シェルスクリプト用
  upsertWithoutRenewUpdatedAt({ userObjectId, post }) {
    const query = {
      $and: [
        {
          type: post.type,
          url: post.url,
          siteUrl: post.siteUrl,
          postedBy: userObjectId,
        },
      ],
    };
    const data = post;
    const options = { upsert: true, returnNewDocument: true };
    return super.findOneAndUpdate(query, data, options);
  }

  /**
   * InboxからArchiveに更新するときとか、FindからInboxに登録するときとか
   * だから、createdAtはObject.assignで融合しない。
   * @param {*} params
   */
  upsertById({ userObjectId, post }) {
    const query = {
      $and: [
        {
          _id: post.postObjectId,
          postedBy: userObjectId,
        },
      ],
    };
    const data = Object.assign({}, post, {
      updatedAt: Date.now(),
    });
    const options = { upsert: true };
    return super.update(query, data, options);
  }

  /*
  REMOVE
  */
  remove({ postObjectId }) {
    const query = { _id: postObjectId };
    return super.remove(query);
  }

  findAll({ condition, limit, skip, sort }) {
    const finder = new MongooseFinder({
      model: Post,
      options: condition,
      limit,
      skip,
      populates: this.populates(),
    });
    return finder.find();
  }

  findPopularPost(params) {
    logger.info('Post findPopularPost');
    logger.info(params);

    // JSTに変換するためにここでのformatはHH:mm:ssを含める。
    const from = moment(params.date).format();
    const to = moment(params.date).add(1, params.term).format();

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: null,
        isArchive: false,
        description: params.term,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addFilterType(params.filter);

    const sort = QueryPropertyTypeGetter.getSortType(params.sort);

    const finder = new MongooseFinder({
      model: Post,
      options: { $and: builder.condition },
      limit: params.limit,
      skip: params.skip,
      sort,
      populates: [
        'images',
        ['postedBy', '-accessToken'], // FIXME: objectのほうがいい？
      ],
    });
    return finder.find();
  }
};
