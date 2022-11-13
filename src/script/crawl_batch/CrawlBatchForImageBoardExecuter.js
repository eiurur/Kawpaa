const path = require('path');

const { DanbooruImageCrawler, YandereImageCrawler } = require(path.resolve('build', 'lib', 'crawlers'));

module.exports = class CrawlBatchForImageBoardExecuter {
  constructor(term) {
    this.term = term;
  }

  get crawlTasks() {
    if (this.term === 'days') {
      return [new YandereImageCrawler(this.term), new DanbooruImageCrawler(this.term)];
    }
    return [new YandereImageCrawler(this.term), new DanbooruImageCrawler(this.term)];
  }

  exec() {
    Promise.allSettled(this.crawlTasks.map((task) => task.exec()))
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
