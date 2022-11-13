const path = require('path');
const { SPECIAL_HOSTNAME } = require(path.resolve('build', 'lib', 'constants'));
const { my } = require(path.resolve('build', 'lib', 'my'));

module.exports = class KawpaaHttpProxy {
  constructor(options = {}) {
    this.options = options;
  }
  setUrl(hostname, url) {
    if (hostname.indexOf(SPECIAL_HOSTNAME.DANBOORU_HOSTNAME) !== -1) {
      const auth = { login: process.env.DANBOORU_USERNAME, api_key: process.env.DANBOORU_API_KEY };
      this.url = my.appendQueryString(url, auth);
    } else {
      this.url = url;
    }
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
    } else if (hostname.indexOf(SPECIAL_HOSTNAME.SANKAKUCOMPLEX_HOSTNAME) !== -1) {
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
    return processer.setUrl(this.url).setOptions(this.options).execute();
  }
};
