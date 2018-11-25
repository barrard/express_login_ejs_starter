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


//init db connection with mongoose
const DB = require('./models/db.js')

//use middleware from this files
const use_middleware = require('./middleware/use.js')

// const Local_Strategy = require('passport-local').Strategy;


const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth/index.js');


const app = express();
const User = require('./models/user.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

//MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')));
use_middleware(app)




//Route Middleware
const RM = require('./middleware/route_middleware.js')





//Routers
app.use('/', indexRouter);
//Passport auth
app.use('/auth', authRouter);
app.use('/user', userRouter);



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
