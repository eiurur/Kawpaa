const path = require('path');

const { BaseProvider } = require(path.resolve('build', 'model', 'provider'));
const QueryPropertyTypeGetter = require('../lib/QueryPropertyTypeGetter');
const PostConditionBuilder = require('../lib/PostConditionBuilder');
const MongooseFinder = require('../lib/MongooseFinder');
const { Post } = require('../schemas');

module.exports = class DashboardRepository extends BaseProvider {
  constructor() {
    super(...arguments);
  }

  static populates() {
    return ['images', 'videos'];
  }

  static find({ userObjectId, from, to, during, searchWord, filter, sort, limit, skip, hostnames }) {
    const HOSTNAMES = ['twitter.com', 'tweetdeck.twitter.com', 'www.pixiv.net', 'danbooru.donmai.us', 'chan.sankakucomplex.com', 'yande.re'];

    if (Array.isArray(hostnames)) {
      hostnames = hostnames.filter((hostname) => HOSTNAMES.includes(hostname));
    } else if (typeof hostnames === 'string') {
      hostnames = [hostnames];
    } else {
      throw new Error('pass hostname');
    }

    const builder = new PostConditionBuilder();
    builder.buildCondition([
      {
        postedBy: { $ne: userObjectId },
      },
      {
        postedBy: { $ne: null },
      },
      {
        hostName: { $in: hostnames },
      },
      {
        type: 'image',
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
      fields: '-postedBy',
      limit,
      skip,
      sort,
      populates: this.populates(),
    });
    return finder.find();
  }
};
