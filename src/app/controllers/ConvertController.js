const path = require('path');
const Twit = require('twit');

require('dotenv').config();

const { logger } = require(path.resolve('logger'));
const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));

module.exports = class ConvertController {
  static convertTweetIdToTweetInfo(req, res) {
    return seaquencer(req, res, ConvertController.fetchTWeet(req.params));
  }

  static fetchTWeet({ tweetId, user }) {
    logger.info('convertTweetIdToTweetInfo ===>');
    logger.info(tweetId, user.twitter_token, user.twitter_token_secret);
    const T = new Twit({
      consumer_key: process.env.TW_CK,
      consumer_secret: process.env.TW_CS,
      access_token: user.twitter_token,
      access_token_secret: user.twitter_token_secret,
    });
    return T.get(`statuses/show/${tweetId}`, {
      include_entities: true,
      embeddable: true,
      tweet_mode: 'extended',
    });
  }
};
