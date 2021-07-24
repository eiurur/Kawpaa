const path = require('path');
const { Yandere } = require('mizu');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'yande_re';

module.exports = class YandereImageCrawler extends ImageCrawler {
  constructor(term) {
    super({ name: CRAWLING_SITE_NAME, term });
    this.setCrawler(Yandere);
  }
};
