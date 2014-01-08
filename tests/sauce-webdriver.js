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
      browserName:'android',
      platform:'Linux',
      'app-activity':'.Browser',
      'app-package':'com.android.browser',
      username:USER,
      accessKey:KEY,
      platform: 'Linux',
      version: '2.3'
    }, function(err, session, caps) {
      if (err) console.dir(err);
      else browser.get('http://brainsik.dev.saucelabs.net/test-guinea-pig2.html', function(err) {
        if (err) console.dir('getting url failed', err);
        else browser.waitForElementById('i_am_an_id', function(err) {
          if (err) console.dir('waiting for element failed', err);
          else {
            assert.ok(!err);
            browser.quit();
          }
        });
      });
    });
}

if (require.main === module) {
  module.exports(4723);
}
