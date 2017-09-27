let config = require('../config');
let crypto = require('crypto');

module.exports = function(app) {
  app.get('/login', function(req, res, next) {
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

  app.get('/auth', function(req, res, next) {
    res.render('auth',
    {
      title: 'Discord Auth',
      message: 'Auth Token:',
      code: req.query.code
    });
  });
}