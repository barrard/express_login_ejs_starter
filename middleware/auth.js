const Local_Strategy = require('passport-local').Strategy;
const User = require('../models/user.js')
module.exports = function(passport) {


  //PASSPORT FUNCTIONS
  passport.serializeUser(function (user, done) {
    logger.log('serializeUser')
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    logger.log('deserializeUser')
    User.get_user_by_id(id, function (err, user) {
      done(err, user);
    });
  });


  //PASSPORT LOCAL METHOD
  passport.use('local', new Local_Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    logger.log('looking up user ' + email)
    try {
      let user = await User.get_user_by_email(email)
      if (!user) throw 'No user found'
      let is_match = await User.compare_password(password, user.password)
      logger.log(is_match)
      if (is_match) {
        logger.log('got a match'.bgMagenta)
        return done(null, user);
      } else {
        logger.log('not a match'.bgMagenta)
        throw 'Passwords do not match'
      }
    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      req.session.messages.push({ "danger": `Invalid credentials` })
      return done(null, false)
    }
  }))

  
}
