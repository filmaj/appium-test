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
    app:'http://saucelabs.com/example_files/selendroid-test-app-0.6.0-SNAPSHOT.apk'
    , "app-package": "io.selendroid.testapp"
    , "app-activity": ".HomeScreenActivity"
  }, function() {
    browser.elementById('buttonStartWebView', function(err, el) {
      if (err) console.error('get webview button', err);
      else el.click(function(err) {
        if (err) console.error('webview btn click', err);
        else {
          browser.window('WEBVIEW', function(err) {
            if (err) console.error('window switch', err);
            else browser.elementById('name_input', function(err, el) {
              if (err) console.error('name input', err);
              else el.clear(function(err) {
                if (err) console.error('input clear', err);
                else el.type('Test string', function(err) {
                  if (err) console.error('name type', err);
                  else el.text(function(err, text) {
                    if (err) console.error('name text', err);
                    else {
                      assert.equal(text, 'Test string');
                      browser.quit();
                      if (cb) cb();
                    }
                  });
                });
              });
            });
          });
        }
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
