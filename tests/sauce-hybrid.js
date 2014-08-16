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

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  browser.init({
    name:'Contact Manager Native Application Test on REAL S4',
    device:'Samsung Galaxy S4 Device',
    app:'http://s3.amazonaws.com/somen/HelloCordova-debug.apk',
    "app-activity": ".HelloCordova",
    "app-package": "io.cordova.hellocordova",
    username:USER,
    accessKey:KEY,
    platform: 'Linux',
    version: '4.3'
  }, function(err) {
    if (err) console.error('init err!', err);
    else {
      console.log('OMGZ DID THIS WORK?');
      browser.quit();
    }
  });
};

if (require.main === module) {
  module.exports(4723);
}
