const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const VideoSchema = new Schema({
  original: String, // original
});

VideoSchema.index({ original: -1 }, { unique: true });

mongoose.model('Video', VideoSchema);

const Video = mongoose.model('Video');

module.exports = Video;
