var test = require('./tests/android-native'),
    path = require('path'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

// Path to appium source code.
var appium = '/Users/filmaj/src/appium';
var server = path.resolve(path.join(appium, 'server.js'));

// Start of port number
var port_start = 4273;

// Holds appium instances
var servers = {};

// First run `adb devices` to get a list of connected devices.
exec('adb devices', function(err, stdout, stderr) {
  if (err) {
    console.error('ERROAR running `adb devices`!');
    console.error(err);
  } else {
    var devices = stdout.split('\n').filter(function(line) {
      return line.match(/device$/i);
    }).map(function(line) {
      return line.split('\t')[0];
    });

    console.log('Detected ' + devices.length + ' devices.');
    start_appium_servers(devices);
  }
});

function start_appium_servers(ids) {
  console.log('Kicking up ' + ids.length + ' appium instances...');
  for (var i = 0, n = ids.length; i < n; i++) (function(id) {
    var started = false;
    var appium_port = port_start + (i * 2);
    var device_port = port_start + (i * 2) + 1;
    servers[id] = spawn('node', [server, '--udid', id, '-p', appium_port, '-dp', device_port]);
    servers[id].stdout.on('data', function(data) {
      //console.log(id + '  |  ' + data);
      if (!started && data.toString().indexOf('Appium REST http interface listener started') > -1) {
        started = true;
        console.log('Starting test on device ' + id + '...');
        test(appium_port);
      }
    });
  })(ids[i]);
}
