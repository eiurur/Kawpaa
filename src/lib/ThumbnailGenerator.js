const path = require('path');
const Samune = require('samune');

const { logger } = require(path.resolve('logger'));

const { DIRECTORIES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class ThumbnailGenerator {
  static async generate(filename, sizeList) {
    try {
      const opts = {
        url: `${DIRECTORIES.IMAGES_TO}/${filename}`,
        dstDir: DIRECTORIES.THUMBNAILS_TO,
        resizeOptions: { quality: 75 },
      };
      const samune = new Samune(opts);
      const thumbnailFileNameList = await samune.generate(sizeList);
      return thumbnailFileNameList;
    } catch (err) {
      console.log(`${DIRECTORIES.IMAGES_TO}/${filename}`);
      logger.info('ThumbnailGenerator.error =>');
      logger.info(filename);
      logger.info(err);
      return [];
    }
  }
};
