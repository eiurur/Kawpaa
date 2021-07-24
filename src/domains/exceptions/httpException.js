const path = require('path');
require('dotenv').config();

class KawpaaException extends Error {
  constructor(message) {
    super(message);
  }
}

class KawpaaHttpException extends KawpaaException {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

exports.httpException = {
  BadRequest: () => new KawpaaHttpException('Bad Request', 400),
  Forbidden: () => new KawpaaHttpException('Forbidden', 403),
  NotFound: () => new KawpaaHttpException('Not Found', 404),
  FailedPixivAuthentication: () => new KawpaaHttpException('Failed Pixiv Authentication', 400),
  FailedSankakuComplexAuthentication: () => new KawpaaHttpException('Failed SankakuComplex Authentication', 400),
  FilseSizeOverLimit: () => new KawpaaHttpException(`Savable file size is up to ${process.env.MAX_UPLOADABLE_FILESIZE_MB}MB`, 480),
  UploadingRestrictedyMode: () => new KawpaaHttpException('Uploading is currently being restricted.', 580),
};
