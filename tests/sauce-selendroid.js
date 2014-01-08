var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var KEY = '';
var USER = '';
var HOST = '';
var PORT = 4444;

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

  /*
  * This test loads up Fil's homepage, checks that the title matches
  * some standard expectation, clicks on a link labeled "CV" and
  * expects that the address bar contains "cv.html".
  */

  browser.init({
      device:'Android',
      app:'http://saucelabs.com/example_files/selendroid-test-app-0.6.0-SNAPSHOT.apk',
      "app-package":"io.selendroid.testapp",
      "app-activity":".HomeScreenActivity",
      username:USER,
      accessKey:KEY,
      platform: 'Linux',
      version: '2.3'
    }, function(err, session, caps) {
      if (err) console.dir(err);
      else browser.elementById('buttonStartWebView', function(err, el) {
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
  });
}

if (require.main === module) {
  module.exports(4723);
}
