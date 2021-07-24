const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { EXCEPTION_SITE_URLS, DIRECTORIES, CONTENT_TYPES } = require(path.resolve(
  'build',
  'lib',
  'constants',
));

/**
 * URLから動画のサムネイルを抽出する
 */
module.exports = class VideoThumbnailExtractor {
  /**
   *
   * @param {String} url - 動画のURL
   * @param {String} filename - 生成するサムネイルのファイル名
   */
  constructor({ url, filename }) {
    this.url = url;
    this.filename = filename;
    this.command = ffmpeg(url);
  }

  /**
   * urlがmp4形式でなかったらエラー
   * 生成するサムネイル名が画像拡張子のものでなかったらエラー
   */
  invalidate() {
    // this.url
    // this.filename.
  }

  getScreenShotOption() {
    return {
      count: 1,
      folder: DIRECTORIES.IMAGES_TO,
      filename: this.filename, // %iはインデックス番号、%sは秒
      size: '720x?', // 幅320で縦は可変
    };
  }

  extract() {
    return new Promise((resolve, reject) => {
      const onError = (err) => {
        logger.info(`VideoThumbnailExtractor An error occurred: ${err.message}`);
        return reject(err);
      };

      const onSuccess = () => {
        logger.info(`VideoThumbnailExtractor sccuess: ${DIRECTORIES.IMAGES_TO}/${this.filename}`);
        resolve({
          filename: this.filename,
          filepath: `${DIRECTORIES.IMAGES_TO}/${this.filename}`,
        });
      };

      const options = this.getScreenShotOption();

      this.command
        .screenshots(options)
        .on('error', onError)
        .on('end', onSuccess);
    });
  }
};
