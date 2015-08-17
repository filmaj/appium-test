/* global describe:true, before:true, after:true, it:true */
// transpile:mocha

/*
 * Uses a cordova application! Super easy to get one going:
 *   - npm install -g cordova
 *   - cordova create hybrid
 *   - cd hybrid
 *   - cordova platform add android
 *   - cordova build
 *   use the final path to the output apk in the `app` config option below
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mochawait';
import wd from 'wd';

let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let browser = wd.promiseChainRemote('localhost', port);

describe('Local Appium instance', function() {
    before(async () => {
        try {
            await browser.init({
                deviceName:'Samsung Galaxy Device',
                platformName:'Android',
                autoWebview:true,
                app:'/Users/filmaj/src/hybrid/platforms/android/build/outputs/apk/android-debug.apk',
                "app-activity": ".HelloCordova",
                "app-package": "io.cordova.hellocordova",
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('should load google\'s webpage and the title should be correct', async () => {
        try {
            await browser.setImplicitWaitTimeout(5000);
            let deviceready_element = await browser.elementById('deviceready');
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        browser.quit();
    });
});
