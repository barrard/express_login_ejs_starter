module.exports = {
  ensure_authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    logger.log('non-authenticated user being redirected'.bgWhite)
    res.redirect('/login')

  }
}
