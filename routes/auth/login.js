// const passport = require('passport')

module.exports = function (req, res) {
  logger.log('login hit')
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  req.session.messages.push({ 'success': 'You are now logged in' })
  //  res.redirect('/edit-accounts/' + req.user.username);
  res.redirect('/');
  // res.redirect('/account-profile');
}
