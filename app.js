//GLOBAL
colors = require('colors');
logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})//GLOBAL

require('dotenv').config()

const createError = require('http-errors');
const express = require('express');

const path = require('path');
const passport = require('passport')


//init db connection with mongoose
const DB = require('./models/db.js')
const use_middleware = require('./middleware/use.js')

// const Local_Strategy = require('passport-local').Strategy;


const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();
const User = require('./models/user.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//MIDDLEWARE
use_middleware(app)




//Passport

const middleware = require('./middleware/route_middleware.js')





//Routers
app.use('/', indexRouter);
app.use('/user', userRouter);

//move to auth??
app.post('/register', async (req, res) => {
  require('./routes/auth/register.js')(req, res)
})


app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
async (req, res) => {
  require('./routes/auth/login.js')(req, res)
}); 


app.get('/login', (req, res)=>{
  res.render('login')

})
app.get('/register', (req, res)=>{
  res.render('register')

})
app.get('/logout', middleware.ensure_authenticated, (req, res) => {
  req.logOut();
  req.session.messages.push({ "info": "You are now logged out" })
  res.redirect('/')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
