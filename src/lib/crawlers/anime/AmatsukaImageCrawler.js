const Mizu = require('mizu');
const path = require('path');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'amatsuka';

module.exports = class AmatsukaImageCrawler extends ImageCrawler {
  constructor(term, date, sortType) {
    super({ name: CRAWLING_SITE_NAME, term, date });
    this.sortType = sortType;
    this.setCrawler();
  }

  setCrawler() {
    const opts = {
      name: this.name,
      term: this.term,
      sortType: this.sortType,
      directory: this.images_to,
    };
    this.crawler = Mizu.createCrawler(opts);
  }
};
