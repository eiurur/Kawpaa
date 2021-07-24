const path = require('path');

const { my } = require(path.resolve('build', 'lib', 'my'));

// TODO: ほとんどImageFileからの流用なので継承使うなりリファクタリングを忘れない
module.exports = class VideoFile {
  constructor(url, name) {
    this.url = url;
    this.name = name || my.createHash(my.formatX()) + my.createUID();
    this.changeExtension(this.extractExtension(url));
  }

  changeExtension(ext = '.webm') {
    this.ext = ext;
    this.original = `${this.name}${this.ext}`;
  }

  extractExtension(url) {
    return this.squeezeImageExtension(this.excludeIllegalCharactersFromExtension(this.getExtensionFromUrl(url)));
  }

  // 一部の動画拡張子に絞る
  squeezeImageExtension(ext) {
    return ['.avi', '.mp4', '.webm'].includes(ext) ? ext : '.webm';
  }

  // クエリストリングなど、余計な文字を除去し、拡張子だけにする
  // <a href="http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression" target="_blank">javascript - Removing all script tags from html with JS Regular Expression - Stack Overflow</a>
  excludeIllegalCharactersFromExtension(ext) {
    const regex = /[#\\?]/g; // regex of illegal extension characters
    const endOfExt = ext.search(regex);
    if (endOfExt <= -1) {
      return ext;
    }
    return ext.substring(0, endOfExt);
  }

  getExtensionFromUrl(url) {
    const filename = url.split('/').pop();
    return path.extname(filename);
  }
};
