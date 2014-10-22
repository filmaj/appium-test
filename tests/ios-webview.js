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

  var error = function(msg, err) {
    console.error(msg, err);
    browser.quit();
  }

  browser.init({
    deviceName:'iPhone Simulator',
    name:'ios webview',
    platformName:'iOS',
    app: '/Users/filmaj/src/hybrid/platforms/ios/build/HelloCordova.app',
    autoWebview:true,
    implicitWaitMs: 1500
  }, function() {
    browser.elementById('deviceready', function(err, el) {
      if (err) error('cant get deviceready element', err);
      else {
        browser.setAsyncScriptTimeout(15000, function(err) {
          if (err) error('error setting timeout', err);
          else {
            var script = "var callback = arguments[arguments.length - 1];" +
            "var win = function(pos) { callback(pos); };" + 
            "var fail = function(err) { callback(err);};" +
            "navigator.geolocation.getCurrentPosition(win,fail);";
            browser.executeAsync(script, function(err, result) {
              if (err) error('couldnt execute script', err);
              else {
                console.log('Success! Got a script execute result.');
                console.log(result);
                browser.quit();
              }
            });
            setTimeout(function() { browser.acceptAlert(function(err) {
              if (err) error('error accepting alert', err);
              else setTimeout(function() { browser.acceptAlert(function(err) {
                if (err) error('error accepting second alert', err);
              }); }, 2000);
            }); }, 1000);
          }
        });
      }
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
