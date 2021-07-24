const path = require('path');
const chalk = require('chalk');

const { logger } = require(path.resolve('logger'));

const { my } = require(path.resolve('build', 'lib', 'my'));

// FIXME: なんで動かない？！？！？？！ -> DoneHistoryRepository is undefined
// const { PostRepository, DoneHistoryRepository } = require(path.resolve(
//   'build',
//   'model',
//   'repository',
// ));
const PostRepository = require(path.resolve('build', 'model', 'repository', 'PostRepository'));
const RankingProvider = require(path.resolve('build', 'model', 'provider', 'ranking'));
const DoneHistoryRepository = require(path.resolve('build', 'model', 'repository', 'DoneHistoryRepository'));

// TODO: aggregateとcout、共通項目が多いので要リファクタリング
module.exports = class StatisticsRepository {
  constructor(userObjectId) {
    this.userObjectId = userObjectId;
  }

  /**
   * 未使用
   */
  aggregateByHostname() {
    logger.info(chalk.blue(this.userObjectId));
    const postRepository = new PostRepository();
    const opts = { userObjectId: this.userObjectId, _id: '$hostName' };
    return postRepository.aggregate(opts);
  }

  /**
   * 年間のトップのコンテンツと回数を返す
   * @return {Promise}
   */
  heads() {
    const rankingProvider = new RankingProvider();
    const options = {
      userObjectId: this.userObjectId,
    };
    return rankingProvider.find(options);
  }

  /**
   *
   * @param {String} year - 集計年(YYYY, 2015, 2016, 2017, 2017)
   * @return {Promise}
   */
  aggregateByYear({ year }) {
    logger.info(chalk.blue(this.userObjectId));
    const doneHistoryRepository = new DoneHistoryRepository();
    const begin = my.startOf(year, 'year');
    const end = my.endOf(year, 'year');
    const opts = {
      _id: '$donePost',
      userObjectId: this.userObjectId,
      begin: new Date(begin),
      end: new Date(end),
    };
    return doneHistoryRepository.aggregateByYear(opts);
  }

  /**
   * 直近1年間の日毎の回数を取得
   * @param {String} start - 開始日(2019-05-24)
   * @param {String} end - 終了日(2019-05-24)
   * @return {Promise}
   */
  countByDays({ begin, end }) {
    logger.info(chalk.blue(this.userObjectId));
    logger.info('begin: ', begin);
    logger.info('end: ', end);
    const doneHistoryRepository = new DoneHistoryRepository();
    begin = my.startOf(begin, 'day', 'YYYY-MM-DD HH:mm:ss');
    end = my.endOf(end, 'day', 'YYYY-MM-DD HH:mm:ss');
    logger.info('begin: ', begin);
    logger.info('end: ', end);

    const opts = {
      userObjectId: this.userObjectId,
      begin: new Date(begin),
      end: new Date(end),
    };
    return doneHistoryRepository.countByDays(opts);
  }

  /**
   *
   * @param {String} year - 集計年(YYYY, 2015, 2016, 2017, 2017)
   * @return {Promise}
   */
  countByYear({ year }) {
    logger.info(chalk.blue(this.userObjectId));
    const doneHistoryRepository = new DoneHistoryRepository();
    const begin = my.startOf(year, 'year');
    const end = my.endOf(year, 'year');
    const opts = {
      _id: '$donePost',
      userObjectId: this.userObjectId,
      begin: new Date(begin),
      end: new Date(end),
    };
    return doneHistoryRepository.countByYear(opts);
  }
};
