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
 *
 * Then upload to sauce REST api's temporary storage:
 * https://docs.saucelabs.com/reference/rest-api/#temporary-storage
 * i.e.
 * curl -u yourusername:youraccesskey -X POST -H "Content-Type:\ application/octet-stream" https://saucelabs.com/rest/v1/storage/yourusername/CordovaApp.apk\?overwrite\=true --data-binary @/path/to/android-debug.apk
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let app = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await app.init({
                name:"Cordova Android app on Galaxy S5 device",
                deviceName:'Samsung Galaxy S5 Device',
                platformName:'Android',
                platformVersion:'4.4',
                autoWebview:true,
                app:'sauce-storage:CordovaApp.apk',
                "appium-version":"1.4.11"
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('should load the standard Cordova webview app', async () => {
        try {
            await app.setImplicitWaitTimeout(5000);
            let deviceready_element = await app.elementById('deviceready');
            let is_device_ready = await deviceready_element.isDisplayed();
            console.log('Is deviceready element visible? (this should say true) ', is_device_ready);
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            await app.quit();
        } catch(e) { 
            should.not.exist('Error quitting!', e);
        }
    });
});
