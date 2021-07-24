const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const DBBaseProvider = require('./base');
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const MongooseFinder = require('../lib/MongooseFinder');
const { Post } = require('../schemas');

module.exports = class ArchiveProvider extends DBBaseProvider {
  constructor() {
    super(Post);
  }

  /**
   * 20180604 とりあえず固定
   */
  populates() {
    return ['images', 'videos', '-postedBy'];
  }

  count({ userObjectId, from, to, during, searchWord, filter }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: true,
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
          isArchive: true,
        },
      ],
    };
    return super.count(query);
  }

  findById({ userObjectId, postObjectId }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        _id: postObjectId,
        postedBy: userObjectId,
        isArchive: true,
      },
    ]);

    const finder = new MongooseFinder({
      model: Post,
      options: { $and: builder.condition },
      populates: this.populates(),
    });
    return finder.findOne();
  }

  async findRelativeImages({ userObjectId, sort, limit, skip }) {
    return new Promise(async (resolve, reject) => {
      const posts = await this.find({
        userObjectId,
        sort,
        limit,
        skip,
      });
      return posts.map((post) => {
        const THRESHOLD = 10;
        const condition = [
          {
            postedBy: userObjectId,
            isArchive: true,
          },
        ];

        return this.Model.find({ $and: condition })
          .populate('images')
          .populate('video')
          .populate('-postedBy')
          .$where('compare(post.images.hashHexDecimal, this.images.hashHexDecimal) < THRESHOLD')
          .exec((err, doc) => {
            if (err) {
              return reject(err);
            }
            return resolve(doc);
          });
      });
    });
  }

  /**
   * 指定したIDとその前後count件のpostを返す
   * @param {*} param0
   */
  async findByIdBeforeAndAfter({ userObjectId, postObjectId, limit }) {
    const current = await this.findById({ userObjectId, postObjectId });
    const next = await new MongooseFinder({
      model: Post,
      options: {
        $and: [
          {
            _id: { $gt: mongoose.Types.ObjectId(postObjectId) },
            postedBy: userObjectId,
            isArchive: true,
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
            isArchive: true,
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

  find({ userObjectId, from, to, during, searchWord, filter, sort, limit, skip }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: true,
      },
    ]);
    builder.addCreatedAt(from, to);
    builder.addDuring(during);
    builder.addSearchWord(searchWord);
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

  /**
   *
   */
  findUnearthByDate({ userObjectId, from, to }) {
    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: userObjectId,
        isArchive: true,
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
};
