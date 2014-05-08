var wd = require('wd'),
    assert = require('assert'),
    colors = require('colors');

var config = require('./fil-saucelabs-creds.json');

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

  browser.init({
    name:'Contact Manager Native Application Test on Nexus4',
    device:'LG Nexus 4 Emulator',
    app:'http://saucelabs.com/example_files/ContactManager.apk',
    "app-activity": ".ContactManager",
    "app-package": "com.example.android.contactmanager",
    username:USER,
    accessKey:KEY,
    platform: 'Linux',
    version: '4.3'
  }, function(err) {
    if (err) console.error('init err!', err);
    else browser.elementByName('Add Contact', function(err, el) {
      if (err) console.error('get add contact', err);
      else el.click(function(err) {
        if (err) console.error('click add contact', err);
        else browser.elementsByTagName('textfield', function(err, fields) {
          if (err) console.error('get textfields', err);
          else fields[0].type('My Name', function(err) {
            if (err) console.error('type into fields[0]', err);
            else fields[2].type('someone@somewhere.com', function(err) {
              if (err) console.error('type into fields[2]', err);
              else fields[0].text(function(err, text) {
                if (err) console.error('get text fields[0]', err);
                else {
                  assert.equal(text, 'My Name');
                  fields[2].text(function(err, text) {
                    if (err) console.error('get text fields[2]', err);
                    else {
                      assert.equal(text, 'someone@somewhere.com');
                      browser.back(function(err) {
                        if (err) console.error('back err', err);
                        else browser.elementByTagName('button', function(err, btn) {
                          if (err) console.error('get button', err);
                          else btn.text(function(err, text) {
                            if (err) console.error('get button txt', err);
                            else {
                              assert.equal(text, 'Add Contact');
                              browser.elementByXPath('//checkBox', function(err, box) {
                                if (err) console.error('get checkbox', err);
                                else box.click(function(err) {
                                  if (err) console.error('click checkbox', err);
                                  else box.text(function(err, text) {
                                    if (err) console.error('get checkbox text', err);
                                    else {
                                      assert.equal(text, 'Show Invisible Contacts (Only)');
                                      browser.quit() 
                                      if (cb) cb();
                                    }
                                  });
                                });
                              });
                            }
                          });
                        });
                      });
                    }
                  });
                }
              });
            });
          });
        });
      });
    });
  });
};

if (require.main === module) {
  module.exports(4723);
}
