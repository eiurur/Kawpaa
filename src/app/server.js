const fs = require('fs');
const path = require('path');

module.exports = (listener) => {
  try {
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
