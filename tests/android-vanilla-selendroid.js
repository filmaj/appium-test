var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port, cb) {
  var browser = wd.remote('localhost', port);

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
    aut:'io.selendroid.testapp:0.10.0',
    emulator:true,
    platformVersion:'19'
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
                              else el.click(function(err) {
                                  if (err) error('error clicking input before clearing', err);
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
  });
}

if (require.main === module) {
  module.exports(4444);
}
