module.exports = (app) => {
  require('./v1/publics')(app);
  require('./v1/sessions')(app);
  require('./middlewares/session')(app);
  require('./v1/dashboard')(app);
  require('./v1/transport')(app);
  require('./v1/dones')(app);
  require('./v1/posts')(app);
  require('./v1/stats')(app);
  require('./v1/unearth')(app);
  require('./v1/favorites')(app);
};
