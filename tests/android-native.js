var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port, cb) {
  var app = wd.remote('localhost', port);

  app.on('status', function(info) {
    console.log(info.cyan);
  });

  app.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  app.init({
    device:'android',
    app:'http://saucelabs.com/example_files/ContactManager.apk'
    , "appPackage": "com.example.android.contactmanager"
    , "appActivity": ".ContactManager"
  }, function() {
    app.elementByName('Add Contact', function(err, el) {
      if (err) console.error('elementbyname add contacnt', err);
      else el.click(function(err) {
        app.elementsByClassName('android.widget.EditText', function(err, fields) {
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
                        app.back(function(err) {
                          if (err) console.error('back', err);
                          else app.elementByClassName('android.widget.Button', function(err, el) {
                            if (err) console.error('elbytagname button', err);
                            else el.text(function(err, text) {
                              if (err) console.error('button text', err);
                              else {
                                assert.equal(text, 'Save');
                                app.quit();
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
