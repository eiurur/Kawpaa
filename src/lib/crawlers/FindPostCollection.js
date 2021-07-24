const path = require('path');

const ImageMeasure = require(path.resolve('build', 'lib', 'utils', 'ImageMeasure'));

module.exports = class FindPostCollection {
  /**
   *
   * @param {*} images - multiSizeImage
   */
  constructor({ illusts, images }) {
    this.images = images; // CAUTION: imageの複数形
    this.illusts = illusts;
    this.posts = [];
  }

  getPosts() {
    return this.posts;
  }

  /**
   * 画像ファイルのwidth, heightを算出する。
   * @param {*} imageFilePath - 画像のファイルパス
   * @return {Promise} Object { width, height } - 画像のサイズ
   */
  async measure({ imageFilePath }) {
    return await ImageMeasure.getImageSize(imageFilePath);
  }

  /**
   *
   */
  async mergeAll() {
    const list = await Promise.all(this.images.map(async (image, idx) => ({
      image,
      size: await this.measure({ imageFilePath: image.original }),
      illust: this.illusts[idx],
    })));
    this.posts = list.map(this.merge);
  }

  /**
   *
   * @param {*} image
   * @param {*} size
   * @param {*} illust
   */
  merge({ image, size, illust }) {
    return Object.assign(
      {
        image,
        thumbnailFileName: image.tiny,
        width: size.width,
        height: size.height,
      },
      illust,
    );
  }
};
