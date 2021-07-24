const path = require('path');

const { SPECIAL_HOSTNAME } = require(path.resolve('build', 'lib', 'constants'));

module.exports = class KawpaaHttpProxy {
  constructor(options = {}) {
    this.options = options;
  }

  setHeaders(hostname, referer) {
    let options = {};
    if (hostname.indexOf(SPECIAL_HOSTNAME.PIXIV_HOSTNAME) !== -1) {
      options = {
        headers: {
          referer: 'http://www.pixiv.net/',
        },
      };
    } else if (hostname.indexOf(SPECIAL_HOSTNAME.KOMIFLO_HOSTNAME) !== -1) {
      options = {
        headers: {
          referer: 'https://komiflo.com/',
        },
      };
    } else if (
      hostname.indexOf(SPECIAL_HOSTNAME.SANKAKUCOMPLEX_HOSTNAME) !== -1
    ) {
      options = {
        headers: {
          'User-Agent': 'Magic Browser',
          referer,
        },
      };
    } else if (hostname.indexOf('www.nijibox5.com') !== -1) {
      options = {
        headers: {
          referer: 'http://www.nijibox5.com/',
        },
      };
    } else {
      options = {
        headers: {
          'User-Agent': 'Magic Browser',
          referer,
        },
      };
    }
    this.options = { ...this.options, ...options };
  }

  execute(processer) {
    return processer.setOptions(this.options).execute();
  }
};
