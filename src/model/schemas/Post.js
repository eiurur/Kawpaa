const path = require('path');
const mongoose = require('mongoose');

const { CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// #
// Schemaインタフェースを通してモデルの定義を行う
// #
const PostSchema = new Schema({
  content: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: [CONTENT_TYPES.IMAGE, CONTENT_TYPES.LINK, CONTENT_TYPES.VIDEO, CONTENT_TYPES.TEXT],
    index: true,
  },
  url: String, // https://pixiv.com/mypage.php, https://amam.png
  hostName: String, // qiita.com, pixiv.com
  title: String, // ページのタイトル
  siteUrl: String, // サイトのURL(画像でも、それを引用してきたサイトのURLがこれ)
  siteName: String, // サイトのタイトル(名前)
  description: String,
  siteImage: String,
  favicon: String, // https://xxx.com/favicon.png
  originImageWidth: Number,
  originImageHeight: Number,
  images: {
    type: ObjectId,
    ref: 'Image',
  },
  videos: {
    type: ObjectId,
    ref: 'Video',
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
    index: true,
  },
  isPrivate: {
    // 非公開か
    type: Boolean,
    default: true,
  },
  isArchive: {
    // アーカイブに収納されたか
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

PostSchema.index(
  {
    url: 1,
    type: 1,
    siteUrl: 1,
    postedBy: 1,
  },
  { unique: true }
);

// #
// モデルへのアクセス
// mongoose.model 'モデル名', 定義したスキーマクラス
// を通して一度モデルを定義すると、同じ関数を通してアクセスすることができる
// #
mongoose.model('Post', PostSchema);

// #
// 定義した時の登録名で呼び出し
// #
const Post = mongoose.model('Post');

module.exports = Post;
