const path = require('path');

const { my } = require(path.resolve('build', 'lib', 'my'));
const { CONTENT_TYPES, DEFAULT_IMAGE_EXTENSION } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class ImageFile {
  constructor(type, sourceUrl, name) {
    this.sourceUrl = sourceUrl;
    if (name) {
      this.name = name;
    } else if ([CONTENT_TYPES.LINK, CONTENT_TYPES.TEXT].includes(type)) {
      this.name = my.createHash(my.formatX()) + my.createUID();
    } else {
      this.name = my.createHash(sourceUrl);
    }
    this.changeExtension(this.extractExtension(sourceUrl));
  }

  changeExtension(ext = '.jpg') {
    this.ext = ext;
    this.original = `${this.name}${this.ext}`;
    this.thumbnail = `${this.name}_w30${this.ext}`;
  }

  extractExtension(url) {
    return this.squeezeImageExtension(
      this.excludeIllegalCharactersFromExtension(this.getExtensionFromUrl(url)),
    );
  }

  // 画像拡張子に絞る
  squeezeImageExtension(ext) {
    return ['.jpg', '.png', '.jpeg', '.gif'].includes(ext) ? ext : DEFAULT_IMAGE_EXTENSION;
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
    if (!url) return DEFAULT_IMAGE_EXTENSION;
    const filename = url.split('/').pop();
    return path.extname(filename);
  }
};
