const path = require('path');

const { logger } = require(path.resolve('logger'));

const { VideoRepository } = require(path.resolve('build', 'model', 'repository'));
const PostService = require(path.resolve('build', 'app', 'services', 'post', 'PostService'));
const KawpaaVideoManager = require(path.resolve('build', 'domains', 'download', 'video', 'KawpaaVideoManager'));

module.exports = class VideoService {
  /**
   * ① 動画の生成(ダウンロード)
   * ② Video Collectionに登録
   * ③ Post Collectionを更新
   */
  static async register({ videoFile, post, type }) {
    const kawpaaVideoManager = new KawpaaVideoManager(videoFile, post);
    const OriginalVideos = await kawpaaVideoManager.save(type);
    const video = this.Video(OriginalVideos);
    const videos = await this.findOneAndUpdate({ video });

    // コンテンツとサムネイルを合体させてPostCollectionに登録
    const registeredPost = await PostService.Post(post, { videos: videos._id });
    const result = await PostService.upsert({ post: registeredPost });
    return result;
  }

  /**
   * 現状、保存する動画のサイズ、形式はoriginal(?)のものだけだから無意味な返却関数になっているけど、
   * KawpaaThumbnailManagerと書式を合わせるためにわざと利用。
   * @param {String} original - URLの動画ファイルをwebmにエンコードしてローカルに配置したファイル名
   */
  static Video({ original }) {
    return { original };
  }

  static findOneAndUpdate({ video }) {
    const videoRepository = new VideoRepository();
    videoRepository.setVideo(video);
    return videoRepository.__findOneAndUpdate();
  }
};
