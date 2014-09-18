var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port, cb) {
  var browser = wd.remote('localhost', port);

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
    'browserName':'Browser',
    'platformName':'Android',
    'platformVersion':'4.3',
    'deviceName':'Samsung Galaxy S4 Device'
  }, function(err) {
    if (err) {
      console.error('There was an error starting the test:');
      console.error(err);
      console.error('This test requires running on an Android 4.4 device or emulator.');
    } else browser.get("http://filmaj.ca", function() {
      browser.title(function(err, title) {
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
