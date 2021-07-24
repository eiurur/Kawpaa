const path = require('path');

const { ImageProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class ImageRepository extends ImageProvider {
  constructor(image = []) {
    super(...arguments);
    this.image = image;
  }

  setImage(image) {
    this.image = image;
  }

  __findOneAndUpdate() {
    return this.findOneAndUpdate({ image: this.image });
  }
};
