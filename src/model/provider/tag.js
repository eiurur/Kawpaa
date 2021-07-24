const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DBBaseProvider = require('./base');
const { Tag } = require('../schemas');

module.exports = class TagProvider extends DBBaseProvider {
  constructor() {
    super(Tag);
  }

  findByIdAndUpdate({ _id, data }) {
    const options = { new: true, upsert: true };
    return super.findByIdAndUpdate(_id, data, options);
  }

  upsert({ _id, data }) {
    const query = { _id };
    const options = { upsert: true };
    return this.update(query, data, options);
  }
};
