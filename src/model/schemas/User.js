const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// #
// Schemaインタフェースを通してモデルの定義を行う
// #
const UserSchema = new Schema({
  twitterIdStr: {
    type: String,
    unique: true,
    index: true,
  },
  name: String,
  screenName: String,
  icon: String,
  url: String,
  description: String,
  accessToken: String,
  accessTokenSecret: String,
  isPremium: {
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

// #
// モデルへのアクセス
// mongoose.model 'モデル名', 定義したスキーマクラス
// を通して一度モデルを定義すると、同じ関数を通してアクセスすることができる
// #
mongoose.model('User', UserSchema);

// #
// 定義した時の登録名で呼び出し
// #
const User = mongoose.model('User');

module.exports = User;
