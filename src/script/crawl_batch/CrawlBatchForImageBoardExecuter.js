const path = require('path');

const {
  DanbooruImageCrawler,
  // SankakuComplexImageCrawler,
  YandereImageCrawler,
  DLSiteCrawler,
} = require(path.resolve('build', 'lib', 'crawlers'));

module.exports = class CrawlBatchForImageBoardExecuter {
  constructor(term) {
    this.term = term;
  }

  get crawlTasks() {
    if (this.term === 'days') {
      return [
        new YandereImageCrawler(this.term),
        new DLSiteCrawler(this.term, {
          range: 'new',
          type: 'maniax',
          category: 'voice',
          sub: 'SOU',
          affiliateId: 'kawpaa',
          skip: Math.floor(Math.random() * Math.floor(50)),
          limit: 5,
        }),
        new DanbooruImageCrawler(this.term),
        new DLSiteCrawler(this.term, {
          range: 'all',
          type: 'books',
          category: 'comic',
          affiliateId: 'kawpaa',
          skip: Math.floor(Math.random() * Math.floor(50)),
          limit: 5,
        }),
      ];
    }
    return [
      new YandereImageCrawler(this.term),
      new DLSiteCrawler(this.term, {
        range: 'new',
        type: 'maniax',
        category: 'voice',
        sub: 'SOU',
        affiliateId: 'kawpaa',
        limit: 8,
      }),
      new DanbooruImageCrawler(this.term),
      new DLSiteCrawler(this.term, {
        range: 'all',
        type: 'books',
        category: 'comic',
        affiliateId: 'kawpaa',
        limit: 8,
      }),
    ];
  }

  exec() {
    Promise.all(this.crawlTasks.map((task) => task.exec()))
      .then((result) => {
        console.log('Fin CrawlBatchForImageBoardExecuter');
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }
};
