const fsp = require('fs-extra');
const path = require('path');
const download = require('download');
const sleep = require('sleep-promise');

const { logger } = require(path.resolve('logger'));

const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));
const { APP_FQDN } = require(path.resolve('build', 'lib', 'constants'));
const TIMEOUT_MS = 10000000;

process.on('unhandledRejection', console.dir);

/**
 * 全ユーザのランキングデータをRankingコレクションに保存する。
 */
(async () => {
  try {
    if (process.argv.length !== 3) {
      throw new Error('第3引数にkawpaa.jsonのパスを指定してください. \n ex: node ./src/script/patch/download-video-from-export-file.js kawpaa.json');
    }
    const importFile = process.argv[2];
    const { record } = JSON.parse(await fsp.readFile(importFile, 'utf8'));

    const videoProvider = DatabaseProviderFactory.createProvider('Video');
    const dist = path.resolve('data');
    for (let video of record.videos) {
      const videoClone = { ...video };
      delete videoClone._id;
      await videoProvider.findOneAndUpdate({ video: videoClone });
      if (videoClone.original)
        await download(`${APP_FQDN}/data/videos/${videoClone.original}`, path.join(dist, 'videos'), {
          filename: videoClone.original,
          timeout: TIMEOUT_MS,
          retry: 0,
        });
      await sleep(100);
    }
    logger.info('FINISH: videos', record.videos.length);
  } catch (e) {
    console.log(e);
  }
})();
