const fs = require('fs-extra');
const path = require('path');

const { APP_FQDN, DIRECTORIES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class KawpaaImageFile {
  constructor(name, size) {
    this.imageDir = size === 'thumbnail' ? DIRECTORIES.THUMBNAILS_TO : DIRECTORIES.IMAGES_TO;
    this.name = name;
    this.path = `${this.imageDir}/${this.name}`;
    return this;
  }

  exist() {
    try {
      fs.accessSync(this.path);

      // ?origのファイルをaccessだと読み込める。readFileでも読み込める。サイズで判断するしかない。
      // const stat = fs.statSync(this.path)
      // if (stat.size < 1) return false;

      return true;
    } catch (e) {
      return false;
    }
  }

  async toBase64() {
    const data = await fs.readFile(this.path);
    const base64 = data.toString('base64');
    return base64;
  }

  toUrl(size) {
    const a = process.env.NODE_ENV === 'production' ? `${APP_FQDN}/data` : 'https://127.0.0.1:9021/data';
    const url = `${a}/${size}/${this.name}`;
    return url;
  }
};
