const path = require('path');

const { StatisticsRepository } = require(path.resolve(
  'build',
  'model',
  'repository'
));

module.exports = class StatsService {
  constructor({ userObjectId }) {
    this.repository = new StatisticsRepository(userObjectId);
  }

  async ranking({ year }) {
    return await this.repository.aggregateByYear({ year });
  }

  async heads() {
    return await this.repository.heads();
  }

  async total({ year }) {
    return await this.repository.countByYear({ year });
  }

  async countByDays({ begin, end }) {
    return await this.repository.countByDays({ begin, end });
  }

  async query({ year }) {
    return {
      ranking: await this.ranking({ year }),
      total: await this.total({ year }),
    };
  }
};
