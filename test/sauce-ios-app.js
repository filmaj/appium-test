import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

/*
 * You will need to upload a native iOS app to the sauce storage API.
 * Details: https://docs.saucelabs.com/reference/rest-api/#temporary-storage
 * The app for the test below can also be found at:
 * https://s3.amazonaws.com/sauce-misc/SampleCustomerApp.app.zip
 */

let browser = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs, ', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await browser.init({
                deviceName:'iPhone 6 Device',
                platformName:'iOS',
                platformVersion:'8.0',
                app:'sauce-storage:SampleIOSApp',
                name:'Real iOS device test w/ simple native app',
                "appium-version":"1.4.7"
            });
        } catch(err) {
            should.not.exist('Error connecting to Sauce Labs!', err);
        }
    });
    it('should load google.com', async () => {
        try {
            let button = await browser.elementByName('Second');
            await button.click();
            let view_text = await browser.elementByName('Second View');
            let is_text_visible = await view_text.isDisplayed();
            console.log('Is second view visible? ', is_text_visible);
        } catch (err) {
            should.not.exist('Error during test!', err);
        }
    });
    after(async () => {
        try {
            await browser.quit();
        } catch(err) {
            should.not.exist('Error quitting?', err);
        }
    });
});
