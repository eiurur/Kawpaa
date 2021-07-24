const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DBBaseProvider = require('./base');
const { Image } = require('../schemas');

module.exports = class ImageProvider extends DBBaseProvider {
  constructor() {
    super(Image);
  }

  findByIdAndUpdate({ _id, image }) {
    const data = image;
    const options = { new: true, upsert: true };
    return super.findByIdAndUpdate(_id, data, options);
  }

  findOneAndUpdate({ image }) {
    const query = { original: image.original };
    const data = image;
    const options = { new: true, upsert: true };
    return super.findOneAndUpdate(query, data, options);
  }

  upsert({ _id, image }) {
    const query = { _id };
    const data = image;
    const options = { upsert: true };
    return this.update(query, data, options);
  }
};
