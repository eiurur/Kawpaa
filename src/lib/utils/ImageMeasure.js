const fs = require('fs');
const path = require('path');
const probe = require('probe-image-size');

const { DIRECTORIES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class ImageMeasure {
  static getImageSize(filename) {
    try {
      const filepath = `${DIRECTORIES.IMAGES_TO}/${filename}`;
      const input = fs.createReadStream(filepath);
      return probe(input);
    } catch (e) {
      return null;
    }
  }
};
