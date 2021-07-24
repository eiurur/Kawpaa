const path = require('path');

const { TrasnportRepository } = require(path.resolve('build', 'model', 'repository'));

module.exports = class TrasnportService {
  static async export({ user }) {
    const record = await TrasnportRepository.export({ user });
    return { record };
  }
  static async import({ user, record }) {
    return await TrasnportRepository.import({ user, record });
  }
};
