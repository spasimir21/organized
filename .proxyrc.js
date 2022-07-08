module.exports = app => {
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
};
