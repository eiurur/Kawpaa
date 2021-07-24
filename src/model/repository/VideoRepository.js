const path = require('path');

const { VideoProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class VideoRepository extends VideoProvider {
  constructor(video = {}) {
    super(...arguments);
    this.video = video;
  }

  setVideo(video) {
    this.video = video;
  }

  __findOneAndUpdate() {
    return this.findOneAndUpdate({ video: this.video });
  }
};
