var native_test = require('./tests/android-native'),
    chrome_test = require('./tests/android-chrome'),
    path = require('path'),
    n    = require('ncallbacks'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

// Path to appium source code.
var appium = '/Users/filmaj/src/appium';
var server = path.resolve(path.join(appium, 'server.js'));

// Start of port number
var port_start = 4273;

// Holds appium instances
var servers = {};

process.on('SIGINT', function() {
  var count = 0;
  Object.keys(servers).forEach(function(id) {
    servers[id].kill();
    count++;
  });
  console.log(count + ' Appium instances shut down, goodbye!');
});

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

    var device_list = [];
    var end = n(devices.length, function() {
      start_appium_servers(device_list);
    });
    devices.forEach(function(id) {
      exec('adb -s ' + id + ' root', function(err, stdout, stderr) {
        if (err) {
          console.error('ERROAR running `adb -s <id> root`!');
          console.error(err);
        } else {
          if (stdout.length) {
            if (stdout.indexOf('cannot run as root') > -1) {
              // No root access :(
              console.log('Device ' + id + ' is not rooted, will only be able to deploy native apps.');
              device_list.push({id:id,rooted:false});
            } else if (stdout.indexOf('disabled') > -1) {
              // Root access but it is disabled, be noisy.
              console.log('Device ' + id + ' _IS_ rooted but it is not enabled! Enable it under Settings -> Developer Options! In the mean time, will only deploy native apps to it.');
              device_list.push({id:id,rooted:false});
            } else if (stdout.indexOf('restarting adbd') > -1 || stdout.indexOf('already running as root') >-1) {
              // Yay root access!
              console.log('Device ' + id + ' _IS_ rooted, yay! We can run Chrome tests on it :D');
              device_list.push({id:id,rooted:true});
            } else {
              console.warn('WARNING! Weird output from `adb root`:');
              console.warn(stdout, stderr);
            }
            end();
          }
        }
      });
    });
  }
});

function start_appium_servers(devices) {
  console.log('Kicking up ' + devices.length + ' appium instances...');
  for (var i = 0, n = devices.length; i < n; i++) (function(device) {
    var id = device.id;
    var started = false;
    var appium_port = port_start + (i * 2);
    var device_port = port_start + (i * 2) + 1;
    servers[id] = spawn('node', [server, '--udid', id, '-p', appium_port, '-dp', device_port]);
    servers[id].stderr.on('data', function(data) { console.error(data.toString()); });
    servers[id].stdout.on('data', function(data) {
      // console.log(id + '  |  ' + data);
      if (!started && data.toString().indexOf('Appium REST http interface listener started') > -1) {
        started = true;
        if (device.rooted) {
          console.log('Starting Chrome test on device ' + id + '...');
          chrome_test(appium_port);
        } else {
          console.log('Starting native Android test on device ' + id + '...');
          native_test(appium_port);
        }
      }
    });
  })(devices[i]);
}
