var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');


module.exports = function(config_loc, cb) {
  var config = require(config_loc);

  var USER = config.USER;
  var PORT = config.PORT;
  var HOST = config.HOST;
  var KEY = config.KEY;
  var browser = wd.remote({
    host:HOST,
    port:PORT,
    username:USER,
    accessKey:KEY
  });

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
      name:'Chrome-For-Android for saucelabs.com on a REAL Samsung S4',
      browserName: 'Chrome',
      deviceName: 'Samsung Galaxy S4 Device',
      platformName: 'Android',
      platformVersion: '4.4',
      'appium-version':'1.2.2'
  }, function(err) {
    if (err) error('error initing', err);
    else browser.get("http://saucelabs.com", function(err) {
      if (err) error('error getting url', err);
      else browser.title(function(err, title) {
        if(err) error('error getting title', err);
        else browser.elementByClassName('hamburger', function(err, el) {
          if (err) error('error finding hamburger', err);
          else browser.clickElement(el, function(err) {
            if (err) error('error clicking hamburger', err);
            else browser.elementsByCssSelector('a[title="Enterprise"]', function(err, ent_els) {
              if (err) error('error finding enterprise el', err);
              else ent_els[1].click(function(err) {
                if (err) error('error clicking enterprise el', err);
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
  });
}

if (require.main === module) {
  module.exports('./fil-stew-creds.json');
}
