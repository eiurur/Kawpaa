const cluster = require('cluster');
const path = require('path');
const createListener = require('./express');
const createServer = require('./server');
const numCPUs = require('os').cpus().length;

const { logger } = require(path.resolve('logger'));

process.on('uncaughtException', (err) => {
  logger.info(err);
});

(async () => {
  /**
   * Application
   */
  const listener = createListener();

  /**
   * routes, session
   */
  require('./routes/passport')(listener);
  require('./routes/api')(listener);
  require('./routes/routes')(listener);

  /**
   * Server
   */
  if (process.env.NODE_ENV === 'production' && cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
      cluster.on('disconnect', () => {
        logger.info('disconnect!');
        cluster.fork();
      });
    }
  } else {
    const server = await createServer(listener);
    server.listen(listener.get('port'), '0.0.0.0', () => {
      logger.info(`Express HTTPS server listening on port ${listener.get('port')}`);
    });
  }
})();
