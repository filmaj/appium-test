var wd = require('wd'),
    assert = require('assert'),
    colors = require('colors');

var config = require('./fil-stew-creds.json');

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

module.exports = function(port, cb) {
  var browser = wd.remote({
      host: HOST,
      port: PORT,
      username: USER,
      accessKey: KEY
  });

  var error = function(msg, err) {
    console.error(msg, err);
    browser.quit();
  };

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  browser.init({
    name:'Hybrid app test on REAL S4, over SC, to http://custom:8000',
    device:'Samsung Galaxy S4 Device',
    app:'http://s3.amazonaws.com/somen/HelloCordova-debug.apk',
    "app-activity": ".HelloCordova",
    "app-package": "io.cordova.hellocordova",
    username:USER,
    accessKey:KEY,
    platform: 'Linux',
    version: '4.3'
  }, function(err) {
    if (err) error('init err!', err);
    else {
      browser.setImplicitWaitTimeout(25000, function(err) {
        if (err) error('wait timeout err!', err);
        else setTimeout(function() {
          browser.contexts(function(err, cs) {
            if (err) error('error getting contexts!', err);
            else {
              console.log('contexts:', cs);
              browser.context(cs[0], function(err) {
                if (err) error('error setting context!', err);
                else browser.source(function(err, source) {
                  if (err) error('error getting page source!', err);
                  else browser.quit();
                });
              });
            }
          });
        }, 20000);
      });
    }
  });
};

if (require.main === module) {
  module.exports(4723);
}
