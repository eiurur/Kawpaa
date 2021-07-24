const path = require('path');

const ImageMeasure = require(path.resolve('build', 'lib', 'utils', 'ImageMeasure'));

module.exports = class ImageManager {
  constructor(imageFile) {
    this.imageFile = imageFile;
  }

  async getImageInfo() {
    const imageSize = await ImageMeasure.getImageSize(this.imageFile.original);
    return {
      originImageWidth: imageSize.width,
      originImageHeight: imageSize.height,
      // originFileName: this.imageFile.original,
      // thumbnailFileName: this.imageFile.thumbnail,
    };
  }
};
