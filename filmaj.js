var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors')
  , browser = wd.remote('localhost', 4723);

browser.on('status', function(info) {
  console.log(info.cyan);
});

browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

browser.init({
    device:'Android',
    app:'chrome'
  }, function() {

  browser.get("http://filmaj.ca", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('Fil Maj'), 'Wrong title!');
      browser.elementByLinkText('CV', function(err, el) {
        browser.clickElement(el, function() {
          browser.eval("window.location.href", function(err, href) {
            assert.ok(~href.indexOf('cv.html'));
            browser.quit();
          });
        });
      });
    });
  });
});
