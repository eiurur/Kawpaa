const path = require('path');
const Chohuku = require('chohuku');

const ImageManager = require(path.resolve('build', 'lib', 'ImageManager'));

const KawpaaThumbnailGenerator = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaThumbnailGenerator'));

const { DIRECTORIES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class KawpaaThumbnailManager extends ImageManager {
  constructor(imageFile, post) {
    super(imageFile);
    this.post = post;
    this.filepath = `${DIRECTORIES.IMAGES_TO}/${this.imageFile.original}`;
  }

  async generateHash(filepath) {
    try {
      const hashHexDecimal = await new Chohuku(filepath).getHash(); // webp非対応
      const ret = { hashHexDecimal };
      return ret;
    } catch (err) {
      return null;
    }
  }

  /**
   * サムネイルを作成する
   * @return {images} - 生成したサムネイルの画像ファイルオブジェクト(original/tiny/mini/small/medium)
   */
  async generateThumbnails() {
    return await KawpaaThumbnailGenerator.generate({ filename: this.imageFile.original });
  }

  /**
   * サムネイルの作成と画像のハッシュを取得して返す
   * @param {} type
   */
  async save(type) {
    const [image, hash] = await Promise.all([this.generateThumbnails(), this.generateHash(this.filepath)]);
    return {
      image,
      hash,
    };
  }
};
