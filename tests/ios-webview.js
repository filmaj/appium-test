var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

/*
 * Uses a cordova application! Super easy to get one going:
 *   - npm install -g cordova
 *   - cordova create hybrid
 *   - cd hybrid
 *   - cordova platform add ios
 *   - cordova build
 *   use the final path to the output .app in the `app` config option below
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
  }

  browser.init({
    deviceName:'iPhone 5',
    name:'ios webview',
    platformName:'iOS',
    platformVersion:'8.4',
    autoWebview:true,
    app: '/Users/filmaj/src/hybrid/platforms/ios/build/emulator/HelloCordova.app'
  }, function(err) {
    if (err) error('cant init', err);
    else browser.elementById('deviceready', function(err, el) {
      if (err) error('cant get deviceready element', err);
      else browser.quit();
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
