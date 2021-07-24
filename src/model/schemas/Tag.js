const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// #
// Schemaインタフェースを通してモデルの定義を行う
// #
const TagSchema = new Schema({
  mean: {
    type: String,
    unique: true,
    index: true,
  },
  ruby: String,
});

// #
// モデルへのアクセス
// mongoose.model 'モデル名', 定義したスキーマクラス
// を通して一度モデルを定義すると、同じ関数を通してアクセスすることができる
// #
mongoose.model('Tag', TagSchema);

// #
// 定義した時の登録名で呼び出し
// #
const Tag = mongoose.model('Tag');

module.exports = Tag;
