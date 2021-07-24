const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const compression = require('compression');
const MongoStore = require('connect-mongo');
const { logger } = require(path.resolve('logger'));

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

// application
module.exports = () => {
  const options = {
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collection: 'sessions',
      ttl: 60 * 60 * 24 * 30,
      auto_reconnect: true,
    }),
  };
  const corsOption = {
    origin: '*',
  };

  // https://expressjs.com/ja/guide/error-handling.html
  function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      logger.error('Express clientErrorHandler => req.xhr. status code: 500, err: ', err);
      res.status(500).send({ error: err });
    } else {
      logger.error('Express clientErrorHandler => not req.xhr. err: ', err);
      next(err);
    }
  }
  function errorHandler(err, req, res, next) {
    logger.error('Express errorHandler => status code: 500, err: ', err);
    res.status(500);
    res.render('error', { error: err });
  }

  const app = express();
  app.disable('x-powered-by');
  app.set('port', process.env.PORT);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(cookieParser());
  app.use(bodyParser.json({ extended: true, limit: '256mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '256mb' }));
  app.use(cors(corsOption));
  app.use(methodOverride());
  app.use(session(options));
  app.use(compression({ level: 9 }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(clientErrorHandler);
  app.use(errorHandler);
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  // development only
  if (env === 'development') {
    app.use('/data', express.static(path.join(__dirname, '..', '..', 'data')));
    app.use(express.static(path.join(__dirname, 'public')));
    require('./background/development')(app);
  }

  // production only
  if (env === 'production') {
    const cacheOptions = {
      dotfiles: 'ignore',
      etag: true,
      extensions: ['css', 'js', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm', 'avi'],
      index: false,
      maxAge: 86400000 * 30 * 12, // 12ヶ月
      redirect: false,
      setHeaders(res, path, stat) {
        res.set({ 'x-timestamp': Date.now() });
      },
    };

    app.use('/data', express.static(path.join(__dirname, '..', '..', 'data'), cacheOptions));
    app.use(express.static(path.join(__dirname, 'public'), cacheOptions));
    require('./background/production')(app);
  }

  return app;
};
