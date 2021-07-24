const path = require('path');

const { my } = require(path.resolve('build', 'lib', 'my'));
const DatabaseProviderFactory = require(path.resolve(
  'build',
  'model',
  'lib',
  'DatabaseProviderFactory'
));

/*
QUESTION: PostServiceなのにDonePostとDoneHistoryが混在している。typeで分岐させるのがすでに失敗だったのでは？
*/
module.exports = class UnearthService {
  static find(type, params) {
    return DatabaseProviderFactory.createProvider(type).findUnearthByDate(
      params
    );
  }

  static Condition({ amount, archived, user }) {
    const amountMonth = amount || 12;
    const userObjectId = user._id;
    const day = my.addTimeFormatYMD('months', -amountMonth);
    const from = my.startOf(day, 'day', 'YYYY-MM-DD HH:mm:ss');
    const to = my.endOf(day, 'day', 'YYYY-MM-DD HH:mm:ss');
    return {
      archived,
      userObjectId,
      from,
      to,
    };
  }
};
