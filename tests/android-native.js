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
    device:'android',
    app:'http://saucelabs.com/example_files/ContactManager.apk'
    , "app-package": "com.example.android.contactmanager"
    , "app-activity": ".ContactManager"
  }, function() {
    browser.elementByName('Add Contact', function(err, el) {
      if (err) console.error('elementbyname add contacnt', err);
      else el.click(function(err) {
        browser.elementsByTagName('textfield', function(err, fields) {
          if (err) console.error('textfield',err);
          else {
            fields[0].type('My Name', function(err) {
              if (err) console.error('my name keys', err);
              else fields[2].type('someone@somewhere.com', function(err) {
                if (err) console.error('email keys', err);
                else fields[0].text(function(err, text) {
                  if (err) console.error('get field0 text', err);
                  else {
                    assert.equal(text, 'My Name');
                    fields[2].text(function(err, text) {
                      if (err) console.error('get field2 text', err);
                      else {
                        assert.equal(text, 'someone@somewhere.com');
                        browser.back(function(err) {
                          if (err) console.error('back', err);
                          else browser.elementByTagName('button', function(err, el) {
                            if (err) console.error('elbytagname button', err);
                            else el.text(function(err, text) {
                              if (err) console.error('button text', err);
                              else {
                                assert.equal(text, 'Add Contact');
                                browser.elementByXPath('//checkBox', function(err, el) {
                                  if (err) console.error('xpath', err);
                                  else el.click(function(err) {
                                    if (err) console.error('checkbox click', err);
                                    else el.text(function(err, text) {
                                      if (err) console.error('checkbox text', err);
                                      else {
                                        assert.equal(text, 'Show Invisible Contacts (Only)');
                                        browser.quit();
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
          }
        });
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
