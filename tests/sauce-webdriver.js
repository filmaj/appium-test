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
      browserName:'android',
      platform:'Linux',
      "device-type":"tablet",
      "device-orientation":"landscape",
      username:USER,
      accessKey:KEY,
      version: '4.3'
    }, function(err, session, caps) {
      if (err) console.error(err);
      else browser.get('http://brainsik.dev.saucelabs.net/test-guinea-pig2.html', function(err) {
        if (err) console.error('getting url failed', err);
        else browser.waitForElementById('i_am_an_id', function(err) {
          if (err) console.error('waiting for element failed', err);
          else {
            browser.execute('return document.documentElement.clientHeight', function(err, result) {
              if (err) console.error('getting clientHeight', err);
              else {
                var height = result;
                browser.execute('return document.documentElement.clientWidth', function(err, result) {
                  if (err) console.error('getting clientWidth', err);
                  else {
                    var width = result;
                    assert.ok(width >= height, 'in landscape mode, width is supposed to be higher than height');
                    browser.quit();
                  }
                });
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
