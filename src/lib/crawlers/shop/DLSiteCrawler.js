const path = require('path');
const { DLSite } = require('mizu');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'dlsite';

module.exports = class DLSiteCrawler extends ImageCrawler {
  constructor(term, options) {
    super({ name: CRAWLING_SITE_NAME, term, options });
    this.setCrawler(DLSite);
  }
};
