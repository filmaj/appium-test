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

let app = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs, on a real iOS device...', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await app.init({
                deviceName:'iPhone 6 Device',
                platformName:'iOS',
                platformVersion:'8.0',
                app:'sauce-storage:SampleCustomerApp.app.zip',
                name:'Real iOS device test w/ simple native app',
                "appium-version":"1.4.7"
            });
        } catch(err) {
            should.not.exist('Error connecting to Sauce Labs!', err);
        }
    });
    it('should load a simple iOS native app and switch views', async () => {
        try {
            let button = await app.elementByName('Second');
            await button.click();
            let view_text = await app.elementByName('Second View');
            let is_text_visible = await view_text.isDisplayed();
            console.log('Is second view visible? (this should say true) ', is_text_visible);
        } catch (err) {
            should.not.exist('Error during test!', err);
        }
    });
    after(async () => {
        try {
            await app.quit();
        } catch(err) {
            should.not.exist('Error quitting?', err);
        }
    });
});
