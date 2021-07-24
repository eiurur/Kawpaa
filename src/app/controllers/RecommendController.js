const path = require('path');
const moment = require('moment');

const { DLSite } = require('mizu');

const redisClient = require(path.resolve('build', 'model', 'cache', 'redisClient'));

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const takeRandom = (array, n) => array.sort(() => Math.random() - Math.random()).slice(0, n);
module.exports = class RecommendController {
  static async find(req, res) {
    try {
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      const ls = await redisClient.getAsync(yesterday);
      if (ls) {
        const list = JSON.parse(ls);
        if (Array.isArray(list) && list.length) {
          return res.send(takeRandom(list, 4));
        }
      }

      const initial = { term: 'days' };
      const options = {
        type: 'maniax',
        category: 'voice',
        sub: 'SOU',
        affiliateId: 'kawpaa',
        limit: 100,
      };
      const servive = new DLSite(initial);
      const result = await servive.scrape({
        amount: -1,
        options,
      });
      await redisClient.set(yesterday, JSON.stringify(result));

      res.send(takeRandom(result, 4));
    } catch (err) {
      res.status(err.statusCode).send(err);
    }
  }
};
