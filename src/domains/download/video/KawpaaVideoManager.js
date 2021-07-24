const path = require('path');
const fsp = require('fs-extra');

const { logger } = require(path.resolve('logger'));

const KawpaaVideoDownloader = require(path.resolve(
  'build',
  'domains',
  'download',
  'video',
  'KawpaaVideoDownloader',
));

const {
  EXCEPTION_SITE_URLS, DIRECTORIES, DEFAULT_FILES, CONTENT_TYPES,
} = require(path.resolve(
  'build',
  'lib',
  'constants',
));

module.exports = class KawpaaVideoManager {
  constructor(videoFile, post) {
    this.videoFile = videoFile;
    this.post = post;
    this.filepath = `${DIRECTORIES.VIDEOS_TO}/${this.videoFile.original}`;
  }

  /**
   *
   * @param {*} ext
   */
  changeExtension(ext) {
    this.filepath = `${DIRECTORIES.VIDEOS_TO}/${this.videoFile.original}`;
  }

  /**
   *
   * @param {String} type - コンテンツの種類(image/link/text)
   */
  async save(type) {
    logger.info('[KawpaaVideoManager] save => ', type);
    logger.info({
      siteUrl: this.post.siteUrl,
      hostName: this.post.hostName,
      url: this.post.url,
      filepath: this.filepath,
    });
    const downloader = new KawpaaVideoDownloader({
      siteUrl: this.post.siteUrl,
      hostName: this.post.hostName,
      url: this.post.url,
      filepath: this.filepath,
    });
    await downloader.download();
    return { original: this.videoFile.original };
  }
};
