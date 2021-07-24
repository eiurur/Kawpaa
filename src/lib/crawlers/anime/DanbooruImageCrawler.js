const path = require('path');
const { Danbooru } = require('mizu');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'danbooru';

module.exports = class DanbooruImageCrawler extends ImageCrawler {
  constructor(term) {
    super({ name: CRAWLING_SITE_NAME, term });
    this.setCrawler(Danbooru);
  }
};
