var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var config = require('./fil-stew-creds.json');

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

module.exports = function(port, cb) {
  var browser = wd.remote({
    host:HOST,
    port:PORT,
    username:USER,
    accessKey:KEY
  });

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  var error = function(msg, err) {
      console.error(msg, err);
      browser.quit();
  }

  browser.init({
      name:'Chrome-For-Android Test over SC on a REAL Samsung S4',
      browserName: 'Chrome',
      deviceName: 'Samsung Galaxy S4 Device',
      platformName: 'Android',
      platformVersion: '4.4',
      'appium-version':'1.2.2'
  }, function(err) {
    if (err) error('error initing', err);
    else browser.get("https://172.16.30.32:8000", function(err) {
      if (err) error('error getting url', err);
      else browser.title(function(err, title) {
        if(err) error('error getting title', err);
        else browser.quit();
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
