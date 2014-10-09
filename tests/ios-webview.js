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
    deviceName:'iPhone Simulator',
    name:'ios webview',
    platformName:'iOS',
    app: '/Users/filmaj/src/hybrid/platforms/ios/build/HelloCordova.app',
    autoWebview:true,
    implicitWaitMs: 500
  }, function() {
    browser.windowHandles(function(err, handles) {
        if (err) console.error(err) && browser.quit();
        else browser.window(handles[0], function(err) {
            if (err) console.error(err) && browser.quit();
            else {
                browser.elementById('deviceready', function(err, el) {
                    if (err) console.error(err) && browser.quit();
                    else {
                        browser.quit();
                    }
                });
            }
        });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
