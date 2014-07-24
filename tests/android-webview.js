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

  browser.init({
    device:'selendroid',
    app:'/Users/filmaj/src/hybrid/platforms/android/bin/HelloCordova-debug.apk'
    , "app-package": "io.cordova.hellocordova"
    , "app-activity": ".HelloCordova"
  }, function(err) {
    if (err) console.error(err);
    else browser.window('WEBVIEW', function(err, handles) {
        if (err) console.error(err) && browser.quit();
        else browser.elementById('deviceready', function(err, el) {
            if (err) console.error(err) && browser.quit();
            else {
                assert.ok(el);
                browser.quit();
            }
        });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
