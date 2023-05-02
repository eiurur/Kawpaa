const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
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

  // passport.use(
  //   'local-signup',
  //   new LocalStrategy(
  //     {
  //       usernameField: 'email',
  //       passwordField: 'password',
  //       passReqToCallback: true,
  //     },
  //     async (req, email, password, done) => {
  //       const userProvider = ModelProviderFactory.create('user');
  //       const user = await userProvider.findOne({ email: email });
  //       console.log(user);
  //       try {
  //         if (user) {
  //           const isMatch = await user.comparePassword(password, user.salt);
  //           if (isMatch) {
  //             return done(null, user);
  //           }
  //         }
  //         const newUser = new userProvider.schema();
  //         newUser.email = email;
  //         newUser.password = password;
  //         newUser.token = token;
  //         await newUser.save(newUser);
  //         return done(null, newUser);
  //       } catch (err) {
  //         if (err) return done(err);
  //       }
  //     }
  //   )
  // );

  // passport.use(
  //   'local-signin',
  //   new LocalStrategy(
  //     {
  //       usernameField: 'email',
  //       passwordField: 'password',
  //       passReqToCallback: true,
  //     },
  //     async (req, email, password, done) => {
  //       try {
  //         const userProvider = ModelProviderFactory.create('user');
  //         console.log(email, password);
  //         const user = await userProvider.findOne({ email: email });
  //         if (user) {
  //           const isMatch = await user.comparePassword(password, user.salt);
  //           if (isMatch) {
  //             console.log(user);
  //             return done(null, user);
  //           }
  //         }
  //         return done(null, false, { message: 'ログインに失敗しました。' });
  //       } catch (err) {
  //         console.log(err);
  //         if (err) return done(err);
  //       }
  //     }
  //   )
  // );

  passport.use(
    'token-signin',
    new LocalStrategy(
      {
        usernameField: 'token',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, token, password, done) => {
        try {
          const userProvider = DatabaseProviderFactory.createProvider('User');
          const user = await userProvider.findOne({ accessToken: token });
          logger.info(token, password);
          if (user) {
            user.twitter_token = user.accessToken;
            user.twitter_token_secret = user.accessTokenSecret;
            return done(null, user);
          }
          return done(null, false, { message: 'ログインに失敗しました。' });
        } catch (err) {
          logger.info(err);
          if (err) return done(err);
        }
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

  // app.post(
  //   '/auth/signup',
  //   passport.authenticate('local-signup', {
  //     successRedirect: '/',
  //     // failureRedirect: '/login',
  //     failWithError: true,
  //     session: true,
  //   })
  // );
  // app.post(
  //   '/auth/signinWithEmail',
  //   passport.authenticate('local-signin', {
  //     successRedirect: '/',
  //     // failureRedirect: '/login',
  //     failWithError: true,
  //     session: true,
  //   })
  // );
  app.post(
    '/auth/signinWithToken',
    passport.authenticate('token-signin', {
      successRedirect: '/api/sessions',
      // failureRedirect: '/login',
      failWithError: true,
      session: true,
    })
  );
  app.post('/api/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
  });
};
