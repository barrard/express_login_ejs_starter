const passport = require('passport')
const User = require('../../models/user.js')
// const LocalStrategy = require('passport-local').Strategy

module.exports = async function(req, res){
  const {
    email,
    password,
    confirm_password
  } = req.body
  logger.log({
    email,
    password,
    confirm_password
  })

  //validator
  req.checkBody('email', 'Email address is required').notEmpty()
  req.checkBody('email', 'Email address is not valid').isEmail()
  req.checkBody('password', 'Passwords field is require').notEmpty()
  req.checkBody('confirm_password', 'Passwords do not match').equals(password)
  //Check erros
  const errors = await req.validationErrors()

  if (errors) {
    logger.log('errors'.bgRed)
    logger.log(errors)
    // [ { param: 'confirm_password',
    // msg: 'Password do not match',
    // value: '1' } ] 
    errors.forEach(err => {
      req.session.messages.push({ "danger": err.msg })
    });

    logger.log('errors')
    res.redirect('/auth/register')

  } else {
    try {
      logger.log('no errors'.bgGreen)
      let user = await User.findOne({
        email: email
      })
      if (user) {
        logger.log('Got a user with that email already'.bgRed)
        const errors = [{
          danger: 'Email is already taken.'
        }]
        req.session.messages = [...errors]
        res.redirect('/auth/register')
      } else {
        logger.log('no user with this email yet'.bgGreen)
        const new_user = new User({
          email: email,
          password: password,
        })
        let user = await User.create_user(new_user)
        logger.log(user)
        passport.authenticate('local', {
          failureRedirect: '/auth/register',
          //WTF IS THIS MADNESS
        })(req, res, function () {

          //////////////TODO  Wrap this in a function somewhere ///////////////////////////
          // let token = require('./server_modules/utils').generate_token()
          // req.session.email_token = token
          // sendgrid.verify_email(email, req.session.email_token, process.env.VERIFY_EMAIL_URL)
          //////////////TODO  Wrap this in a function somewhere ///////////////////////////
          res.redirect('/');
          // res.redirect('/account-profile');
        })
      }
    } catch (err) {
      logger.log('err'.bgRed)
      logger.log(err)
      req.session.messages.push({ 'danger': `Sorry an error occured trying to register ${email}` })
      res.redirect('/auth/register');

    }
  }
}