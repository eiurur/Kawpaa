const chalk = require('chalk');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { httpException } = require(path.resolve('build', 'domains', 'exceptions', 'httpException'));
const { PostRepository, DonePostRepository, DoneHistoryRepository } = require(path.resolve('build', 'model', 'repository'));
const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));
const DoneHistoryService = require('../history/DoneHistoryService');
// const DoneHistoryService = require(path.resolve('build', 'app', 'services', 'DoneHistoryService'));

module.exports = class DonePostService {
  static findByUrlAndSiteUrlAndPostedBy(condition) {
    return DatabaseProviderFactory.createProvider('Done').findByUrlAndSiteUrlAndPostedBy(condition);
  }

  // HACK: 長すぎ
  // POST 抜いた
  // 自分が投稿した画像を抜いたとき、inboxまたは。Archiveにある画像は消す。
  // 他のユーザが投稿した画像を抜いたとき、消す必要はない。
  static async upsert(params) {
    logger.info('DonePostService upsert');
    logger.info('params: ', params);
    const { user, url, posts } = params;
    if (posts) {
      for (let post of posts) {
        await this._upsert({ user, post, url });
      }
      return 'ok';
    } else {
      const { post } = params;
      return await this._upsert({ user, post, url });
    }
  }

  /**
   * 抜いた回数の更新
   * @param {*} params
   */
  static async fluctuate(params) {
    logger.info('DonePostService fluctuate');
    logger.info('params: ', params);
    const condition = this.Fluctuation(params);
    const donePost = await DatabaseProviderFactory.createProvider('Done').flucateNumDone(condition);
    if (donePost === null) {
      throw httpException.BadRequest();
    }
    if (String(donePost.postedBy) !== String(params.user._id)) {
      throw httpException.BadRequest();
    }

    // 増加であれば、Historyにも追加
    if (params.type === 'increase') {
      const history = DoneHistoryService.DoneHistory(donePost);
      return DoneHistoryService.save(history);
    }
    // 減少あれば、Historyから最新の情報を削除
    const historyCondition = { donePostObjectId: donePost._id };
    return DoneHistoryService.removeLatest(historyCondition);
  }

  static Fluctuation({ type, donePost }) {
    const increaseNum = type === 'increase' ? 1 : -1;

    return {
      donePost,
      increaseNum,
    };
  }

  // TODO: 移行がまだ。
  static async remove(type, params) {
    // CAUTION:
    // donePostObjectId: params.postObjectId
    // 二つは違う！！
    // Viewを共通化するために渡される値(params)をpostObjectIdにしてる。
    // done
    logger.info('DonePostService remove');
    logger.info('type  : ', type);
    logger.info('params: ', params);
    const donePostRepository = new DonePostRepository();
    donePostRepository.setPostObjectId(params.postObjectId);
    const post = await donePostRepository.__findById(params.user);
    if (_.isNull(post)) {
      throw httpException.BadRequest();
    }
    if (String(post.postedBy) !== String(params.user._id)) {
      throw httpException.BadRequest();
    }

    await donePostRepository.__remove();

    // history
    const doneHistoryRepository = new DoneHistoryRepository();
    doneHistoryRepository.setDonePostObjectId(params.postObjectId);
    return doneHistoryRepository.__removeByDonePostObjectId();
  }

  static Condition({ type, url, siteUrl, postedBy }) {
    return {
      type,
      url,
      siteUrl,
      userObjectId: postedBy,
    };
  }

  static async _upsert({ user, post, url }) {
    const postRepository = new PostRepository();
    const donePostRepository = new DonePostRepository();
    postRepository.setPostObjectId(post.postObjectId);
    donePostRepository.setPostObjectId(post.postObjectId);

    // PostをDoneしたあと、Postのデータは消される。
    // なので、単純にPostテーブルからfindしても存在しない( = null)場合があり、以降の処理で不具合が生じる
    // そこで、DonePostテーブルからもfindして、存在する方のデータを元データとして扱う
    try {
      const posts = await Promise.all([postRepository.__findById(user), donePostRepository.__findById(user)]);

      const post = posts[0] === null ? posts[1] : posts[0];

      logger.info('抜いた人のID: ', user._id);
      logger.info('postの所有者ID', post.postedBy);

      if (post === null) {
        throw httpException.BadRequest();
      }
      if (String(post.postedBy) !== String(user._id)) {
        throw httpException.BadRequest();
      }

      // Postの情報を取得
      postRepository.setPost(post);

      // Postの情報をコピー
      donePostRepository.setDonePost(JSON.parse(JSON.stringify(postRepository.getPost())));

      // 投稿元を設定
      donePostRepository.setOriginPostedBy(postRepository.getPost().postedBy);

      // 投稿元が別の人の投稿で抜くとき、今の状態だとDonePostのpostedByには投稿元のユーザ情報が入っており、
      // そのまま抜いてあるか確認すると、自分ではなく投稿元が抜いてあるかの確認になり、齟齬が生じる。
      // その調整をここで行う。
      if (String(postRepository.getPost().postedBy) !== String(user._id)) {
        const donePost = donePostRepository.getDonePost();
        donePost.postedBy = JSON.parse(JSON.stringify(user));
        donePostRepository.setDonePost(donePost);
      }

      // 抜いてあるか確認
      const condition = DonePostService.Condition(post);
      const existingDonePost = await DonePostService.findByUrlAndSiteUrlAndPostedBy(condition);

      // 抜いたリストに登録
      const newDonePost = existingDonePost == null ? {} : DonePostService.DonePost(donePostRepository.getDonePost());
      const resultDonePost = await donePostRepository.done(newDonePost);

      // 履歴にも登録
      const doneHistory = DoneHistoryService.DoneHistory(resultDonePost);
      const resultDoneHistory = await DoneHistoryService.save(doneHistory);

      // 投稿者が自分でないならinbox/archiveの投稿を消さない
      if (String(postRepository.getPost().postedBy) !== String(user._id)) {
        return resultDoneHistory;
      }
      await postRepository.__remove();
      return 'ok';
    } catch (err) {
      logger.info('DonePostService ERROR');
      logger.info('url: ', url);
      logger.info('err: ', err);
      // try {
      switch (err.code) {
        // UNIQUEキー制約に抵触
        case 11000: {
          logger.info('upsert 11000 err: ', err);
          logger.info('postRepository.getPost() = ', postRepository.getPost());
          const condition = DonePostService.Condition(postRepository.getPost());
          const _existingDonePost = await DonePostService.findByUrlAndSiteUrlAndPostedBy(condition);
          logger.info('_existingDonePost = ', _existingDonePost);
          donePostRepository.setDonePost(_existingDonePost);
          donePostRepository.setIncreaseNum(1);
          const _resultDonePost = await donePostRepository.__flucateNumDone();
          const _doneHistory = DoneHistoryService.DoneHistory(_resultDonePost);
          const resultDoneHistory = await DoneHistoryService.save(_doneHistory);
          if (String(postRepository.getPost().postedBy) !== String(donePostRepository.getDonePost().postedBy)) {
            return resultDoneHistory;
          }
          await postRepository.__remove(post.postObjectId);
          return 'ok';
        }
        default: {
          logger.info('upsert default err: ', err);
          throw new Error(err);
        }
      }
    }
  }

  static DonePost({ postedBy, images, siteUrl, url, favicon, description, hostName, type, siteName, title, content, createdAt }) {
    return {
      postedBy,
      images,
      siteUrl,
      url,
      favicon,
      description,
      hostName,
      type,
      siteName,
      title,
      content,
      createdAt,
    };
  }
};
