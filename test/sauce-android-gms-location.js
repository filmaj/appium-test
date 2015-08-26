import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let app = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await app.init({
                deviceName:'Samsung Galaxy S4 Device',
                platformVersion:'4.4',
                platformName:'Android',
                app:"sauce-storage:locationapp.apk",
                "appium-version":"1.4.7"
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('show location', async () => {
        try {
            await app.setImplicitWaitTimeout(5000);
            await app.takeScreenshot();
            let button = await app.elementByClassName('android.widget.Button');
            await button.click();
            await app.takeScreenshot();
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            await app.quit();
        } catch (e) {
            should.not.exist('Error quitting!', e);
        }
    });
});
