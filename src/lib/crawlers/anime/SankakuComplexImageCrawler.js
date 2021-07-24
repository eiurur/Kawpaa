const path = require('path');
const { SankakuComplex } = require('mizu');

const ImageCrawler = require(path.join('..', 'ImageCrawler'));
const CRAWLING_SITE_NAME = 'sankaku_complex';

module.exports = class SankakuComplexImageCrawler extends ImageCrawler {
  constructor(term) {
    super({ name: CRAWLING_SITE_NAME, term });
    this.setCrawler(SankakuComplex);
  }
};
