# Appium Mobile Tests

> Get up and running with [Appium](https://github.com/appium/appium) on mobile in no time.

# Requirements

 * [Appium](https://github.com/appium/appium)
 * [ChromeDriver](https://code.google.com/p/chromedriver/downloads/list) + add it to your `PATH`

    $ cd into/this/repo
    $ npm install

# Doin' it

Make sure you have one or more Android device(s) connected to your computer. Below are some tests you can run.

## Chrome for Android

This one runs through and asserts basic things about [my website](http://filmaj.ca) in Chrome.

Make sure the device you have connected is rooted!

    $ node tests/android-chrome.js

## Native Android Application

This test clicks around inside the standard Android Settings application. This does not require that the device is rooted.

    $ node tests/android-native.js

# Multiple Devices

Connect two (or more) Android devices to your computer. Then!

    $ node droid-native.js
