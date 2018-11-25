//passport is like auth middlware
const passport = require('passport')
//we are defining a local strategy here
const Local_Strategy = require('passport-local').Strategy;
const User = require('../models/user.js')
module.exports = function(session_options, app) {

//init passport
  app.use(passport.initialize())
//set session options
  //SESSION OPTIONS
  // const mongo_store = new mongoStore({ url: `mongodb://localhost/${db_name}` })
  // const session_options = {
  //   store: mongo_store,
  //   secret: process.env.SESSION_SECRET,
  //   saveUninitialized: true,
  //   resave: true,
  //   cookie: {
  //     //   secure: false,//this is the default setting
  //     //   httpOnly: true,//this is on by default
  //     expires: new Date(253402300000000) //last loooong time
  //   }
  // }
  // if (process.env.NODE_ENV == "production") session_options.cookie.secure = true
  app.use(passport.session(session_options))

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
  //local strategy defined 
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
