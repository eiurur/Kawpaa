const _ = require('lodash');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { httpException } = require(path.resolve('build', 'domains', 'exceptions', 'httpException'));
const { PostRepository, DonePostRepository, DoneHistoryRepository } = require(path.resolve('build', 'model', 'repository'));
const KawpaaImageFile = require(path.resolve('build', 'domains', 'data', 'files', 'KawpaaImageFile'));
const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));
const MongooseObjectNormalizer = require(path.resolve('build', 'model', 'lib', 'MongooseObjectNormalizer'));

/*
QUESTION: PostServiceなのにDonePostとDoneHistoryが混在している。typeで分岐させるのがすでに失敗だったのでは？
*/
module.exports = class PostService {
  /**
   * FIXME: findをpopularに変更すれば不要だ。
   * @param {*} type
   */
  static getProviderType(type) {
    switch (type.toLowerCase()) {
      case 'archive':
        return 'Archive';
      case 'done':
        return 'Done';
      case 'favorite':
        return 'Favorite';
      case 'donehistory':
        return 'DoneHistory';
      case 'find':
        return 'Popular';
      default:
        return 'Post';
    }
  }

  static find(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).find(condition);
  }

  static findOne(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).findById(condition);
  }

  /**
   * IDのポストと前後1件のポストを結合して返す。
   * @param {*} type
   * @param {*} condition
   */
  static findByIdBeforeAndAfter(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).findByIdBeforeAndAfter(condition);
  }

  /**
   * 似ている画像を探す
   * @param {*} type
   * @param {*} condition
   */
  static findRelativeImages(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).findRelativeImages(condition);
  }

  static count(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).count(condition);
  }

  static countAll(type, condition) {
    const providerType = this.getProviderType(type);
    return DatabaseProviderFactory.createProvider(providerType).countAll(condition);
  }

  static async compress(type, format, condition) {
    const posts = await this.find(type, condition);
    const files = posts.map((post) => new KawpaaImageFile(post.images.medium, 'thumbnail'));
    return files.filter((kawpaaImageFile) => kawpaaImageFile.exist());
  }

  /**
   *
   * @param {*} params
   */
  static upsert(params) {
    logger.info('PostService upsert');
    const postRepository = new PostRepository();
    postRepository.setPost(params.post);
    return postRepository.__upsert();
  }

  /**
   * UserIdが異なる場合はBad Request
   *
   * @param {*} params
   */
  static async upsertById(params) {
    logger.info('PostService upsertById');
    const postRepository = new PostRepository(params.post.postObjectId);
    const post = await postRepository.__findById(params.user); // 対象となるPostの存在を確認
    if (_.isNull(post)) {
      throw httpException.BadRequest();
    }
    if (String(post.postedBy) !== String(params.user._id)) {
      throw httpException.BadRequest();
    }

    postRepository.setPost(params.post);
    return postRepository.__upsertById(params.user);
  }

  /**
   * UserIdが異なる場合はBad request
   * @param {*} type
   * @param {*} params
   */
  static async remove(type, params) {
    logger.info('PostService remove');
    logger.info('type  : ', type);
    logger.info('params: ', params);
    switch (type.toLowerCase()) {
      // TODO: DonePostServiceに移行。
      case 'done':
      case 'favorite': {
        // CAUTION:
        // donePostObjectId: req.params.postObjectId
        // 二つは違う！！
        // Viewを共通化するために渡される値(req.params)をpostObjectIdにしてる。

        // done
        const donePostRepository = new DonePostRepository();
        donePostRepository.setPostObjectId(params.postObjectId);
        var post = await donePostRepository.__findById(params.user);
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
      default: {
        // post
        const postRepository = new PostRepository(params.postObjectId);
        var post = await postRepository.__findById(params.user);
        if (_.isNull(post)) {
          throw httpException.BadRequest();
        }
        if (String(post.postedBy) !== String(params.user._id)) {
          throw httpException.BadRequest();
        }
        return postRepository.__remove();
      }
    }
  }

  /**
   * FindPostをInboxに移動するケースも存在するので単純にisArchiveを1から0に変えるだけでは上手くいかない
   * posdtedByも入れ替える()
   * @param {*} type
   * @param {*} params
   */
  static async toInbox(type, params) {
    logger.info('PostService toInbox');
    logger.info('type  : ', type);
    logger.info('params: ', params);
    const sourcePostRepository = new PostRepository();
    sourcePostRepository.setPostObjectId(params.postObjectId);
    let post = await sourcePostRepository.__findById(); // FIXME: params.userを渡したい、けどfindのtoInboxが動作しなくなる
    if (_.isNull(post)) {
      throw httpException.BadRequest();
    }
    post = MongooseObjectNormalizer.shape(post);
    post.postedBy = params.user;
    post.updatedAt = Date.now();
    post.createdAt = Date.now();
    const destPostRepository = new PostRepository();
    destPostRepository.setPost(post);
    return destPostRepository.__upsert();
  }

  static Condition(params) {
    return {
      userObjectId: params.user._id, // FIXME: auth.getUserして
      searchWord: params.searchWord,
      limit: params.limit - 0,
      skip: params.skip - 0,
      archived: params.archived,
      filter: params.filter,
      during: params.during,
      sort: params.sort,
      term: params.term,
      date: params.date,
    };
  }

  static Post(post = {}, imageInfo = {}, images = {}) {
    return Object.assign({}, post, imageInfo, images);
  }
};
