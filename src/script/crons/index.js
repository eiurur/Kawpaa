const path = require('path');
const { CronJob } = require('cron');
const { promisify } = require('util');
const { execFile, spawn } = require('child_process');

const execFileAsync = promisify(execFile);
const { logger } = require(path.resolve('logger'));

const runProcess = async (filepath) => {
  const { stdout, stderr } = await execFileAsync('node', [filepath], {
    maxBuffer: 1024 * 1024 * 10,
    shell: true,
  });
  if (stderr) {
    logger.info(stderr);
  }
  logger.info(stdout);
  return stdout;
};

const spawnProcess = (cmd, args = [], option = {}) =>
  new Promise((resolve, reject) => {
    const normalizedCmd = cmd.replace(/\\/g, '/');
    const normalizedArgs = args.map((arg) => arg.replace(/\\/g, '/'));
    let stdoutChunks = [];
    let stderrChunks = [];
    const child = spawn(normalizedCmd, normalizedArgs);
    child.stdout.on('data', (data) => {
      stdoutChunks = stdoutChunks.concat(data);
    });
    child.stdout.on('end', () => {
      const stdoutContent = Buffer.concat(stdoutChunks).toString();
      logger.info('stdout chars:', stdoutContent.length);
      logger.info(stdoutContent);
      return resolve(stdoutContent);
    });

    child.stderr.on('data', (data) => {
      stderrChunks = stderrChunks.concat(data);
    });
    child.stderr.on('end', () => {
      const stderrContent = Buffer.concat(stderrChunks).toString();
      logger.info('stderr chars:', stderrContent.length);
      logger.info(stderrContent);
      return reject(stderrContent);
    });
  });

const unearthJob = new CronJob({
  cronTime: '0 0 * * *',
  onTick: async () => {
    logger.info('--- start unearth cron ---');
    const args = [path.resolve(__dirname, '..', 'crawl_batch', 'registerUnearth')];
    const stdout = await spawnProcess('node', args);
    logger.info('--- finish unearth cron ---');
  },
  start: true,
  timeZone: 'Asia/Tokyo',
});
unearthJob.start();
