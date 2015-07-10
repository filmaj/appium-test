var wd = require('wd'),
    assert = require('assert'),
    colors = require('colors');

/*
 * Uses a cordova application! Super easy to get one going:
 *   - npm install -g cordova
 *   - cordova create hybrid
 *   - cd hybrid
 *   - cordova platform add android
 *   - cordova build
 *   use the final path to the output apk in the `app` config option below
 */

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

  browser.init({
    platformName:'Android',
    platformVersion:'4.3',
    deviceName:'Android Emulator',
    autoWebview:true,
    app:'/Users/filmaj/src/hybrid/platforms/android/build/outputs/apk/android-debug.apk',
    "app-activity": ".HelloCordova",
    "app-package": "io.cordova.hellocordova",
  }, function(err) {
    if (err) console.error('init err!', err);
    else {
      browser.setImplicitWaitTimeout(5000, function(err) {
        if (err) error('couldnt set wait', err);
        else browser.elementById('deviceready', function(err, input) {
            if (err) error('cant get input',err);
            else browser.quit();
          });
      });
    }
  });
};

if (require.main === module) {
  module.exports(4723);
}
