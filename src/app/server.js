const fs = require('fs');
const path = require('path');
const { my } = require(path.resolve('build', 'lib', 'my'));

module.exports = (listener) => {
  try {
    if (my.toBoolean(process.env.FORCE_HTTP)) throw new Error('Forcing HTTP');

    const hskey = fs.readFileSync(path.resolve('keys', 'server.key'));
    const hscert = fs.readFileSync(path.resolve('keys', 'server.crt'));

    const httpsOptions = {
      key: hskey,
      cert: hscert,
    };
    const { createServer } = require('https');
    return createServer(httpsOptions, listener);
  } catch (e) {
    const { createServer } = require('http');
    return createServer(listener);
  }
};
