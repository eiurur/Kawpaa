const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;
const DBBaseProvider = require('./base');
const { User } = require('../schemas');

module.exports = class UserProvider extends DBBaseProvider {
  constructor() {
    super(User);
  }

  findByTwitterIdStr({ twitterIdStr }) {
    return this.findOne({ twitterIdStr });
  }

  findByName({ name }) {
    return this.findOne({ name }, { accessToken: 0 });
  }

  findByAccessToken({ accessToken }) {
    return this.findOne({ accessToken }, { accessToken: 0 });
  }

  findAll() {
    return this.find({}, { accessToken: 0 });
  }

  upsert({ user }) {
    const query = { twitterIdStr: user.twitterIdStr };
    const data = Object.assign(
      {
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      user
    );
    const options = { upsert: true };
    this.update(query, data, options);
  }

  findOneAndUpdate({ user }) {
    const query = { twitterIdStr: user.twitterIdStr };
    const data = user;
    const options = { new: true, upsert: true };
    return super.findOneAndUpdate(query, data, options);
  }
};
