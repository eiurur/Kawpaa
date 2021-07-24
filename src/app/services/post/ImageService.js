const path = require('path');

const { logger } = require(path.resolve('logger'));

const { ImageRepository } = require(path.resolve(
  'build',
  'model',
  'repository'
));
const PostService = require(path.resolve(
  'build',
  'app',
  'services',
  'post',
  'PostService'
));

const KawpaaThumbnailManager = require(path.resolve(
  'build',
  'domains',
  'download',
  'images',
  'KawpaaThumbnailManager'
));

module.exports = class ImageService {
  /**
   * ① サムネイルの作成
   * ② Image Collectionに登録
   * ③ Post Collectionを更新
   */
  static async register({ imageFile, post, type }) {
    const kawpaaThumbnailManager = new KawpaaThumbnailManager(imageFile, post);
    const thumbnailsAndHash = await kawpaaThumbnailManager.save(type);
    const image = this.Image(thumbnailsAndHash);
    const images = await this.findOneAndUpdate({ image });
    // コンテンツとサムネイルを合体させてPostCollectionに登録
    const registeredPost = await PostService.Post(post, { images: images._id });
    const result = await PostService.upsert({ post: registeredPost });
    return result;
  }

  static Image(params) {
    return Object.assign(params.image, params.hash);
  }

  static findOneAndUpdate(params) {
    const imageRepository = new ImageRepository();
    imageRepository.setImage(params.image);
    return imageRepository.__findOneAndUpdate();
  }
};
