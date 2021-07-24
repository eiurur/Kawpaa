const path = require('path');
const validUrl = require('valid-url');

require('dotenv').config();

const { logger } = require(path.resolve('logger'));

const { httpException } = require(path.resolve('build', 'domains', 'exceptions', 'httpException'));

const { ImageFile, VideoFile } = require(path.resolve('build', 'domains', 'entities'));
const jobQueue = require(path.resolve('build', 'lib', 'jobQueue', 'JobQueueManager'));
const ImageService = require(path.resolve('build', 'app', 'services', 'post', 'ImageService'));
const PostService = require(path.resolve('build', 'app', 'services', 'post', 'PostService'));
const VideoService = require(path.resolve('build', 'app', 'services', 'post', 'VideoService'));

const OpenGraphMerger = require(path.resolve('build', 'lib', 'OpenGraphMerger'));

const { CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));
const { my } = require(path.resolve('build', 'lib', 'my'));

const KawpaaImageManager = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaImageManager'));

const KawpaaCapacity = require(path.resolve('build', 'domains', 'download', 'KawpaaCapacity'));
module.exports = class PostRegisterService {
  /**
   * ガード文でどうこうより、マッピング関数に渡したほうがスッキリする？
   *
   * { content: null,
   *   title: ' http://hentai-kitties.tumblr.com/post/172589180710',
   *   siteName: '',
   *   siteUrl: 'http://hentai-kitties.tumblr.com/post/172589180710',
   *   type: 'image',
   *   url: 'https://78.media.tumblr.com/4cfc41aa4f219fa85a08913580d425ac/tumblr_nu2jhqZFdr1u59djuo1_540.png',
   *   hostName: 'www.tumblr.com',
   *   description: 'Tumblrは自分を表現したり、自分を発見する場です。好きなものを通じてつながりを見つけたり、興味が人と人
   * を繋げる場所。',
   *   favicon: 'https://assets.tumblr.com/images/favicons/favicon.ico?_v=b45846535fb3e72144f09ddd9ad69b4b',
   *   srcUrl: 'https://78.media.tumblr.com/4cfc41aa4f219fa85a08913580d425ac/tumblr_nu2jhqZFdr1u59djuo1_540.png',
   *   isPrivate: true,
   *   isArchive: false }
   */
  static guardRegistrationParameters({ post }) {
    const shouldHasKeys = ['content', 'title', 'siteName', 'siteUrl', 'type', 'url', 'hostName', 'description', 'favicon', 'srcUrl', 'isPrivate', 'isArchive'];

    // ・httpshttps://xxx.xyz/image.jpg や /yyy.net/test.jpgなどを送られるとサーバがクラッシュするためガード文で対応
    // ・linkはサーバサイドで取得する場合があり、undefinedで返ってくることもあるので対象外。
    if ([CONTENT_TYPES.IMAGE, CONTENT_TYPES.VIDEO].includes(post.type) && !validUrl.isUri(post.url)) {
      throw new Error(`the url is invalid. url: ${post.url}`);
    }
    // if( post.hasOwnProperty('content') && )
  }

  static addJobOfThumbnailGeneration({ post, imageFile }) {
    // // サムネイルの作成 + ImageCollectionに登録
    jobQueue.register({
      name: 'thumbnail transporting',
      process: async (job) =>
        // (画像の保存 ->) サムネイルの作成 -> Imageを登録 -> Postを更新。押し込み過ぎです
        await ImageService.register({
          imageFile: job.data.imageFile,
          post: job.data.post,
          type: job.data.type,
        }),
      completed: (job, result) => logger.info('[Post register] THUMBNAIL =>', job.id, job.data, result),
      failed: (job, result) => logger.error('[Post register] error', job.id, job.data, result),
    });
    jobQueue.add({
      name: 'thumbnail transporting',
      params: {
        imageFile,
        post,
        type: post.type,
      },
    });
  }

  static addJobOfVideoDownload({ post }) {
    // もし、動画ならサムネイル陽画像の保存のほかに動画のダウンロードも必要。
    const videoFile = new VideoFile(post.url);
    logger.info(videoFile);
    jobQueue.register({
      name: 'video transporting',
      process: async (job) =>
        // (画像の保存 ->) サムネイルの作成 -> Imageを登録 -> Postを更新。押し込み過ぎです
        await VideoService.register({
          videoFile: job.data.videoFile,
          post: job.data.post,
          type: job.data.type,
        }),
      completed: (job, result) => logger.info('[Post register] VIDEO =>', job.id, job.data, result),
      failed: (job, result) => logger.error('[Post register] error', job.id, job.data, result),
    });
    jobQueue.add({
      name: 'video transporting',
      params: {
        videoFile,
        post,
        type: post.type,
      },
    });
  }

  /**
   * POST Save to Kawpaaからの登録
   * 抜いたことあるけど、Inboxにとりあえず追加するよ！！
   * その画像を抜いたら、すでにdoneに登録済みの回数をインクリメントするよ。
   * originPostByも変わらないよ！
   * ① OpenGraph取得
   * ② オリジナル画像の保存
   * ③
   */
  static async register({ post, user }) {
    console.log('post:', post);
    console.log('user:', user);
    if (my.toBoolean(process.env.SHOULD_REJECT_REGISTRATION_BY_GENERAL_USER) && !user.isPremium) {
      throw httpException.UploadingRestrictedyMode();
    }
    if (my.toBoolean(process.env.SHOULD_SUSPEND_REGISTRATION)) {
      throw httpException.UploadingRestrictedyMode();
    }

    PostRegisterService.guardRegistrationParameters({ post });

    // データの整形
    const ogpMergedPost = await OpenGraphMerger.merge(post);
    ogpMergedPost.postedBy = user;
    const imageUrl = ogpMergedPost.url || ogpMergedPost.siteImage;
    const imageFile = new ImageFile(ogpMergedPost.type, imageUrl);

    // 画像の保存 + 画像サイズの取得
    const capacity = new KawpaaCapacity(ogpMergedPost);
    if (!user.isPremium) {
      await capacity.allowableFilesize(ogpMergedPost.type);
    }
    const kawpaaImageManager = new KawpaaImageManager(imageFile, ogpMergedPost);
    await kawpaaImageManager.save(ogpMergedPost.type);
    const imageSize = await kawpaaImageManager.getImageInfo();

    // コンテンツとサムネイルを合体させてPostCollectionに登録
    const schemedPost = await PostService.Post(ogpMergedPost, imageSize);
    const postUpsertResult = await PostService.upsert({ post: schemedPost });

    this.addJobOfThumbnailGeneration({ post: ogpMergedPost, imageFile });

    if (post.type === CONTENT_TYPES.VIDEO) {
      this.addJobOfVideoDownload({ post: ogpMergedPost });
    }

    return postUpsertResult;
  }
};
