const _ = require('lodash');
const path = require('path');

const { DashboardRepository } = require(path.resolve(
  'build',
  'model',
  'repository'
));

module.exports = class DashboardService {
  static find(condition) {
    return DashboardRepository.find(condition);
  }

  static Condition(params) {
    return {
      userObjectId: params.user._id, // FIXME: auth.getUserして
      limit: params.limit - 0,
      skip: params.skip - 0,
      sort: params.sort,
      hostnames: params.hostnames,
    };
  }
};
