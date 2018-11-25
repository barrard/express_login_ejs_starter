var express = require('express');
var router = express.Router();
const RM = require('../middleware/route_middleware.js')


/* GET home page. */
router.get('/', [RM.ensure_authenticated], function (req, res, next) {
  res.render('user', { 
    title: 'User',
    layout: "./layouts/main.ejs"
  });
});

module.exports = router;
