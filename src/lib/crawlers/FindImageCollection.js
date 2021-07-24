const path = require('path');
const Sosyaku = require('sosyaku');

const KawpaaThumbnailGenerator = require(path.resolve(
  'build',
  'domains',
  'download',
  'images',
  'KawpaaThumbnailGenerator',
));

module.exports = class FindImageCollection {
  constructor({ illusts }) {
    this.illusts = illusts;
    this.thumnbnails = [];
  }

  getThumbnails() {
    return this.thumnbnails;
  }

  /**
   * 保存対象外の画像を除外する
   * Hack:: メモリ消費量が激しいのでGifファイルは除外する。imagemagickの知見がたまったら要修正
   * @param {Array} excludedExtensions - 除外する拡張子
   * @return {Array} 指定の拡張子を持つ画像を除外した配列
   */
  rejectNonTargetImage(excludedExtensions = ['.gif']) {
    return this.illusts.filter(illust => excludedExtensions.includes(illust.filename) === -1);
  }

  /**
   * 一定の間隔を空けてサムネイルを作成する
   */
  async generateThumnail() {
    const options = {
      limit: 3,
      interval_s: 5,
      dataList: this.illusts,
      task(illust) {
        return KawpaaThumbnailGenerator.generate({ filename: illust.filename });
      },
    };
    const sosyaku = new Sosyaku(options);
    this.thumnbnails = await sosyaku.bite();
  }
};
