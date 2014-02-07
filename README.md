# Appium Mobile Tests

> Get up and running with [Appium](https://github.com/appium/appium) on mobile in no time.

# Requirements

    $ cd into/this/repo
    $ npm install

## Running Locally

 * [Appium](https://github.com/appium/appium)
 * [ChromeDriver](https://code.google.com/p/chromedriver/downloads/list) + add it to your `PATH`

## Running on Saucelabs.com

 * A [saucelabs.com](http://saucelabs.com) account

# Doin' it

__ To run locally: __

Make sure you have one or more Android device(s) connected to your computer. Below are some tests you can run.

__ To run on saucelabs.com: __

Make sure you create a relevant `blah.json` file under `tests/`. See the sauce under one of the `tests/sauce-*.js` files to see what fields this JSON file should have.

If running remotely, it's pretty important to set the `version` parameter to match the Android version you are targeting (this is inside the `browser.init` call). You can also set `device-orientation` to either `landscape` or `portrait`, as well as `device-type` to either `phone` or `tablet`.

## Chrome for Android (local only)

This one runs through and asserts basic things about [my website](http://filmaj.ca) in Chrome.

Make sure the device you have connected is rooted!

    $ node tests/android-chrome.js

## Native Android Application (via UiAutomator)

This test clicks around inside an Android ContactManager native app. This does not require that the device is rooted.
This test requires Android 4.2 or newer.

To run locally:

    $ node tests/android-native.js

.. or to run on Saucelabs.com:

    $ node tests/sauce-uiautomator.js

## Stock Browser (via AndroidDriver)

Locally, do

    $ node tests/android-stock.js

.. or to run on Saucelabs.com:

    $ node tests/sauce-webdriver.js

## WebView Application (via Selendroid)

Locally, do

    $ node tests/android-selendroid.js

.. or to run on Saucelabs.com:

    $ node tests/sauce-selendroid.js

# Multiple Devices

Connect two (or more) Android devices to your computer. Edit the `appium` variable on line 9 to point to the location of your cloned Appium repository.

Then!

    $ node multidroid.js

This test will detect which Android device(s) connected to your computer are rooted and which are not, and will deploy
either a Chrome test (to rooted devices) or a native application test (to non-rooted devices).
