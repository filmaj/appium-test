/*global it:true */

/* EXAMPLE APPIUM + SAUCE LABS INTEGRATION
   First: npm install mocha -g; npm install wd
   Usage: SAUCE_USERNAME=xxx SAUCE_ACCESS_KEY=yyy mocha sauce-android.js */

"use strict";

var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors')
  , appUrl = 'http://appium.s3.amazonaws.com/NotesList.apk'
  , browser = wd.remote('localhost', 4723);

browser.on('status', function(info) {
  console.log(info.cyan);
});

browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

browser.init({
  device:'Android',
  app:appUrl
  , "app-activity": ".Settings"
  , "app-package": "com.android.settings"
}, function() {
});
