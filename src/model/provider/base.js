const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const { logger } = require(path.resolve('logger'));

const uri = process.env.MONGODB_URI;
const db = mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

module.exports = class DBBaseProvider {
  constructor(Model) {
    this.Model = Model;
  }

  aggregate(query) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} aggregate`);
      // logger.info('query  : ', JSON.stringify(query));
      console.time(`${this.Model.modelName} aggregate`);
      this.Model.aggregate(query).exec((err, result) => {
        console.timeEnd(`${this.Model.modelName} aggregate`);
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  count(query) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} count`);
      // logger.info('query  : ', JSON.stringify(query));
      console.time(`${this.Model.modelName} count`);
      this.Model.count(query).exec((err, count) => {
        console.timeEnd(`${this.Model.modelName} count`);
        if (err) {
          return reject(err);
        }
        return resolve({ count });
      });
    });
  }

  find(query, fields, options) {
    if (query == null) {
      query = {};
    }
    if (fields == null) {
      fields = {};
    }
    if (options == null) {
      options = {};
    }
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} find`);
      // logger.info('query  : ', JSON.stringify(query));
      // logger.info('fields : ', fields);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} find`);
      this.Model.find(query, fields, options, (err, result) => {
        console.timeEnd(`${this.Model.modelName} find`);
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  findOne(query, fields, options) {
    if (query == null) {
      query = {};
    }
    if (fields == null) {
      fields = {};
    }
    if (options == null) {
      options = {};
    }
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} find`);
      // logger.info('query  : ', JSON.stringify(query));
      // logger.info('fields : ', fields);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} find`);
      this.Model.findOne(query, fields, options, (err, result) => {
        console.timeEnd(`${this.Model.modelName} find`);
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  findByIdAndUpdate(_id, data, options) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} findByIdAndUpdate`);
      // logger.info('_id    : ', _id);
      // logger.info('data   : ', data);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} findByIdAndUpdate`);
      this.Model.findByIdAndUpdate(_id, data, options, (err, doc) => {
        console.timeEnd(`${this.Model.modelName} findByIdAndUpdate`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  findOneAndUpdate(query, data, options) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} findOneAndUpdate`);
      // logger.info('query  : ', JSON.stringify(query));
      // logger.info('data   : ', data);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} findOneAndUpdate`);
      this.Model.findOneAndUpdate(query, data, options, (err, doc) => {
        console.timeEnd(`${this.Model.modelName} findOneAndUpdate`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  save(data) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} save`);
      // logger.info('data   : ', data);
      console.time(`${this.Model.modelName} save`);
      return data.save((err, doc) => {
        console.timeEnd(`${this.Model.modelName} save`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  update(query, data, options) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} update`);
      // logger.info('query  : ', JSON.stringify(query));
      // logger.info('data   : ', data);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} update`);
      this.Model.update(query, data, options, (err) => {
        console.timeEnd(`${this.Model.modelName} update`);
        if (err) {
          return reject(err);
        }
        return resolve('update ok');
      });
    });
  }

  remove(query, data, options) {
    return new Promise((resolve, reject) => {
      // logger.info(`DBBaseProvider ${this.Model.modelName} remove`);
      // logger.info('query  : ', JSON.stringify(query));
      // logger.info('data   : ', data);
      // logger.info('options: ', options);
      console.time(`${this.Model.modelName} remove`);
      this.Model.remove(query, (err) => {
        console.timeEnd(`${this.Model.modelName} remove`);
        if (err) {
          return reject(err);
        }
        return resolve('remove ok');
      });
    });
  }
};
