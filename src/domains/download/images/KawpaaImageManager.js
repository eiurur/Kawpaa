const path = require('path');
const fsp = require('fs-extra');

const { logger } = require(path.resolve('logger'));
const ImageManager = require(path.resolve('build', 'lib', 'ImageManager'));

const VideoThumbnailExtractor = require(path.resolve('build', 'domains', 'download', 'video', 'VideoThumbnailExtractor'));
const KawpaaImageDownloader = require(path.resolve('build', 'domains', 'download', 'images', 'KawpaaImageDownloader'));
const Camera = require(path.resolve('build', 'lib', 'utils', 'Camera'));

const { EXCEPTION_SITE_URLS, DIRECTORIES, DEFAULT_FILES, CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class KawpaaImageManager extends ImageManager {
  constructor(imageFile, post) {
    super(imageFile);
    this.post = post;
    this.filepath = `${DIRECTORIES.IMAGES_TO}/${this.imageFile.original}`;
  }

  /**
   *
   * @param {*} ext
   */
  changeExtension(ext) {
    this.imageFile.changeExtension(ext);
    this.filepath = `${DIRECTORIES.IMAGES_TO}/${this.imageFile.original}`;
  }

  /**
   * linkのときでもニコニコやyoutubeはサムネを保存するのでチェックする。
   * @param {*} type
   */
  shouldSaveScreenShot(type) {
    return [CONTENT_TYPES.LINK, CONTENT_TYPES.TEXT].includes(type);
  }

  /**
   *
   */
  shouldExtractThumbnail(type) {
    return [CONTENT_TYPES.VIDEO].includes(type);
  }

  /**
   * youtubeやniconico、pornhubはChromeExtensionがページから取得したサムネイルをサムネイル画像として扱う。
   * それらのページではスクリーンショットを撮る必要はないためこの処理を通す
   */
  shouldUseCertainThumbnail() {
    return EXCEPTION_SITE_URLS.some((url) => this.post.siteUrl.indexOf(url) > -1);
  }

  async saveScreenShot() {
    try {
      logger.info('ScreenShot!!');
      // node-webshotは保存ファイルの拡張子がjpg, pngでないと保存時にエラーが発生するためrename
      this.changeExtension('.jpg');
      await Camera.caputure(this.post.siteUrl, this.filepath);
    } catch (e) {
      logger.info('Oops x_x, saving error');
      logger.info(e);
      await fsp.copy(DEFAULT_FILES.DEFAULT_LINK_ICON, this.filepath);
    }
  }

  /**
   *  指定の画像を保存→ダメならスクショ→ダメならデフォルトを指定
   * @param {String} type - コンテンツの種類(image/link/text)
   */
  async save(type) {
    logger.info('save  ====> ', type);
    await fsp.mkdirs(path.dirname(this.filepath));

    if (this.shouldSaveScreenShot(type) && !this.shouldUseCertainThumbnail()) {
      logger.info('-------- SCREEN SHOT ------------');
      await this.saveScreenShot();
    } else if (this.shouldExtractThumbnail(type)) {
      logger.info('-------- VIDEO EXTRACT ------------');
      logger.info('Extract video thumbnail!!');
      const extractor = new VideoThumbnailExtractor({
        url: this.post.url,
        filename: this.imageFile.original,
      });
      await extractor.extract(); // videoではサムネイルをオリジナルの画像とする(TODO: 先頭5秒をGIFにするとか？)。@20180527
    } else {
      try {
        logger.info('-------- IMAGE SAVE ------------');
        const downloader = new KawpaaImageDownloader({
          siteUrl: this.post.siteUrl,
          hostName: this.post.hostName,
          url: this.imageFile.sourceUrl,
          filepath: this.filepath,
        });
        await downloader.download(); // falseならthrowされるのでif分岐処理が不要
      } catch (e) {
        logger.info('【ERROR】save() => ', e);
        if (this.shouldSaveScreenShot(type)) {
          await this.saveScreenShot();
        } else {
          throw e;
        }
      }
    }
  }
};
