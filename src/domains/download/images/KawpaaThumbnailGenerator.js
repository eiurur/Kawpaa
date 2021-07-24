const path = require('path');

const ThumbnailGenerator = require(path.resolve(
  'build',
  'lib',
  'ThumbnailGenerator'
));
const { logger } = require(path.resolve('logger'));
module.exports = class KawpaaThumbnailGenerator extends ThumbnailGenerator {
  static async generate({ filename }) {
    try {
      const thumbnailFileNameList = await super.generate(filename, [
        30,
        120,
        240,
        480,
      ]);
      const result = {
        original: filename,
        tiny: thumbnailFileNameList[0].filename,
        mini: thumbnailFileNameList[1].filename,
        small: thumbnailFileNameList[2].filename,
        medium: thumbnailFileNameList[3].filename,
      };
      return result;
    } catch (err) {
      logger.info('KawpaaThumbnailGenerator.error => ');
      logger.info(filename);
      logger.info(err);
      return [];
    }
  }
};
