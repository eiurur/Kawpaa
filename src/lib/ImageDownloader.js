const fsp = require('fs-extra');
const request = require('request');
const path = require('path');

module.exports = class ImageDownloader {
  constructor(url, filepath) {
    this.url = url;
    this.filepath = filepath;
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  setOptions(options) {
    this.options = options;
    return this;
  }

  execute() {
    return new Promise(async (resolve, reject) => {
      await fsp.mkdirs(path.dirname(this.filepath));
      const ws = fsp.createWriteStream(this.filepath);
      request(this.url, this.options).pipe(ws);
      ws.on('finish', () => resolve(this.url));
      ws.on('error', (err) => {
        ws.end();
        return reject(err);
      });
    });
  }
};
