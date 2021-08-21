const path = require('path');

require('dotenv').config();

const FileSizeScaler = require(path.resolve('build', 'lib', 'FileSizeScaler'));
const KawpaaHttpProxy = require(path.resolve('build', 'domains', 'proxy', 'KawpaaHttpProxy'));
const { httpException } = require(path.resolve('build', 'domains', 'exceptions', 'httpException'));

module.exports = class KawpaaCapacity {
  constructor({ hostName, siteUrl, url }) {
    this.hostName = hostName;
    this.siteUrl = siteUrl;
    this.url = url;
  }

  /**
   *
   * @param {*} byte
   */
  checkByteOverLimit(byte) {
    const mb = byte / (1024 * 1024);
    if (mb >= Number(process.env.MAX_UPLOADABLE_FILESIZE_MB)) {
      throw httpException.FilseSizeOverLimit();
    }
    return true;
  }

  /**
   * HttpProxyを介してfetchする
   * @param {Object} process -
   * @return {Promise} byte -
   */
  async fetch({ process }) {
    const proxy = new KawpaaHttpProxy();
    proxy.setHeaders(this.hostName, this.siteUrl);
    const byte = await proxy.execute(process);
    return byte;
  }

  /**
   *
   * @return {Boolean} - 許容するサイズを超えるかどうか。10MB以上はfalse、そうでなければtrue
   */
  async allowableFilesize() {
    if (!this.url) return true; // 保存元ページの画像が取得できずにnullが渡されるとaxiosのエラーが発生するためリクエストせずに許容する。
    const scaler = new FileSizeScaler(this.url);
    const byte = await this.fetch({ process: scaler });
    return this.checkByteOverLimit(byte);
  }
};
