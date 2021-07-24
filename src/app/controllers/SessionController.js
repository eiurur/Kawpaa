const path = require('path');

const DatabaseProviderFactory = require(path.resolve(
  'build',
  'model',
  'lib',
  'DatabaseProviderFactory',
));

module.exports = class SessionController {
  static async get(req, res) {
    try {
      const session = req.session.passport.user;

      if (typeof session === 'undefined') {
        throw new Error('you have not session');
      }

      const params = { twitterIdStr: session._json.id_str };
      const userProvider = DatabaseProviderFactory.createProvider('User');
      const user = await userProvider.findByTwitterIdStr(params);
      res.send(Object.assign(session, { userObjectId: user._id }));
    } catch (err) {
      res.status(401).send(err);
    }
  }
};
