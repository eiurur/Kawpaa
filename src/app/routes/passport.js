const path = require('path');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

require('dotenv').config();

const { logger } = require(path.resolve('logger'));
const SlackLogger = require(path.resolve('build', 'lib', 'utils', 'SlackLogger'));

const DatabaseProviderFactory = require(path.resolve('build', 'model', 'lib', 'DatabaseProviderFactory'));

module.exports = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TW_CK,
        consumerSecret: process.env.TW_CS,
        callbackURL: process.env.CALLBACK_URL,
      },
      (token, tokenSecret, profile, done) => {
        logger.info('User profile = ', profile);
        profile.twitter_token = token;
        profile.twitter_token_secret = tokenSecret;

        const user = {
          twitterIdStr: profile._json.id_str,
          name: profile.username,
          screenName: profile.displayName,
          icon: profile._json.profile_image_url_https,
          url: profile._json.url,
          description: profile._json.description,
          accessToken: token,
          accessTokenSecret: tokenSecret,
        };

        const userProvider = DatabaseProviderFactory.createProvider('User');
        userProvider
          .findOneAndUpdate({ user })
          .then((userInDb) => {
            logger.info(userInDb);
            return done(null, profile);
          })
          .catch((err) => {
            if (err) {
              new SlackLogger().send({ text: err }).catch((e) => {
                logger.info(e);
              });
              return logger.error(err);
            }
          });
      }
    )
  );

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  );
};
