var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port) {
  var browser = wd.remote('localhost', port);

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  /*
  * This test loads the stock Android Settings application, 
  * clicks on a button labeled with "Sound", and then retrieves
  * an element with the "Volumes" name, expecting that it exists.
  */

  browser.init({
    device:'Android'
    , "app-activity": ".Settings"
    , "app-package": "com.android.settings"
  }, function() {
    browser.elementByName('Sound', function(err, el) {
      el.click(function(err) {
        browser.elementByName('Volumes', function(err, vol_el) {
          assert.ok(!err);
          assert.ok(vol_el);
          browser.quit();
        });
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
