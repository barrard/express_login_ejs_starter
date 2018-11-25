require('dotenv').config()
const db_name = process.env.DB_NAME

const express = require('express');
const helmet = require('helmet')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const express_layouts = require('express-ejs-layouts')
const path = require('path');
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const express_validator = require('express-validator')
const csurf = require('csurf');



module.exports = (app)=>{
  app.use(helmet())

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express_layouts)


  //SESSION OPTIONS
  const mongo_store = new mongoStore({ url: `mongodb://localhost/${db_name}` })
  const session_options = {
    store: mongo_store,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
      //   secure: false,//this is the default setting
      //   httpOnly: true,//this is on by default
      expires: new Date(253402300000000) //last loooong time
    }
  }
  if (process.env.NODE_ENV == "production") session_options.cookie.secure = true

  const session_middlesware = session(session_options)
  app.use(session_middlesware);

  const passport_auth = require('./auth.js')(session_options, app)

  app.use(csurf())
  app.use(function (err, req, res, next) {
    logger.log('csrf_token'.bgWhite)
    // logger.log(req.csrfToken())
    logger.log(err)
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
  })
  //express validator
  app.use(express_validator({
    errorFormatter: function (param, msg, value) {
      let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  }));
  app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.session_messages = req.session.messages
    req.session.messages = []
    res.locals.csrf_token_function = req.csrfToken
    next()
  })

  
}