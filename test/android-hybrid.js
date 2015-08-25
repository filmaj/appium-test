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
import wd from 'wd';

let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let app = wd.promiseChainRemote('localhost', port);

describe('Local Appium instance', function() {
    this.timeout(60000);
    before(async () => {
        try {
            await app.init({
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
            await app.setImplicitWaitTimeout(5000);
            let deviceready_element = await app.elementById('deviceready');
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            app.quit();
        } catch(e) { 
            should.not.exist('Error quitting!', e);
        }
    });
});
