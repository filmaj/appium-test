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

  var error = function(err, msg) {
    console.error(msg, err);
    browser.quit();
  };

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and 
  * expects that the address bar contains "cv.html".
  */

  browser.init({
    'browserName':'Browser',
    'platformName':'Android',
    'deviceName':'Android Emulator'
  }, function(err) {
    if (err) error(err, 'could not load appium the fuck?');
    else browser.get("http://maps.google.com", function(err) {
      if (err) error(err, 'could not load google maps');
      else browser.title(function(err, title) {
        if (err) error(err, 'could not get title');
        else browser.contexts(function(err, cs) {
          if (err) error(err, 'could not get contexts');
          else browser.context(cs[0], function(err, context) {
            if (err) error(err, 'could not set context to ' + cs[0]);
            else {
              console.log('set context to ' + cs[0]);
              browser.elementByAndroidUIAutomator('new UiSelector().text("Share location")', function(err, el) {
                if (err) error(err, 'could not find element with "share location" as text');
                else el.click(function(err) {
                  if (err) error(err, 'could not click share location element');
                  else browser.context(cs[1], function(err, context) {
                    if (err) error(err, 'error changing context back to web');
                    else browser.quit();
                  });
                });
              });
            }
          });
        });
      });
    });
  });
};

if (require.main === module) {
  module.exports(4723);
}
