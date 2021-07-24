const path = require('path');

const LAUNCHED_YEAR = 2015;

const { StatsService } = require(path.resolve('build', 'app', 'services'));
const { UserProvider } = require(path.resolve('build', 'model', 'provider'));
const { RankingProvider } = require(path.resolve('build', 'model', 'provider'));
const StatisticsRepository = require(path.resolve('build', 'model', 'repository', 'StatisticsRepository'));
process.on('unhandledRejection', console.dir);

/**
 * 全ユーザのランキングデータをRankingコレクションに保存する。
 */
(async () => {
  const fetchRanking = async ({ user, year }) => {
    try {
      const service = new StatsService({ userObjectId: user._id });
      const { ranking, total } = await service.query({ year });
      return { ranking, total };
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  try {
    // 全ユーザを取得
    const users = await new UserProvider().findAll();
    for (const user of users) {
      const stats = new StatisticsRepository(user._id);

      const currentYear = new Date().getFullYear();
      const years = range(LAUNCHED_YEAR, currentYear - 1);
      for (const year of years) {
        const ranking = await stats.aggregateByYear({ year });
        if (ranking.length > 0) {
          console.log(`user => ${user.screenName} ${user._id}`);
          console.log(`year: ${year}`);
          console.log(ranking[0]);

          const top = ranking[0];
          const _top = {
            postedBy: user._id,
            item: JSON.stringify(top._id),
            count: top.count,
            date: year,
          };
          console.log(_top);
          await new RankingProvider().upsert({ ranking: _top });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
})();
