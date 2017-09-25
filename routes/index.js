var express = require('express');
var router = express.Router();
var config = require('../config');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Landing' });
});

router.get('/login', function(req, res, next) {
  var redirect_url = config.auth_url+"?"+config.auth_params.map(x => x.parameter+"="+x.value).join('&');
  redirect_url += "&state=" + crypto.randomBytes(16).toString('hex');


  res.render('login', 
  { 
    title: 'Discord Login', 
    image: 'eve_sso',
    sender: req.query.sender + " login",
    redirect_url: redirect_url
  });
});

router.get('/auth', function(req, res, next) {
  res.render('auth',
  {
    title: 'Discord Auth',
    message: 'Auth Token:',
    code: req.query.code
  });
});

module.exports = router;
