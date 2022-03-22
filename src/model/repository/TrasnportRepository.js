const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const FileType = require('file-type');
const fsp = require('fs-extra');
const download = require('download');
const sleep = require('sleep-promise');
const mongoose = require('mongoose');

const { ImageFile, VideoFile } = require(path.resolve('build', 'domains', 'entities'));
const KawpaaImageManager = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaImageManager'));
const KawpaaVideoManager = require(path.resolve('build', 'domains', 'download', 'video', 'KawpaaVideoManager'));

const { logger } = require(path.resolve('logger'));

const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));
const { APP_FQDN } = require(path.resolve('build', 'lib', 'constants'));
const KawpaaThumbnailGenerator = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaThumbnailGenerator'));
const TIMEOUT_MS = 10000000;

const toObjectId = (str) => mongoose.Types.ObjectId(str);

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

    // dataフォルダが存在しないと復元に失敗する。
    await fsp.mkdirs(dist);
    await fsp.mkdirs(path.join(dist, 'images'));
    await fsp.mkdirs(path.join(dist, 'videos'));

    for (let image of record.images) {
      try {
        const imageClone = { ...image };
        const imageId = toObjectId(imageClone._id);
        delete imageClone._id;
        if (imageClone.original) {
          const filepath = path.join(dist, 'images', imageClone.original);
          try {
            await download(`${APP_FQDN}/data/images/${imageClone.original}`, path.join(dist, 'images'), {
              filename: imageClone.original,
              timeout: TIMEOUT_MS,
            });
            const { ext, mime } = await FileType.fromFile(filepath);
            const isImage = mime.includes('image');
            if (!isImage) {
              await fsp.remove(filepath);
              throw new Error('404');
            }
          } catch (e) {
            const p = await postProvider.findOne({ images: imageId });
            const dp = await doneProvider.findOne({ images: imageId });
            const post = p || dp;
            if (post) {
              // if (post.type === 'video') throw new Error('duplicate');
              const imageUrl = post.url || post.siteImage;
              logger.info('Download from:', imageUrl);
              const filename = path.basename(image.original, path.extname(image.original));
              const imageFile = new ImageFile(post.type, imageUrl, filename);
              const kawpaaImageManager = new KawpaaImageManager(imageFile, post);
              await kawpaaImageManager.save(post.type);
            }
          }
          await KawpaaThumbnailGenerator.generate({ filename: imageClone.original });
          await imageProvider.findOneAndUpdate({ image: imageClone });
        }
        await sleep(100);
      } catch (e) {
        logger.error('ERROR ', image);
        logger.error(e);
      }
    }
    logger.info('FINISH: images', record.images.length);

    for (let video of record.videos) {
      try {
        const videoClone = { ...video };
        const videoId = toObjectId(videoClone._id);
        delete videoClone._id;
        if (videoClone.original) {
          const filepath = path.join(dist, 'videos', videoClone.original);
          try {
            await download(`${APP_FQDN}/data/videos/${videoClone.original}`, path.join(dist, 'videos'), {
              filename: videoClone.original,
              timeout: TIMEOUT_MS,
            });

            const { ext, mime } = await FileType.fromFile(filepath);
            const isVideo = mime.includes('video');
            if (!isVideo) {
              await fsp.remove(filepath);
              throw new Error('404');
            }
          } catch (e) {
            const p = await postProvider.findOne({ videos: videoId });
            const dp = await doneProvider.findOne({ videos: videoId });
            const post = p || dp;
            if (post) {
              const videoUrl = post.url || post.siteImage;
              logger.info('Download from:', videoUrl);
              const filename = path.basename(videoClone.original, path.extname(videoClone.original));
              const videoFile = new VideoFile(post.url, filename);
              const kawpaaVideoManager = new KawpaaVideoManager(videoFile, post);
              await kawpaaVideoManager.save(post.type);
            }
          }
          await videoProvider.findOneAndUpdate({ video: videoClone });
        }
        await sleep(100);
      } catch (e) {
        logger.error('ERROR ', image);
        logger.error(e);
      }
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
        logger.error('ERROR ', donePost);
        logger.error(e);
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
