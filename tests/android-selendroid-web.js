var wd = require('wd'),
  assert = require('assert'),
  colors = require('colors');


module.exports = function(port, cb) {
  var browser = wd.remote('localhost', port);

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  var error = function(msg, err) {
      console.error(msg, err);
      browser.quit();
  };

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and 
  * expects that the address bar contains "cv.html".
  */

  browser.init({
    'browserName':'android',
    'platformVersion':'18',
    'emulator':true
  }, function(err) {
    if (err) {
      console.error('There was an error starting the test:');
      console.error(err);
    } else browser.get("http://filmaj.ca", function(err) {
        if (err) error('could not get site', err);
        else browser.takeScreenshot(function(err, screen) {
            if (err) error('could not take screenshot', err);
            else {
                console.log(screen);
                browser.quit();
            }
        });
    });
  });
};

if (require.main === module) {
  module.exports(4444);
}
