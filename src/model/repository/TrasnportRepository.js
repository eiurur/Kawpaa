const path = require('path');
const download = require('download');
const sleep = require('sleep-promise');

const { logger } = require(path.resolve('logger'));

const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));
const { APP_FQDN } = require(path.resolve('build', 'lib', 'constants'));
const KawpaaThumbnailGenerator = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaThumbnailGenerator'));
const TIMEOUT_MS = 10000000;

module.exports = class TrasnportRepository {
  constructor() {}

  static async export({ user }) {
    logger.info('export');
    logger.info(user);
    const postProvider = DatabaseProviderFactory.createProvider('Post');
    const posts = await postProvider.find({
      userObjectId: user._id,
      limit: 10000000,
    });
    logger.info(posts.length);
    const archiveProvider = DatabaseProviderFactory.createProvider('Archive');
    const archives = await archiveProvider.find({
      userObjectId: user._id,
      limit: 10000000,
    });
    logger.info(archives.length);
    const doneProvider = DatabaseProviderFactory.createProvider('Done');
    const dones = await doneProvider.find({
      userObjectId: user._id,
      limit: 10000000,
    });
    logger.info(dones.length);
    const doneHistoryProvider = DatabaseProviderFactory.createProvider('doneHistory');
    const doneHistories = await doneHistoryProvider.find({
      userObjectId: user._id,
      limit: 10000000,
    });
    logger.info(doneHistories.length);
    const images = [...posts.map((post) => post.images), ...archives.map((post) => post.images), ...dones.map((post) => post.images)].filter(
      (image) => !!image
    );
    logger.info(images.length, images[0]);
    const videos = [...posts.map((post) => post.videos), ...archives.map((post) => post.videos), ...dones.map((post) => post.videos)].filter(
      (video) => !!video
    );
    logger.info(videos.length, videos[0]);
    return {
      posts,
      archives,
      dones,
      doneHistories,
      images,
      videos,
    };
  }

  static async import({ user, record }) {
    logger.info('import');
    logger.info(user);

    const userProvider = DatabaseProviderFactory.createProvider('User');
    const cUser = await userProvider.findOne({
      twitterIdStr: user.twitterIdStr,
    });
    logger.info(cUser);

    const imageProvider = DatabaseProviderFactory.createProvider('Image');
    const videoProvider = DatabaseProviderFactory.createProvider('Video');
    const postProvider = DatabaseProviderFactory.createProvider('Post');
    const doneProvider = DatabaseProviderFactory.createProvider('Done');
    const doneHistoryProvider = DatabaseProviderFactory.createProvider('doneHistory');
    const dist = path.resolve('data');
    for (let image of record.images) {
      logger.info('START:', image._id);
      try {
        const imageClone = { ...image };
        const ex = await imageProvider.findOne({ original: imageClone.original });
        if (!ex) {
          delete imageClone._id;
          if (imageClone.original) {
            await download(`${APP_FQDN}/data/images/${imageClone.original}`, path.join(dist, 'images'), {
              filename: imageClone.original,
              timeout: TIMEOUT_MS,
              retry: 5,
            });
            await KawpaaThumbnailGenerator.generate({ filename: imageClone.original });
          }
          await imageProvider.findOneAndUpdate({ image: imageClone });
        }
        await sleep(100);
      } catch (e) {
        console.error('ERROR ', image);
        console.error(e);
      }
    }
    logger.info('FINISH: images', record.images.length);

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

    for (let post of record.posts) {
      const postClone = { ...post };
      delete postClone._id;
      postClone.postedBy = cUser._id;
      const i = record.images.find((image) => postClone.images && image._id == postClone.images._id);
      if (i) {
        const image = await imageProvider.findOne({ original: i.original });
        if (image) {
          postClone.images = image._id;
        }
      }
      const v = record.videos.find((video) => postClone.videos && video._id == postClone.videos._id);
      if (v) {
        const video = await videoProvider.findOne({ original: v.original });
        if (video) {
          postClone.videos = video._id;
        }
      }
      await postProvider.upsertWithoutRenewUpdatedAt({ userObjectId: cUser._id, post: postClone });
    }
    logger.info('FINISH: inboxes', record.posts.length);

    for (let post of record.archives) {
      const postClone = { ...post };
      delete postClone._id;
      postClone.postedBy = cUser._id;
      const i = record.images.find((image) => postClone.images && image._id == postClone.images._id);
      if (i) {
        const image = await imageProvider.findOne({ original: i.original });
        if (image) {
          postClone.images = image._id;
        }
      }
      const v = record.videos.find((video) => postClone.videos && video._id == postClone.videos._id);
      if (v) {
        const video = await videoProvider.findOne({ original: v.original });
        if (video) {
          postClone.videos = video._id;
        }
      }
      await postProvider.upsertWithoutRenewUpdatedAt({ userObjectId: cUser._id, post: postClone });
    }
    logger.info('FINISH: archives', record.archives.length);

    const dps = [];
    for (var donePost of record.dones) {
      try {
        const donePostClone = { ...donePost };
        delete donePostClone._id;
        const i = record.images.find((image) => donePostClone.images && image._id == donePostClone.images._id);
        if (i) {
          const image = await imageProvider.findOne({ original: i.original });
          if (image) {
            donePostClone.images = image._id;
          }
        }
        const v = record.videos.find((video) => donePostClone.videos && video._id == donePostClone.videos._id);
        if (v) {
          const video = await videoProvider.findOne({ original: v.original });
          if (video) {
            donePostClone.videos = video._id;
          }
        }
        donePostClone.postedBy = cUser._id;
        donePostClone.originPostedBy = cUser._id;
        await doneProvider.upsertWithoutRenewUpdatedAt({ userObjectId: cUser._id, donePost: donePostClone });
        const r = await doneProvider.findOneby({ userObjectId: cUser._id, donePost: donePostClone });
        logger.info(r);
        dps.push({ _id: r._doc._id, preId: donePost._id });
      } catch (e) {
        console.error('ERROR ', donePost);
        console.error(e);
      }
    }
    logger.info('FINISH: dones', record.dones.length);

    for (let doneHistory of record.doneHistories) {
      const doneHistoryClone = { ...doneHistory };
      delete doneHistoryClone._id;
      if (!doneHistoryClone.donePost) continue;
      const donePost = dps.find((done) => done.preId == doneHistoryClone.donePost._id);
      if (!donePost) continue;
      doneHistoryClone.donePost = donePost._id;
      doneHistoryClone.postedBy = cUser._id;
      doneHistoryClone.originPostedBy = cUser._id;
      await doneHistoryProvider.upsertWithoutRenewUpdatedAt({ userObjectId: cUser._id, doneHistory: doneHistoryClone });
    }
    logger.info('FINISH: doneHistories', record.doneHistories.length);

    return 'ok';
  }
};
