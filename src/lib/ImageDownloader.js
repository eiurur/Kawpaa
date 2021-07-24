const fs = require('fs-extra');
const request = require('request');

module.exports = class ImageDownloader {
  constructor(url, filepath) {
    this.url = url;
    this.filepath = filepath;
  }

  setOptions(options) {
    this.options = options;
    return this;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(this.filepath);
      request(this.url, this.options).pipe(ws);
      ws.on('finish', () => resolve(this.url));
      ws.on('error', (err) => {
        ws.end();
        return reject(err);
      });
    });
  }
};
