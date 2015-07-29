# Appium Mobile Tests

> Get up and running with [Appium](https://github.com/appium/appium) on mobile in no time.

Tests written in fancy new JavaScript :D

# Requirements

    $ cd into/this/repo
    $ npm install

## Running Locally

You will need to install and configure the following things to run tests locally on devices connected to your computer, or emulators running on your machine:

 * [Appium](https://github.com/appium/appium)
   * Make sure you [download the Android SDK](http://developer.android.com/sdk/index.html) and set your `ANDROID_HOME` environment to point to your SDK location.
 * [ChromeDriver](https://code.google.com/p/chromedriver/downloads/list) + add it to your `PATH`

## Running on Saucelabs.com

 * A [saucelabs.com](http://saucelabs.com) account

# Doin' it

## Locally

Make sure you have one or more Android device(s) connected to your computer, and an instance of Appium running. An emulator might work, too. Then do:

    npm test test/android-whatever.js

## Remotely on saucelabs.com

Make sure you create a relevant `dev.json` or `prod.json` file in the root of the repo. Production saucelabs.com credentials should look like this:

```
{
    "KEY":"somethingsomething,
    "USER":"filmaj",
    "HOST":"ondemand.saucelabs.com",
    "PORT":80
}
```

Once set up, set a `SAUCE_ENV` environment variable matching the name of the json file containing your credentials.

To run a speedtest with production credentials, do:

    SAUCE_ENV=prod npm test test/sauce-chrome-speedtest.js
