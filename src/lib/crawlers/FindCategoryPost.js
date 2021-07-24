const path = require('path');

const { CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class FindCategoryPost {
  constructor({ name, term, date, illust, images }) {
    this.content = null;
    this.type = CONTENT_TYPES.IMAGE;
    this.url = illust.images.large || illust.images.medium;
    this.hostName = this.hostname;
    this.title = illust.title;
    this.siteUrl = illust.source;
    this.siteName = name;
    this.description = term;
    this.favicon = null;
    this.originImageWidth = illust.width;
    this.originImageHeight = illust.height;
    this.postedBy = null;
    this.isPrivate = false;
    this.isArchive = false;
    this.createdAt = date;
    this.images = images._id; // CAUTION: ImageSchemaだからimagesとsがつく。imageのリストではない
  }
};
