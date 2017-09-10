var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  var redirect_url = config.auth_url+"?"+config.auth_params.map(x => x.parameter+"="+x.value).join('&');
  redirect_url += "&state=uniquestate123";

  res.render('login', 
  { 
    title: 'Please Login', 
    image: 'eve_sso',
    redirect_url: redirect_url
  });
});

router.get('/auth', function(req, res, next) {
  res.render('auth',
  {
    title: 'Authd',
    code: req.query.code
  });
});

https://login.eveonline.com/oauth/authorizeclient_id=2c76df7cec724a85acf6f0ced3f55a45&redirect_uri=http://localhost:3000/auth&response_type=code&scope=


module.exports = router;
