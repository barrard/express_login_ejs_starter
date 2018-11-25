var express = require('express');
var router = express.Router();
const RM = require('../../middleware/route_middleware.js')
const passport = require('passport')
// const path = require('path')
// const $ = path.join('',__dirname )
// logger.log($)

//move to auth??
router.post('/register', async (req, res) => {
  require('./register.js')(req, res)
})


router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
  }),
   (req, res) => {
    require('./login.js')(req, res)
  });


router.get('/login', (req, res) => {
  res.render('login')

})
router.get('/register', (req, res) => {
  res.render('register')

})
router.get('/logout', RM.ensure_authenticated, (req, res) => {
  req.logOut();
  req.session.messages.push({ "info": "You are now logged out" })
  res.redirect('/')
})

/* GET home page. */
.get('/login', [RM.ensure_authenticated], function (req, res, next) {
  res.render('login', {
    title: 'Login',
    layout: "_.ejs"
  });
});

module.exports = router;
