const path = require('path');
const { Danbooru } = require('mizu');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'danbooru';

module.exports = class DanbooruImageCrawler extends ImageCrawler {
  constructor(term) {
    const auth = { login: process.env.DANBOORU_USERNAME, api_key: process.env.DANBOORU_API_KEY };
    super({ name: CRAWLING_SITE_NAME, term, auth });
    this.setCrawler(Danbooru);
  }
};
