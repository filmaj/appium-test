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

  var quit = function(msg, err) {
    console.error('msg', err);
    browser.quit();
  };

  browser.init({
      browserName:'Android',
      name:'5.0 emulator over SC w/ https to localhost',
      platform:'Linux',
      username:USER,
      accessKey:KEY,
      version: '5.0'
    }, function(err, session, caps) {
      if (err) quit('init error!', err);
      else browser.get('https://localhost:8000', function(err) {
        if (err) quit('get error!', err);
        else browser.title(function(err, result) {
          if (err) quit('title error!', err);
          else {
            console.log('Title is: ' + result);
            browser.quit();
          }
        });
      });
    });
}

if (require.main === module) {
  module.exports(4723);
}
