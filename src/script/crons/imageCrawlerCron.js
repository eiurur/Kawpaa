const { CronJob } = require('cron');
const { exec } = require('child_process');
const moment = require('moment');
const path = require('path');

require('dotenv').config();

const { logger } = require(path.resolve('logger'));

const tasks = [
  {
    filepath: path.resolve(`${process.env.CRAWL_BATCH_FILEPATH}/daily/DailyBatchExecuter`),
    cronTime: '15 5 * * *',
  },
  {
    filepath: path.resolve(`${process.env.CRAWL_BATCH_FILEPATH}/weekly/WeeklyBatchExecuter`),
    cronTime: '20 6 * * 1',
  },
  {
    filepath: path.resolve(`${process.env.CRAWL_BATCH_FILEPATH}/monthly/MonthlyBatchExecuter`),
    cronTime: '40 6 1 * *',
  },
  {
    filepath: path.resolve('build', 'script', 'save-ranking-top'),
    cronTime: '0 0 * * *',
  },
];

const runScript = function (filepath) {
  return exec(`node ${filepath}`, { maxBuffer: 400 * 1024 }, (err, stdout, stderr) => {
    if (stdout !== null) {
      logger.info(`stdout: ${stdout}`);
    }
    if (stderr !== null) {
      logger.info(`stderr: ${stderr}`);
    }
    if (err !== null) {
      return logger.info(`err: ${err}`);
    }
  });
};

tasks.map(
  (task) =>
    new CronJob({
      cronTime: task.cronTime,

      onTick() {
        logger.info(`${task.filepath} Start!!`);
        runScript(task.filepath);
      },

      onComplete() {
        logger.info(`${task.filepath} Completed.... : ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
      },

      start: true,
      timeZone: 'Asia/Tokyo',
    })
);
