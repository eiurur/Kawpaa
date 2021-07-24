module.exports = (app) => {
  app.get('/logout', (req, res) => {
    if ((req.session != null ? req.session.id : undefined) == null) {
      return;
    }
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

  // serve index and view partials
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/partials/:name', (req, res) => {
    res.render(`partials/${req.params.name}`);
  });

  // redirect all others to the index (HTML5 history)
  app.get('*', (req, res) => {
    res.render('index');
  });
};
