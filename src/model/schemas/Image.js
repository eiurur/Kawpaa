const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ImageSchema = new Schema({
  original: String, // original
  tiny: String, // 30
  mini: String, // 120
  small: String, // 240
  medium: String, // 480
  large: String, // 1280
  hashHexDecimal: String,
}); // 16進数のハッシュ値(jimp.hash()で生成した値)

ImageSchema.index({ original: -1 });

mongoose.model('Image', ImageSchema);

const Image = mongoose.model('Image');

module.exports = Image;
