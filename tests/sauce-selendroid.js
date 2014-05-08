var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var config = require('./fil-stew-creds.json');

var KEY = config.KEY;
var USER = config.USER;
var HOST = config.HOST;
var PORT = config.PORT;

module.exports = function(port, cb) {
  var browser = wd.remote({
      host: HOST,
      port: PORT,
      username: USER,
      accessKey: KEY
  });

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  browser.init({
    "name":"Android Selendroid Test on Note2",
    "device":"Galaxy Note2 Emulator",
    app:'http://saucelabs.com/example_files/selendroid-test-app-0.6.0-SNAPSHOT.apk',
    "app-package":"io.selendroid.testapp",
    "app-activity":".HomeScreenActivity",
    username:USER,
    accessKey:KEY,
    platform: 'Linux',
    version: '4.3'
    }, function(err, session, caps) {
      if (err) console.dir(err);
      else browser.setImplicitWaitTimeout(10000, function(err) {
          if (err) console.dir('error setting timeout');

          else /*browser.elementById('buttonStartWebView', function(err, el) {
              if (err) console.dir('error finding buttonstartwebview', err);
              else el.click(function(err) {
                  if (err) console.dir('error clicking buttonstartwebview', err);
                  browser.elementByClassName('android.webkit.WebView', function(err, el) {
                      if (err) console.dir('error getting webview', err);
                      else {
                          assert.ok(el);
                          browser.quit();
                      }
                  });
              });
          });
          */
            browser.quit();
      });
  });
}

if (require.main === module) {
  module.exports(4723);
}
