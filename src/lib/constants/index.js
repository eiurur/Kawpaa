const path = require('path');

/**
 * デフォルトのリンクの画像のパス
 */
exports.DEFAULT_FILES = {
  DEFAULT_LINK_ICON: path.resolve('build', 'app', 'public', 'front', 'images', 'thumbnails', 'default_link_icon.png'),
};

exports.DEFAULT_IMAGE_EXTENSION = '.jpg';
exports.APP_FQDN = 'https://kawpaa.eiurur.xyz';

/**
 * 画像の保存先
 */
exports.DIRECTORIES = {
  IMAGES_TO: path.resolve('data', 'images'),
  THUMBNAILS_TO: path.resolve('data', 'thumbnails'),
  VIDEOS_TO: path.resolve('data', 'videos'),
};

/**
 *
 */
exports.EXCEPTION_SITE_URLS = ['www.youtube.com/watch?v=', 'pornhub.com', 'komiflo.com/comics/', 'ecchi.iwara.tv'];

/**
 *
 */
exports.SPECIAL_HOSTNAME = {
  DEVIANTART_HOSTNAME: 'deviantart.com',
  GELBOORU_HOSTNAME: 'gelbooru.com',
  PIXIV_HOSTNAME: 'pixiv.net',
  KOMIFLO_HOSTNAME: 'komiflo.com',
  KONACHAN_HOSTNAME: 'konachan.com',
  SANKAKUCOMPLEX_HOSTNAME: 'sankakucomplex.com',
};

/**
 *
 */
exports.CONTENT_TYPES = {
  IMAGE: 'image',
  LINK: 'link',
  TEXT: 'text',
  VIDEO: 'video',
};
