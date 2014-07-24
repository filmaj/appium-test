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

  var error = function(msg, err) {
    if (err) console.error(msg, err);
    else console.error(msg);
    browser.quit();
  };

  /*
    app:'http://saucelabs.com/example_files/ContactManager.apk',
    "app-activity": ".ContactManager",
    "app-package": "com.example.android.contactmanager",
   */
  browser.init({
    name:'Orientation Test on KitKat Emulator',
    device:'Android Emulator',
    'device-orientation':'landscape',
    app:'http://saucelabs.com/example_files/ContactManager.apk',
    "app-activity": ".ContactManager",
    "app-package": "com.example.android.contactmanager",
    username:USER,
    accessKey:KEY,
    platform: 'Linux',
    version: '4.3'
  }, function(err) {
    if (err) error('init err!', err);
    else browser.getWindowSize(function(err, size) {
      if (err) error('getting window size err!', err);
      else {
        console.log('Got Window Size:');
        console.dir(size);
        browser.getOrientation(function(err, orient) {
          if (err) error('getting orientation err!', err);
          else {
            console.log('Got Orientation:');
            console.dir(orient);
          }
        });
      }
    });
  });
};

if (require.main === module) {
  module.exports(4723);
}
