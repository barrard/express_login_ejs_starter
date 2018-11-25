var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Landing Page',
    layout:"./layouts/landing.ejs"
    });
});

module.exports = router;
