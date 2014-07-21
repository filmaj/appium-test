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

  var error = function(msg, err) {
      console.error('ERROR! ' + (msg?msg:''), (msg?err:msg));
      browser.quit();
  };

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  browser.init({
    "name":"Android Selendroid Test w/ Appium 1.0",
    "deviceName":"Android Emulator",
    app:'http://saucelabs.com/example_files/selendroid-test-app-0.6.0-SNAPSHOT.apk',
    "appPackage":"io.selendroid.testapp",
    "appActivity":".HomeScreenActivity",
    username:USER,
    accessKey:KEY,
    platformName: 'Android',
    platformVersion: '4.4',
    automationName:'Selendroid',
    appiumVersion:"0.18.2"
    }, function(err, session, caps) {
      if (err) error(err);
      else browser.setImplicitWaitTimeout(10000, function(err) {
          if (err) error('error setting timeout', err);

          browser.elementById('buttonStartWebView', function(err, el) {
              if (err) error('error finding buttonstartwebview', err);
              else el.click(function(err) {
                  if (err) error('error clicking buttonstartwebview', err);
                  browser.elementByClassName('android.webkit.WebView', function(err, el) {
                      if (err) error('error getting webview', err);
                      else browser.window('WEBVIEW', function(err) {
                          if (err) error('error getting window WEBVIEW', err);
                          else browser.elementById('name_input', function(err, el) {
                              if (err) error('error getting name_input', err);
                              else el.clear(function(err) {
                                  if (err) error('error clearing input!', err);
                                  else el.type('Test string', function(err) {
                                      if (err) error('error typing', err);
                                      else el.text(function(err, text) {
                                          if (err) error('error getting text', err);
                                          else {
                                              assert(text.toLowerCase(), 'test string');
                                              browser.elementByCssSelector('input[type=submit]', function(err, submit_el) {
                                                  if (err) error('error getting input[type=submit]');
                                                  else browser.quit();
                                              });
                                          }
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
}

if (require.main === module) {
  module.exports(4723);
}
