var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port, cb) {
  var brower = wd.remote('localhost', port);

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
    'browserName': 'android',
    'version': '4.0',
    'platform': 'Linux',
    'device-orientation': 'portrait'
  }, function() {
    browser.get("http://filmaj.ca", function() {
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
