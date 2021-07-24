const moment = require('moment');
const mongoose = require('mongoose');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const Schema = mongoose.Schema;
const DBBaseProvider = require('./base');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const { DoneHistory } = require('../schemas');
const MongooseFinder = require('../lib/MongooseFinder');

module.exports = class DoneHistoryProvider extends DBBaseProvider {
  constructor() {
    super(DoneHistory);
  }

  /**
   * 20180604 とりあえず固定
   */
  populates() {
    return [
      {
        path: 'donePost',
        model: 'DonePost',
        populate: { path: 'images', model: 'Image' },
      },
      {
        path: 'donePost',
        model: 'DonePost',
        populate: { path: 'videos', model: 'Video' },
      },
      ['-postedBy'],
      ['-originPostedBy'],
    ];
  }

  /*
  Aggregate
  */
  aggregateByYear({ userObjectId, begin, end, _id }) {
    return new Promise((resolve, reject) => {
      const query = [
        {
          $match: {
            originPostedBy: mongoose.Types.ObjectId(userObjectId),
            createdAt: {
              $gte: begin,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id, // CAUTION: 渡す_idはdoneHistoryの_idではなく$donePostなので注意。
            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { count: -1 } },
      ];
      this.aggregate(query).then((donePosts) => {
        // 以下はthis.populates()で置換すると/Stats上で画像が取れずローディングのままになるので置換不可。
        const opts = [
          {
            path: '_id',
            model: 'DonePost',
            populate: { path: 'images', model: 'Image' },
          },
          {
            path: 'donePost',
            model: 'DonePost',
            populate: { path: 'videos', model: 'Video' },
          },
        ];
        DoneHistory.populate(donePosts, opts, (err, results) => {
          // donePostがnullのときが存在する。それを除去。
          results = results.filter((dp) => !!dp._id);
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    });
  }

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
        // 以下はthis.populates()で置換すると/Stats上で画像が取れずローディングのままになるので置換不可。
        const opts = [
          {
            path: '_id',
            model: 'DonePost',
            populate: { path: 'images', model: 'Image' },
          },
          {
            path: 'donePost',
            model: 'DonePost',
            populate: { path: 'videos', model: 'Video' },
          },
        ];
        DoneHistory.populate(donePosts, opts, (err, results) => {
          // donePostがnullのときが存在する。それを除去。
          results = results.filter((dp) => !!dp._id);
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    });
  }

  /**
   *
   * @param {*}
   */
  countByDays({ userObjectId, begin, end }) {
    const query = [
      {
        $match: {
          originPostedBy: mongoose.Types.ObjectId(userObjectId),
          createdAt: {
            $gte: begin,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            yyyy: { $year: '$createdAt' },
            mm: { $month: '$createdAt' },
            dd: { $dayOfMonth: '$createdAt' },
          },
          datetime: { $first: '$createdAt' },
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { createdAt: 1 } },
    ];
    return this.aggregate(query);
  }

  countByYear({ userObjectId, begin, end }) {
    const query = {
      originPostedBy: mongoose.Types.ObjectId(userObjectId),
      createdAt: {
        $gte: begin,
        $lt: end,
      },
    };
    return this.count(query);
  }

  countAll() {
    const query = {};
    return super.count(query);
  }

  /*
  FIND
  */
  findById({ postObjectId, donePost }) {
    logger.info('DoneHistory findById');

    const finder = new MongooseFinder({
      model: DoneHistory,
      options: {
        _id: postObjectId,
        postedBy: donePost.postedBy,
      },
      populates: this.populates(),
    });
    return finder.findOne();
  }

  // 特定の投稿に紐づく履歴情報を取得
  findPairsByDonePostObjectID({ userObjectId, postObjectId }) {
    return new Promise((resolve, reject) => {
      logger.info('DoneHistory findPairsByDonePostObjectID');

      const condition = [
        {
          postedBy: userObjectId,
          donePost: postObjectId,
        },
      ];

      const finder = new MongooseFinder({
        model: DoneHistory,
        options: {
          $and: condition,
        },
        sort: { createdAt: -1 },
        populates: this.populates(),
      });
      return finder.find().then((documents) => {
        const promises = documents.map((_document) => {
          const begin = moment(new Date(_document.createdAt)).subtract(5, 'minutes');
          const end = moment(new Date(_document.createdAt)).add(5, 'minutes');
          const _condition = {
            userObjectId: _document.postedBy,
            begin,
            end,
          };
          return this.findNearlyHistory(_condition);
        });
        Promise.all(promises).then((_documents) => resolve(_documents));
      });
    });
  }

  findNearlyHistory({ userObjectId, begin, end }) {
    logger.info('DoneHistory findNearlyHistory');

    const condition = [
      {
        postedBy: userObjectId,
        createdAt: {
          $gte: begin,
          $lt: end,
        },
      },
    ];

    const finder = new MongooseFinder({
      model: DoneHistory,
      options: { $and: condition },
      sort: { createdAt: -1 },
      populates: this.populates(),
    });
    return finder.find();
  }

  findLatestByDonePostObjectID({ donePostObjectId }) {
    logger.info('DoneHistory findLatestByDonePostObjectID');

    const finder = new MongooseFinder({
      model: DoneHistory,
      options: { donePost: donePostObjectId },
      sort: { createdAt: -1 },
      populates: this.populates(),
    });
    return finder.findOne();
  }

  find({ userObjectId, date, limit, skip }) {
    logger.info('DoneHistory find');

    const builder = new PostConditionBuilder();
    builder.buildCondition([{ postedBy: userObjectId }]);
    if (date) builder.addDuring(date, 'day');
    console.log(builder.condition);

    const finder = new MongooseFinder({
      model: DoneHistory,
      options: { $and: builder.condition },
      limit,
      skip,
      sort: { createdAt: -1 },
      populates: this.populates(),
    });
    return finder.find();
  }

  findUnearthByDate({ userObjectId, from, to }) {
    logger.info('DoneHistory findUnearthByDate');

    const condition = [
      {
        postedBy: userObjectId,
        createdAt: {
          $gte: from,
          $lt: to,
        },
      },
    ];

    const finder = new MongooseFinder({
      model: DoneHistory,
      options: {
        $and: condition,
      },
      sort: { createdAt: -1 },
      populates: this.populates(),
    });
    return finder.find();
  }

  /*
  SAVE
  */
  save({ doneHistory }) {
    const data = new DoneHistory(doneHistory);
    data.createdAt = Date.now();
    data.updatedAt = Date.now();
    return super.save(data);
  }

  upsertWithoutRenewUpdatedAt({ userObjectId, doneHistory }) {
    const query = {
      $and: [
        {
          donePost: doneHistory.donePost,
          createdAt: doneHistory.createdAt,
          postedBy: userObjectId,
        },
      ],
    };
    const data = doneHistory;
    const options = { upsert: true, returnNewDocument: true };
    return super.findOneAndUpdate(query, data, options);
  }

  /*
  REMOVE
  */
  removeById({ doneHistoryObjectId }) {
    const query = { _id: doneHistoryObjectId };
    return this.remove(query);
  }

  removeByDonePostObjectId({ donePostObjectId }) {
    const query = { donePost: donePostObjectId };
    return this.remove(query);
  }
};
