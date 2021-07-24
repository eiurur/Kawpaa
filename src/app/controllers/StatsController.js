const path = require('path');

const { StatsService } = require(path.resolve('build', 'app', 'services'));

module.exports = class StatsController {
  static async heads(req, res) {
    try {
      const service = new StatsService({ userObjectId: req.user._id });
      const heads = await service.heads();
      res.send({ heads });
    } catch (err) {
      res.status(err.statusCode).send(err);
    }
  }

  static async ranking(req, res) {
    try {
      const service = new StatsService({ userObjectId: req.user._id });
      const { ranking, total } = await service.query({ year: req.params.year });
      res.send({ ranking, total });
    } catch (err) {
      res.status(err.statusCode).send(err);
    }
  }

  static async countByDays(req, res) {
    try {
      const service = new StatsService({ userObjectId: req.user._id });
      const counts = await service.countByDays({
        begin: req.params.begin,
        end: req.params.end,
      });
      const heatmapData = {};
      counts.map((item) => {
        heatmapData[Math.floor(new Date(item.datetime).getTime() / 1000)] = item.count;
      });
      res.send(heatmapData);
    } catch (err) {
      res.status(err.statusCode).send(err);
    }
  }
};
