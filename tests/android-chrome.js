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

  var error = function(msg, err) {
    console.error(msg, err);
    browser.quit();
  }

  browser.init({
      deviceName:'Nexus 5',
      platformName:'Android',
      browserName:'Chrome',
  }, function(err) {
    if (err) error('error initing', err);
    else browser.get("http://filmaj.ca", function(err) {
      if (err) error('error getting url', err);
      else browser.title(function(err, title) {
        if (err) error('error getting title', err);
        else browser.quit();
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
