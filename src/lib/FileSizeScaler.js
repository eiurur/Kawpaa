const axios = require('axios');
const path = require('path');

const { logger } = require(path.resolve('logger'));
/**
 * ファイルの量り
 */
module.exports = class FileSizeScaler {
  constructor() {}

  setUrl(url) {
    this.url = url;
    return this;
  }

  setOptions(options = {}) {
    this.options = options;
    return this;
  }

  execute() {
    return new Promise((resolve, reject) => {
      logger.info('FileSizeScaler');
      logger.info('url: ', this.url);
      logger.info('options', this.options);
      axios
        .head(this.url, this.options)
        .then((response) => resolve(response.headers['content-length']))
        .catch((err) => reject(err));
    });
  }
};
