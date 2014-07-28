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

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and 
  * expects that the address bar contains "cv.html".
  */

  browser.init({
      browserName: 'Chrome',
      deviceName: 'Samsung Galaxy S4 Device',
      platformName: 'Android',
      platformVersion: '4.3'
    }, function() {
    browser.get("http://filmaj.ca", function() {
      browser.title(function(err, title) {
        if(err) {
          console.log(err);
          return;
        }
        assert.ok(~title.indexOf('Fil Maj'), 'Wrong title!');
        browser.elementByLinkText('CV', function(err, el) {
          browser.clickElement(el, function() {
            browser.eval("window.location.href", function(err, href) {
              assert.ok(~href.indexOf('cv.html'));
              browser.quit();
              if (cb) cb();
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
