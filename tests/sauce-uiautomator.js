var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var KEY = '';
var USER = '';
var HOST = '';
var PORT = 4444;

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

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and
  * expects that the address bar contains "cv.html".
  */

  browser.init({
      device:'Android',
      app:'http://saucelabs.com/example_files/ContactManager.apk',
      "app-package":"com.example.android.contactmanager",
      "app-activity":".ContactManager",
      username:USER,
      accessKey:KEY,
      platform: 'Linux',
      version: '4.2'
    }, function(err, session, caps) {
      if (err) console.dir(err);
      else browser.elementByName('Add Contact', function(err, el) {
          if (err) console.dir('error finding add contact', err);
          else el.click(function(err) {
              if (err) console.dir('error clicking add contact', err);
              assert.ok(!err);
              browser.quit();
          });
      });
  });
}

if (require.main === module) {
  module.exports(4723);
}
