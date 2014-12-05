var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var config = require('./fil-saucelabs-creds.json');

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

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and 
  * expects that the address bar contains "cv.html".
  */

  browser.init({
    name:'Lollipop Stock Browser Test filmaj.ca',
    browserName: 'Browser',
    platformName: 'Android',
    platformVersion: '5.0',
    deviceName:'Android Emulator',
    'appium-version':'1.3.1'
  }, function(err) {
    if (err) error('error initing!', err);
    else browser.get("http://filmaj.ca", function(err) {
      if (err) error('error getting filmaj.ca', err);
      else browser.title(function(err, title) {
        if (err) error('error getting title!', err);
        else browser.elementByLinkText('CV', function(err, el) {
          if (err) error('error getting CV link', err);
          else browser.clickElement(el, function() {
            if (err) error('error clicking element', err);
            else browser.eval("window.location.href", function(err, href) {
              if (err) error('error evaling location', err);
              else {
                browser.quit();
                if (cb) cb();
              }
            });
          });
        });
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
