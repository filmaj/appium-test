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
                deviceName:'Android Emulator',
                platformVersion:'5.0',
                platformName:'Android',
                "appActivity": ".ContactManager",
                "appPackage": "com.example.android.contactmanager",
                app:"http://saucelabs.com/example_files/ContactManager.apk",
                "appium-version":"1.4.10",
                name:"Android Emulator test w a native app"
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('should scroll down in contact view', async () => {
        try {
            await app.setImplicitWaitTimeout(5000);
            await app.performTouchAction({"actions":[
                {action:"press",options:{x:"200",y:"200"}},
                {action:"wait",options:{}},
                {action:"moveTo",options:{x:"200",y:"100"}},
                {action:"release"}
            ]});
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
