const path = require('path');

const { logger } = require(path.resolve('logger'));
const { UserRepository } = require(path.resolve(
  'build',
  'model',
  'repository',
));

module.exports = {
  getUser(req, res, next) {
    new UserRepository(req.session.passport.user._json.id_str)
      .__findByTwitterIdStr()
      .then((user) => {
        logger.info('======> userRepository.__findByTwitterIdStr user ', user);
        if (!user) {
          return res
            .status(400)
            .send({ message: '該当のユーザは存在しません' });
        }
        req.user = user;
        return next();
      });
  },

  checkRegistrable(req, res, next) {
    const token = req.body.token || req.query.token;
    logger.info('[checkRegistrable] token: ', token);
    if (token) {
      new UserRepository().__findByAccessToken(token).then((user) => {
        logger.info('======> findByAccessToken user ', user);
        if (!user) {
          return res
            .status(401)
            .send('A token is invalid. \nCould you check it again.');
        }
        logger.info('next()');
        req.user = user;
        return next();
      });
    } else {
      if (!req.session || !req.session.passport) {
        return res
          .status(401)
          .send(
            'This session has expired. \n Could you re-login to https://kawpaa.eiurur.xyz, \n or register a token to option page of chrome extension?',
          );
      }
      new UserRepository(req.session.passport.user._json.id_str)
        .__findByTwitterIdStr()
        .then((user) => {
          logger.info(
            '======> userRepository.__findByTwitterIdStr user ',
            user,
          );
          if (!user) {
            return res.status(401).send('The user does not exist.');
          }
          req.user = user;
          return next();
        })
        .catch((e) => {
          logger.info('[checkRegistrable] ERROR: userRepository.find', e);
          return res
            .status(403)
            .send(e);
        });
    }
  },
};
