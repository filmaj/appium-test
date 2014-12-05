var wd = require('wd'),
  assert = require('assert'),
  colors = require('colors');

var config = require('./fil-saucelabs-creds.json');

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

  var quit = function(msg, err) {
    console.error('msg', err);
    browser.quit();
  };

  browser.init({
      browserName:'Android',
      name:'Screenshot test for filmaj.ca',
      platform:'Linux',
      username:USER,
      accessKey:KEY,
      version: '4.3',
      deviceName: 'Android Emulator'
    }, function(err, session, caps) {
      if (err) quit('init error!', err);
      else browser.get('http://filmaj.ca', function(err) {
        if (err) quit('get error!', err);
        else browser.takeScreenshot(function(err, result) {
          if (err) quit('screen error!', err);
          else browser.elementByLinkText('CV', function(err, el) {
              if (err) quit('error getting cv link', err);
              else el.click(function(err) {
                  if (err) quit('error clicking cv link', err);
                  else browser.quit();
              });
          });
        });
      });
    });
};

if (require.main === module) {
  module.exports(4723);
}
