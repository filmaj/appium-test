var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

var config = require('./mike-saucelabs-creds.json');

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

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

  var caps = {
    name: 'appium-test/tests/sauce-ios-webview',
    browserName: 'Safari',
    platformVersion: '7.1',
    'appium-version': '1.0',
    platformName: 'iOS',
    deviceName: 'iPad Simulator'
  };
  browser.init(caps,
  function(err) {
    if (err) error('error initing', err);
    else browser.get("http://filmaj.ca", function(err) {
      if (err) error('error getting url', err);
      else browser.title(function(err, title) {
        if(err) error('error getting title', err);
        else browser.elementByLinkText('CV', function(err, el) {
          if (err) error('error clicking CV link', err);
          else browser.clickElement(el, function(err) {
            if (err) error('error clicking CV link', err);
            else browser.eval("window.location.href", function(err, href) {
              if (err) error('error getting location.href', err);
              else {
                browser.quit();
                if (cb) cb();
              }
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
