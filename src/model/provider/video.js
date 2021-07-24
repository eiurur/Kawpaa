const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DBBaseProvider = require('./base');
const { Video } = require('../schemas');

module.exports = class VideoProvider extends DBBaseProvider {
  constructor() {
    super(Video);
  }

  findByIdAndUpdate({ _id, video }) {
    const data = video;
    const options = { new: true, upsert: true };
    return super.findByIdAndUpdate(_id, data, options);
  }

  findOneAndUpdate({ video }) {
    const query = { original: video.original };
    const data = video;
    const options = { new: true, upsert: true };
    return super.findOneAndUpdate(query, data, options);
  }

  upsert({ _id, video }) {
    const query = { _id };
    const data = video;
    const options = { upsert: true };
    return this.update(query, data, options);
  }
};
