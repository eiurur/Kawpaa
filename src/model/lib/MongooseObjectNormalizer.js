module.exports = class MongooseObjectNormalizer {
  static shape(instance) {
    instance = instance.toObject();
    delete instance._id;
    delete instance.__v;
    return instance;
  }
};
