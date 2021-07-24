const moment = require('moment');

module.exports = class MongoDBTimeNormalizer {
  // @JSTDate: (date) -> return moment(date).subtract(9, 'hours').format('YYYY-MM-DD')
  static JSTDate(date) {
    return date;
  }
};
