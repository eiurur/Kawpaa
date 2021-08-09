const fsp = require('fs-extra');
const request = require('request');
const path = require('path');
const { logger } = require(path.resolve('logger'));

module.exports = class VideoDownloader {
  constructor(url, filepath) {
    this.url = url;
    this.filepath = filepath;
  }

  setOptions(options) {
    this.options = options;
    return this;
  }

  getEncodingOptions() {
    return {
      videoCodec: 'libvpx', // WebM-VP8
      // crf = 定率係数。x264のとき、量子化スケールの範囲は0～51。0は無損失。23がデフォルト。51が最悪。
      // vpxの範囲は4~63。
      options: ['-qmin 0', '-qmax 50', '-crf 5'],
      audioCodec: 'libvorbis',
    };
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
