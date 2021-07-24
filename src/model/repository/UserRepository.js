const path = require('path');

const { UserProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class UserRepository extends UserProvider {
  constructor(twitterIdStr) {
    if (twitterIdStr == null) {
      twitterIdStr = null;
    }
    super(...arguments);
    this.twitterIdStr = twitterIdStr;
  }

  setUser(user) {
    return (this.user = user);
  }

  getUser(user) {
    return this.user;
  }

  setTwitterIdStr(twitterIdStr) {
    return (this.twitterIdStr = twitterIdStr);
  }

  getTwitterIdStr(twitterIdStr) {
    return this.twitterIdStr;
  }

  __findByTwitterIdStr() {
    return this.findByTwitterIdStr({ twitterIdStr: this.twitterIdStr });
  }

  __findByAccessToken(accessToken) {
    return this.findByAccessToken({ accessToken });
  }
};
