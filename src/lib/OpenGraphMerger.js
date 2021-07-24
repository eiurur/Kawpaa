const util = require('util');
const og = require('open-graph');
const path = require('path');

const { CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class OpenGraphMerger {
  static ogp(url) {
    return util.promisify(og)(url);
  }

  static async merge(obj) {
    // 足りないデータがあり、typeがlinkなら
    const isFulfilledData = obj.url || obj.siteImage || obj.description;
    if (
      [CONTENT_TYPES.IMAGE, CONTENT_TYPES.VIDEO].includes(obj.type)
      || isFulfilledData
    ) {
      return obj;
    }

    const url = obj.siteUrl;
    let meta = null;
    try {
      meta = await this.ogp(url);
    } catch (e) {
    }
    if (!meta) {
      return obj;
    }

    const newObj = {
      ...obj,
      url: meta.image.url,
      siteImage: meta.image.url,
      description: meta.description,
    };

    return newObj;
  }
};
