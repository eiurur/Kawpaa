// const compare = require('hamming-distance');
// const { Post } = require('../schemas');

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// const DBBaseProvider = require('./base');

// const THRESHOLD = 10;

// module.exports = class ImageRelativeProvider extends DBBaseProvider {
//   find({ userObjectId, archived, hashHexDecimal }) {
//     return new Promise((resolve, reject) => {
//       const condition = [
//         {
//           postedBy: userObjectId,
//           isArchive: archived || false,
//         },
//       ];

//       return Post.find({ $and: condition })
//         .populate('images')
//         .populate('videos')
//         .populate('postedBy', '-accessToken')
//         .$where(compare(hashHexDecimal, this.images.hashHexDecimal) < THRESHOLD)
//         .exec((err, post) => {
//           if (err) {
//             return reject(err);
//           }
//           return resolve(post);
//         });
//     });
//   }
// };
