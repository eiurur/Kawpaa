const path = require('path');

const ImageDownloader = require(path.resolve('build', 'lib', 'ImageDownloader'));
const KawpaaHttpProxy = require(path.resolve('build', 'domains', 'proxy', 'KawpaaHttpProxy'));

module.exports = class KawpaaImageDownloader {
  constructor({ hostName, siteUrl, url, filepath }) {
    this.hostName = hostName;
    this.siteUrl = siteUrl;
    this.url = url;
    this.filepath = filepath;
  }

  /**
   * HttpProxyを介してfetchする
   * @param {Object} process -
   * @return {Promise} byte -
   */
  async fetch({ process }) {
    const proxy = new KawpaaHttpProxy();
    proxy.setUrl(this.hostName, this.url);
    proxy.setHeaders(this.hostName, this.siteUrl);
    const byte = await proxy.execute(process);
    return byte;
  }

  async download() {
    const downloader = new ImageDownloader(this.url, this.filepath);
    return await this.fetch({ process: downloader });
  }
};
